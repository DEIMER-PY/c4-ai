"""Generate original deterministic sound design and mix a replaceable local VO."""
from array import array
import json
import math
from pathlib import Path
import random
import subprocess
import wave

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/launch'
OUT.mkdir(parents=True, exist_ok=True)
SR = 48000
FFMPEG = ROOT / 'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'


def save(name, duration, fn):
    data = array('h', (round(max(-.97, min(.97, fn(i / SR, i))) * 32767) for i in range(round(SR * duration))))
    wav = OUT / (name + '.wav')
    with wave.open(str(wav), 'wb') as out:
        out.setparams((1, 2, SR, 0, 'NONE', 'not compressed'))
        out.writeframes(data.tobytes())
    subprocess.run([str(FFMPEG), '-hide_banner', '-loglevel', 'error', '-y', '-i', str(wav), '-codec:a', 'libmp3lame', '-b:a', '192k', str(OUT / (name + '.mp3'))], check=True)


def fade(t, duration, attack=.04, release=.2):
    return min(1, t / attack) * min(1, max(0, (duration - t) / release))


rng = random.Random(24)
save('ambient-drone', 15, lambda t, _: fade(t, 15, .8, 1.1) * sum(math.sin(math.tau * hz * t + j * .7) * amp * (1 + .12 * math.sin(math.tau * (.08 + j * .017) * t)) for j, (hz, amp) in enumerate([(55, .17), (82.4069, .09), (110, .08), (164.8138, .05), (220, .025)])))
save('sub-drop', 1, lambda t, _: math.sin(math.tau * (71 * t - 22 * t * t)) * .65 * math.exp(-t * 5) * min(1, t / .008))
save('whoosh', .8, lambda t, _: (rng.uniform(-1, 1) * .32 + math.sin(math.tau * (140 * t + 900 * t * t)) * .075) * math.sin(math.pi * t / .8) ** 3)
save('keystroke', .19, lambda t, _: ((rng.uniform(-1, 1) * .3 + math.sin(math.tau * 1450 * (t % .095)) * .16) * math.exp(-(t % .095) * 170) * min(1, (t % .095) / .001)))
save('success-ping', 1.4, lambda t, _: fade(t, 1.4, .005, .5) * sum(math.sin(math.tau * hz * t) * a * math.exp(-t * d) for hz, a, d in [(659.255, .22, 3.5), (987.767, .13, 4), (1318.51, .07, 5), (1975.53, .035, 6)]))

mixed = [0.] * (15 * SR)
windows = []
for n, offset in enumerate([.35, 3.85, 10.85]):
    with wave.open(str(OUT / f'voice-part-{n}.wav'), 'rb') as src:
        if src.getsampwidth() != 2 or src.getnchannels() != 1:
            raise RuntimeError('VO must be PCM16 mono before mixing.')
        rate = src.getframerate()
        samples = array('h', src.readframes(src.getnframes()))
    duration = len(samples) / rate
    limit = [3.4, 10.3, 14.8][n]
    if offset + duration > limit:
        raise RuntimeError(f'Voice section {n} exceeds its scene; shorten narration before export.')
    windows.append({'start': offset, 'end': round(offset + duration, 3)})
    for i in range(round(duration * SR)):
        pos = i * rate / SR
        left = int(pos)
        if left + 1 >= len(samples):
            break
        value = samples[left] * (1 - (pos - left)) + samples[left + 1] * (pos - left)
        mixed[round(offset * SR) + i] = value / 32768 * fade(i / SR, duration, .008, .015)
save('voiceover', 15, lambda _, i: mixed[i])
(OUT / 'audio-provenance.json').write_text(json.dumps({'sound_design': 'original_procedural_synthesis', 'seed': 24, 'sample_rate': SR, 'voice': 'Windows SAPI Helena - provisional, not ElevenLabs', 'voice_windows': windows, 'external_assets': False, 'note': 'Replace voiceover.mp3 with licensed ElevenLabs narration and update ducking windows if timing changes.'}, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'generated': ['voiceover', 'ambient-drone', 'sub-drop', 'whoosh', 'keystroke', 'success-ping'], 'voice_windows': windows}))
