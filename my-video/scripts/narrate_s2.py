"""Generate the S2 video narration with the authorized ElevenLabs Brian voice; never prints secrets."""
import json
import subprocess
from pathlib import Path

import httpx
from dotenv import dotenv_values

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/s2'
SCRIPT = ROOT / 'src/s2/narration.json'
VOICE = 'nPczCjzI2devNBz1zQrb'  # Brian, same voice as the S1 video
BIN = ROOT / 'node_modules/@remotion/compositor-win32-x64-msvc'


def duration(path: Path) -> float:
    out = subprocess.check_output([str(BIN / 'ffprobe.exe'), '-v', 'error', '-show_entries', 'format=duration',
                                   '-of', 'json', str(path)])
    return float(json.loads(out)['format']['duration'])


def main() -> int:
    key = dotenv_values(ROOT.parent / '.env').get('ELEVENLABS_API_KEY')
    if not key:
        print('ELEVENLABS_API_KEY absent; nothing generated.')
        return 2
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = []
    with httpx.Client(base_url='https://api.elevenlabs.io', headers={'xi-api-key': key}, timeout=120) as client:
        for item in json.loads(SCRIPT.read_text(encoding='utf-8')):
            target = OUT / f"{item['id']}.mp3"
            if not target.exists():
                r = client.post(f'/v1/text-to-speech/{VOICE}', params={'output_format': 'mp3_44100_128'},
                                json={'text': item['text'], 'model_id': 'eleven_multilingual_v2',
                                      'voice_settings': {'stability': .6, 'similarity_boost': .75, 'style': .1,
                                                         'use_speaker_boost': True}})
                if r.status_code != 200 or not r.headers.get('content-type', '').startswith('audio/'):
                    print(f"{item['id']}: HTTP {r.status_code}; stopped, earlier clips kept.")
                    return 2
                target.write_bytes(r.content)
            manifest.append({'id': item['id'], 'file': f"s2/{target.name}", 'seconds': round(duration(target), 3)})
    (ROOT / 'src/s2/audio-manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
    print(json.dumps(manifest))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
