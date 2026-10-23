"""Prepare film narration from an authorized ElevenLabs account; never print secrets."""
import argparse
import getpass
import json
import math
import os
from pathlib import Path
import subprocess
import sys

import httpx
from dotenv import dotenv_values, set_key

ROOT = Path(__file__).resolve().parents[1]
ENV = ROOT.parent / '.env'
OUT = ROOT / 'public/film'
SCRIPT = ROOT / 'film-narration.json'
COMPOSITOR = ROOT / 'node_modules/@remotion/compositor-win32-x64-msvc'


def duration(path):
    result = subprocess.run([str(COMPOSITOR / 'ffprobe.exe'), '-v', 'error', '-show_entries',
                             'format=duration', '-of', 'json', str(path)], capture_output=True, check=True)
    return float(json.loads(result.stdout)['format']['duration'])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--configure', action='store_true')
    parser.add_argument('--list-voices', action='store_true')
    parser.add_argument('--generate', action='store_true')
    parser.add_argument('--assemble', action='store_true', help='Use existing local clips without contacting ElevenLabs')
    args = parser.parse_args()
    if args.configure:
        if not sys.stdin.isatty():
            parser.error('Use --configure only in your own interactive terminal.')
        key = getpass.getpass('ElevenLabs API key (hidden): ').strip()
        if not key:
            parser.error('No key entered; no file changed.')
        set_key(str(ENV), 'ELEVENLABS_API_KEY', key)
        print('Saved only to the ignored local .env. Key not displayed.')
        return 0
    values = {**dotenv_values(ENV), **os.environ}
    key = values.get('ELEVENLABS_API_KEY')
    if (args.list_voices or args.generate) and not key:
        print('ELEVENLABS_API_KEY absent. Configure locally; no request submitted.')
        return 2
    script = json.loads(SCRIPT.read_text(encoding='utf-8'))
    voice_id = values.get('ELEVENLABS_VOICE_ID')
    if args.list_voices or args.generate:
        with httpx.Client(base_url='https://api.elevenlabs.io', headers={'xi-api-key': key}, timeout=120) as client:
            if args.list_voices or not voice_id:
                response = client.get('/v2/voices', params={'search': 'Dylan', 'page_size': 100})
                if response.status_code != 200:
                    print(f'Voice lookup failed: HTTP {response.status_code}; credentials not logged.')
                    return 2
                voices = response.json().get('voices', [])
                matches = [v for v in voices if 'dylan' in v.get('name', '').lower()]
                print(json.dumps([{'name': v['name'], 'voice_id': v['voice_id']} for v in matches]))
                if args.list_voices:
                    return 0
                if len(matches) != 1:
                    print('Set ELEVENLABS_VOICE_ID locally to the intended Dylan voice; no generation submitted.')
                    return 2
                voice_id = matches[0]['voice_id']
            OUT.mkdir(parents=True, exist_ok=True)
            for item in script:
                target = OUT / f"dylan-scene-{item['scene']}.mp3"
                if target.exists():
                    print(f"Scene {item['scene']}: existing clip retained.")
                    continue
                response = client.post(f'/v1/text-to-speech/{voice_id}', params={'output_format':'mp3_44100_128'},
                    json={'text':item['text'], 'model_id':'eleven_multilingual_v2',
                          'voice_settings':{'stability':.55,'similarity_boost':.75,'style':.15,'use_speaker_boost':True}})
                if response.status_code != 200:
                    print(f"Scene {item['scene']} failed: HTTP {response.status_code}. Prior clips retained; no automatic retry.")
                    return 2
                if not response.headers.get('content-type','').startswith('audio/'):
                    print('Unexpected content type; response not saved or logged.')
                    return 2
                target.write_bytes(response.content)
                print(f"Scene {item['scene']}: audio saved.")
    if args.assemble or args.generate:
        clips=[]
        missing=[]
        for item in script:
            source=OUT / f"dylan-scene-{item['scene']}.mp3"
            if not source.exists():
                missing.append(item['scene'])
                continue
            seconds=duration(source)
            available=item['duration']-1.2
            speed=max(1.,seconds/available)
            if speed>1.2:
                print(f"Scene {item['scene']} too long ({seconds:.2f}s); shorten script or regenerate, never truncate.")
                return 2
            final=OUT / f"scene-{item['scene']}.mp3"
            subprocess.run([str(COMPOSITOR/'ffmpeg.exe'),'-hide_banner','-loglevel','error','-y','-i',str(source),
                '-af',f'atempo={speed:.6f}', '-codec:a','libmp3lame','-b:a','192k',str(final)],check=True)
            clips.append({'file':f"film/{final.name}",'startFrame':item['start']*30+18,
                          'durationFrames':math.ceil(duration(final)*30),'source':'ElevenLabs / Dylan', 'tempo':round(speed,4)})
        manifest={'voice':'Dylan / ElevenLabs', 'complete':not missing,'missing_scenes':missing,'clips':clips}
        (ROOT/'src/film/audio-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
        (OUT/'audio-provenance.json').write_text(json.dumps({**manifest,'cost_usd':None,
            'note':'Scene 3 generated via Higgsfield ElevenLabs Dylan; other clips via authorized account when available. No key stored here.'},indent=2)+'\n',encoding='utf-8')
        print(json.dumps({'assembled':len(clips),'missing_scenes':missing}))
        return 2 if missing else 0
    return 0


if __name__=='__main__':
    raise SystemExit(main())
