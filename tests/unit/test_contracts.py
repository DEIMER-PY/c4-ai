"""Validate externally documented fixtures and invalid input at the boundary."""
from copy import deepcopy
import json
from pathlib import Path
import unittest

from pydantic import ValidationError
from c4.schemas import Agent, CaseResult, Error, Evaluation, Incident, Job, Patch, Report, Run, Score, SyntheticScenario

ROOT = Path(__file__).resolve().parents[2]


class ContractTests(unittest.TestCase):
    def setUp(self):
        self.scenario = json.loads((ROOT / "examples/contracts/scenario.json").read_text(encoding="utf-8"))
        self.api = json.loads((ROOT / "examples/contracts/api-responses.json").read_text(encoding="utf-8"))

    def test_documented_scenario_roundtrips(self):
        actual = SyntheticScenario.model_validate(self.scenario)
        self.assertEqual(actual.model_dump(mode="json"), self.scenario)

    def test_wire_fields_match_frontend_schema(self):
        reference = json.loads((ROOT / "examples/contracts/schemas.json").read_text(encoding="utf-8"))["$defs"]
        for model in (Agent, Run, Incident, Patch, Score, CaseResult, Evaluation, Error, Job, Report):
            with self.subTest(model=model.__name__):
                actual, expected = model.model_json_schema(), reference[model.__name__]
                self.assertEqual(set(actual["properties"]), set(expected["properties"]))
                self.assertEqual(set(actual["required"]), set(expected["required"]))

    def test_three_documented_decision_bundles(self):
        for name in ("accepted", "rejected", "incomplete"):
            with self.subTest(name=name):
                bundle = self.api[name]
                Patch.model_validate(bundle["patch"])
                Evaluation.model_validate(bundle["evaluation"])
                Report.model_validate(bundle["report"])

    def test_documented_pending_and_failed_jobs(self):
        Job.model_validate(self.api["pending_job"])
        Job.model_validate(self.api["failed_job"])

    def test_unknown_fields_rejected(self):
        value = deepcopy(self.scenario["run"])
        value["provider_key"] = "not-a-real-secret"
        with self.assertRaises(ValidationError):
            Run.model_validate(value)

    def test_counters_reject_negative_boolean_and_string(self):
        for invalid in (-1, True, "1200"):
            with self.subTest(value=invalid):
                value = deepcopy(self.scenario["run"])
                value["latency_ms"] = invalid
                with self.assertRaises(ValidationError):
                    Run.model_validate(value)

    def test_empty_identifier_rejected(self):
        value = deepcopy(self.scenario["incident"])
        value["run_id"] = ""
        with self.assertRaises(ValidationError):
            SyntheticScenario.model_validate({**self.scenario, "incident": value})

    def test_timezone_required_and_normalized(self):
        value = deepcopy(self.scenario["agents"][0])
        value["created_at"] = "2026-10-11T12:00:00"
        with self.assertRaises(ValidationError):
            Agent.model_validate(value)
        value["created_at"] = "2026-10-11T07:00:00-05:00"
        self.assertEqual(Agent.model_validate(value).model_dump(mode="json")["created_at"], "2026-10-11T12:00:00Z")

    def test_agent_version_is_immutable(self):
        value = Agent.model_validate(self.scenario["agents"][0])
        with self.assertRaises(ValidationError):
            value.version = "unexpected-edit"

    def test_unknown_cost_stays_null(self):
        actual = Run.model_validate(self.scenario["run"])
        self.assertIsNone(actual.model_dump(mode="json")["usage"]["cost_usd"])

    def test_scores_cannot_exceed_case_count(self):
        with self.assertRaises(ValidationError):
            Score.model_validate({"passed": 3, "total": 2})

    def test_regressions_cannot_be_hidden(self):
        value = deepcopy(self.api["rejected"]["evaluation"])
        value["regressions"] = []
        with self.assertRaises(ValidationError):
            Evaluation.model_validate(value)

    def test_duplicate_case_rejected(self):
        value = deepcopy(self.scenario["evaluation"])
        value["case_results"].append(deepcopy(value["case_results"][0]))
        with self.assertRaises(ValidationError):
            Evaluation.model_validate(value)

    def test_accepted_report_needs_evaluation(self):
        value = deepcopy(self.scenario["report"])
        value["evaluation_id"] = None
        with self.assertRaises(ValidationError):
            Report.model_validate(value)

    def test_cross_entity_reference_rejected(self):
        value = deepcopy(self.scenario)
        value["evaluation"]["patch_id"] = "unknown-patch"
        with self.assertRaises(ValidationError):
            SyntheticScenario.model_validate(value)


if __name__ == "__main__":
    unittest.main()
