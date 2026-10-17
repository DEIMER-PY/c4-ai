import copy
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi.testclient import TestClient

from c4.api import create_app
from c4.schemas import Agent, Evaluation, Incident, Job, Patch, Report, Run


class EvidenceApiTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root=Path(self.tmp.name)
        f=json.loads(Path('examples/contracts/scenario.json').read_text(encoding='utf-8'))
        self.state={'id':'c4_'+'a'*32,'baseline_agent':f['agents'][0],'candidate_agent':f['agents'][1],
                    **{key:f[key] for key in ('run','incident','patch','evaluation','job','report')}}
        self.state['dataset']={'data':{'cases':[{'id':row['case_id'],'mandatory_security':True}
                                        for row in f['evaluation']['case_results']]}}
        self.file=self.root/self.state['id']/'evidence.json'
        self.save()
        self.client=TestClient(create_app(self.root))
        self.addCleanup(self.client.close)

    def save(self):
        self.file.parent.mkdir(exist_ok=True)
        self.file.write_text(json.dumps(self.state),encoding='utf-8')

    def test_existing_contracts_are_served_without_network_or_writes(self):
        original=self.file.read_bytes()
        routes=[('runs','run',Run),('incidents','incident',Incident),('jobs','job',Job),
                ('patches','patch',Patch),('evaluations','evaluation',Evaluation)]
        with patch('c4.tools.grok.Gateway',side_effect=AssertionError('network forbidden')):
            for route,key,model in routes:
                response=self.client.get('/api/v1/'+route+'/'+self.state[key]['id'])
                self.assertEqual(response.status_code,200,response.text)
                model.model_validate(response.json())
                self.assertEqual(response.headers['cache-control'],'no-store')
            report=self.client.get('/api/v1/incidents/'+self.state['incident']['id']+'/report')
            self.assertEqual(report.status_code,200,report.text)
            Report.model_validate(report.json())
        self.assertEqual(self.file.read_bytes(),original)
        self.assertEqual(list(self.file.parent.iterdir()),[self.file])

    def test_pagination_and_empty_store(self):
        first=self.client.get('/api/v1/agents?limit=1').json()
        self.assertEqual(len(first['items']),1)
        Agent.model_validate(first['items'][0])
        second=self.client.get('/api/v1/agents',params={'limit':1,'cursor':first['next_cursor']}).json()
        self.assertNotEqual(first['items'][0]['id'],second['items'][0]['id'])
        self.assertIsNone(second['next_cursor'])
        self.file.unlink()
        self.assertEqual(self.client.get('/api/v1/incidents').json(),{'items':[],'next_cursor':None})

    def test_errors_do_not_reflect_inputs_or_paths(self):
        self.assertEqual(self.client.get('/api/v1/incidents/unknown-id').status_code,404)
        for url in ('/api/v1/agents?limit=0','/api/v1/agents?cursor=..','/api/v1/incidents/bad.id'):
            response=self.client.get(url)
            self.assertEqual(response.status_code,422,response.text)
            self.assertEqual(set(response.json()),{'code','message','retryable','details'})
        self.file.write_text('{broken-private-secret-value',encoding='utf-8')
        response=self.client.get('/api/v1/incidents')
        self.assertEqual(response.status_code,503)
        self.assertFalse(response.json()['retryable'])
        self.assertNotIn('private-secret',response.text)
        self.assertNotIn(str(self.root),response.text)

    def test_incomplete_checkpoint_preserves_job_and_missing_report(self):
        for key in ('report','evaluation','patch','candidate_agent','run'):
            self.state.pop(key)
        self.state['job'].update(status='running',stage='inspect')
        self.state['incident']['status']='detected'
        self.save()
        self.assertEqual(self.client.get('/api/v1/incidents').status_code,200)
        response=self.client.get('/api/v1/jobs/'+self.state['job']['id'])
        self.assertEqual(response.json()['status'],'running')
        self.assertEqual(self.client.get('/api/v1/incidents/'+self.state['incident']['id']+'/report').status_code,404)

    def test_unsafe_accepted_evidence_is_rejected(self):
        for mutation in ('incomplete','regression','relationship'):
            with self.subTest(mutation=mutation):
                original=copy.deepcopy(self.state)
                if mutation=='incomplete':self.state['evaluation']['status']='running'
                elif mutation=='regression':self.state['evaluation']['security_passed']=False
                else:self.state['report']['evaluation_id']='other-evaluation'
                self.save()
                self.assertEqual(self.client.get('/api/v1/incidents').status_code,503)
                self.state=original

    def test_write_routes_are_not_exposed_and_openapi_available(self):
        self.assertEqual(self.client.post('/api/v1/incidents').status_code,405)
        self.assertEqual(self.client.post('/api/v1/runs').status_code,404)
        response=self.client.get('/openapi.json')
        self.assertEqual(response.status_code,200)
        self.assertIn('/api/v1/incidents/{entity_id}/report',response.json()['paths'])
        self.assertEqual(self.client.get('/health').json()['mode'],'local_read_only')

    def test_failed_provider_job_is_readable_without_retrying_it(self):
        self.state['job'].update(status='failed',error={'code':'provider_http','message':'Proveedor no disponible',
                                                      'retryable':True,'details':{}})
        self.state['incident']['status']='needs_human_review'
        self.state['patch']['approval_status']='needs_human_review'
        self.state['evaluation']['status']='failed'
        self.state['report']['decision']='needs_human_review'
        self.save()
        response=self.client.get('/api/v1/jobs/'+self.state['job']['id'])
        self.assertEqual(response.status_code,200)
        self.assertEqual(response.json()['error']['code'],'provider_http')
        report=self.client.get('/api/v1/incidents/'+self.state['incident']['id']+'/report')
        self.assertEqual(report.json()['decision'],'needs_human_review')

    def test_duplicate_entities_do_not_hide_corrupt_evidence(self):
        other=self.root/('c4_'+'b'*32)
        other.mkdir()
        state={**self.state,'id':other.name}
        (other/'evidence.json').write_text(json.dumps(state),encoding='utf-8')
        self.assertEqual(self.client.get('/api/v1/incidents').status_code,503)
