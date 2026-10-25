"""Generate authorized Brian narration; assemble offline without replacing originals."""
import argparse
import array
import hashlib
import json
import math
from pathlib import Path
import subprocess
import wave

import httpx
from dotenv import dotenv_values

ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.parent
OUT = ROOT / 'public/extension-voice'
WORK = REPO / 'artifacts/elevenlabs-brian'
SCRIPT = ROOT / 'src/extension/brian-narration.json'
VOICE = 'nPczCjzI2devNBz1zQrb'
MODEL = 'eleven_multilingual_v2'
RATE = 48000
BIN = ROOT / 'node_modules/@remotion/compositor-win32-x64-msvc'
SETTINGS = {'stability': .6, 'similarity_boost': .75, 'style': .1, 'use_speaker_boost': True}


def ffmpeg(*args):
    subprocess.run([str(BIN/'ffmpeg.exe'), '-hide_banner', '-loglevel', 'error', '-y', *map(str,args)], check=True)


def probe(path):
    return json.loads(subprocess.check_output([str(BIN/'ffprobe.exe'), '-v','error','-show_streams','-show_format','-of','json',str(path)]))


def pcm(path):
    with wave.open(str(path)) as stream:
        assert stream.getframerate() == RATE and stream.getnchannels() == 1
        assert stream.getsampwidth() == 2
        return array.array('h', stream.readframes(stream.getnframes()))


def rms(samples):
    return math.sqrt(sum(x*x for x in samples)/max(1,len(samples)))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--generate',action='store_true',help='Contact ElevenLabs; otherwise mix cached clips only')
    args = parser.parse_args()
    WORK.mkdir(parents=True,exist_ok=True)
    OUT.mkdir(parents=True,exist_ok=True)
    script = json.loads(SCRIPT.read_text(encoding='utf-8'))
    clips=[]
    key=dotenv_values(REPO/'.env').get('ELEVENLABS_API_KEY')
    # No library import, plan change, voice cloning or automatic provider retry.
    with httpx.Client(base_url='https://api.elevenlabs.io',headers={'xi-api-key':key or ''},timeout=120) as client:
        record_path=ROOT/'src/extension/brian-manifest.json'
        recorded=json.loads(record_path.read_text(encoding='utf-8')) if record_path.exists() else {}
        before=recorded.get('usage_before') if not args.generate else None
        if args.generate:
            if not key: raise RuntimeError('Local ELEVENLABS_API_KEY required; never paste it into source.')
            response=client.get('/v1/user/subscription')
            if response.status_code==200: before=response.json().get('character_count')
        for item in script:
            digest=hashlib.sha256(json.dumps([item['text'],VOICE,MODEL,SETTINGS],sort_keys=True).encode()).hexdigest()[:12]
            source=OUT/f"{item['id']}-{digest}.mp3"
            if not source.exists():
                if not args.generate: raise RuntimeError(f"Missing clip {item['id']}; run with --generate explicitly.")
                response=client.post(f'/v1/text-to-speech/{VOICE}',params={'output_format':'mp3_44100_128'},
                    json={'text':item['text'],'model_id':MODEL,'language_code':'es','voice_settings':SETTINGS})
                if response.status_code!=200:
                    raise RuntimeError(f"Clip {item['id']}: HTTP {response.status_code}; no automatic retry, existing clips retained.")
                if not response.headers.get('content-type','').startswith('audio/'):
                    raise RuntimeError('Unexpected response type; not saved.')
                source.write_bytes(response.content)
            seconds=float(probe(source)['format']['duration'])
            available=item['end']-item['start']
            speed=max(1,seconds/available)
            if speed>1.2: raise RuntimeError(f"Shorten {item['id']}: {seconds:.2f}s for {available:.2f}s; never truncate speech.")
            decoded=WORK/f"{item['id']}.wav"
            ffmpeg('-i',source,'-af',f'atempo={speed:.8f}','-ar',RATE,'-ac',1,'-c:a','pcm_s16le',decoded)
            samples=pcm(decoded)
            if len(samples)>round(available*RATE)+480: raise RuntimeError(f"Speech exceeds slot: {item['id']}")
            # Preserve complete words. Tiny codec rounding may use reserved gap after the slot.
            clips.append({**item,'file':str(source.relative_to(ROOT/'public')).replace('\\','/'),
                          'source_seconds':round(seconds,4),'tempo':round(speed,6),'samples':samples})
            print(f"{item['id']}: {seconds:.2f}s, tempo {speed:.3f}",flush=True)
        after=recorded.get('usage_after') if not args.generate else None
        if args.generate:
            response=client.get('/v1/user/subscription')
            if response.status_code==200: after=response.json().get('character_count')
    length=120*RATE
    speech=array.array('f',[0])*length
    active=bytearray(length)
    for item in clips:
        samples=item['samples']; start=round(item['start']*RATE)
        gain=min((32768*10**(-20/20))/max(1,rms(samples)),26000/max(1,max(abs(x) for x in samples)))
        for n,value in enumerate(samples):
            speech[start+n]+=value*gain
            active[start+n]=1
    ambient=WORK/'ambient.wav'
    ffmpeg('-stream_loop','-1','-i',ROOT/'public/launch/ambient-drone.mp3','-t',120,'-ar',RATE,'-ac',1,'-c:a','pcm_s16le',ambient)
    music=pcm(ambient)
    music_gain=(32768*10**(-34/20))/max(1,rms(music))
    duck=1.0
    for n in range(length):
        # Gentle envelope avoids pumping/clicks at speech boundaries.
        target=.48 if active[n] else 1.0
        duck+=(target-duck)/2400
        fade=min(1,n/(RATE*.6),(length-1-n)/(RATE*1.2))
        speech[n]+=music[n]*music_gain*duck*fade
    peak=max(abs(x) for x in speech)
    gain=min(1,(32768*10**(-2/20))/max(1,peak))
    final=array.array('h',(round(x*gain) for x in speech))
    wav=WORK/'brian-120s.wav'
    with wave.open(str(wav),'wb') as stream:
        stream.setnchannels(1);stream.setsampwidth(2);stream.setframerate(RATE);stream.writeframes(final.tobytes())
    track=OUT/'brian-120s.mp3'
    ffmpeg('-i',wav,'-c:a','libmp3lame','-b:a','192k',track)
    video=REPO/'artifacts/c4-ai-santiago-extended-120s.mp4'
    target=REPO/'artifacts/c4-ai-santiago-brian-120s.mp4'
    ffmpeg('-i',video,'-i',wav,'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k',
           '-ar',RATE,'-ac',2,'-t',120,'-movflags','+faststart','-metadata','title=C4 AI - Brian narration',target)
    info=probe(target); v=next(s for s in info['streams'] if s['codec_type']=='video')
    assert int(v['nb_frames'])==3600 and abs(float(v['duration'])-120)<.001
    manifest={'voice':'Brian - Deep, Resonant and Comforting','voice_id':VOICE,'model':MODEL,'language':'es',
        'complete':True,'duration_seconds':120,'frames':3600,'sample_rate':RATE,
        'usage_before':before,'usage_after':after,'usage_delta':after-before if before is not None and after is not None else None,
        'usage_scope':'before/after/delta refer to latest generation invocation only; previous clips were cached. Account total includes earlier attempts and sample.',
        'cost_usd':None,'peak_dbfs':round(20*math.log10(max(abs(x) for x in final)/32768),2),
        'clipped_samples':sum(abs(x)>=32767 for x in final),'video_sha256':hashlib.sha256(target.read_bytes()).hexdigest(),
        'mix':'Original audio replaced entirely; complete Brian narration and synthesized local ambient with ducking.',
        'clips':[{k:v for k,v in item.items() if k!='samples'} for item in clips]}
    (ROOT/'src/extension/brian-manifest.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    print(json.dumps({k:v for k,v in manifest.items() if k!='clips'},ensure_ascii=False),flush=True)


if __name__=='__main__': main()
