"""Reproducible 120-second edit retaining the original narration and source."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess

ROOT=Path(__file__).resolve().parents[1]
REPO=ROOT.parent
ARTIFACTS=REPO/'artifacts'
SOURCE=ROOT/'public/reference/santiago-original.mp4'
ADDITIONS=ARTIFACTS/'c4-santiago-additions-49s.mp4'
CLOSING=ARTIFACTS/'c4-santiago-closing-9_6s.mp4'
OUTPUT=ARTIFACTS/'c4-ai-santiago-extended-120s.mp4'
WORK=ARTIFACTS/'santiago-assembly'


def binary(name):
    found=shutil.which(name)
    if found:return found
    for pattern in [f'compositor*/{name}.exe',f'compositor*/{name}']:
        candidate=next((ROOT/'node_modules/@remotion').glob(pattern),None)
        if candidate:return str(candidate)
    raise RuntimeError(f'{name} not found: install Remotion dependencies or provide it on PATH.')


def probe(path):
    return json.loads(subprocess.check_output([binary('ffprobe'),'-v','error','-show_streams','-show_format','-of','json',str(path)]))


def run(args):
    subprocess.run([binary('ffmpeg'),'-hide_banner','-loglevel','error','-y',*args],check=True)


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--render',action='store_true',help='Render additions and closing before assembly')
    parser.add_argument('--browser',help='Existing local Chromium executable, optional')
    parser.add_argument('--prepare-prefix',action='store_true')
    args=parser.parse_args()
    if not SOURCE.exists():raise RuntimeError('Original reference missing; never substitute another video silently.')
    source_probe=probe(SOURCE)
    source_v=next(s for s in source_probe['streams'] if s['codec_type']=='video')
    if source_v['width']!=1920 or source_v['height']!=1080 or abs(float(source_v['duration'])-71)>.05:
        raise RuntimeError('Expected the reviewed 71-second 1080p original. Review edit points for any different source.')
    if args.render:
        cli=ROOT/'node_modules/@remotion/cli/remotion-cli.js'
        for composition,target in [('C4SantiagoAdditions',ADDITIONS),('C4SantiagoClosing',CLOSING)]:
            command=['node',str(cli),'render','src/extension-index.tsx',composition,str(target),
                     '--codec=h264','--crf=18','--concurrency=2','--audio-codec=aac','--audio-bitrate=192k','--gl=angle']
            if args.browser:command.append('--browser-executable='+args.browser)
            subprocess.run(command,cwd=ROOT,check=True)
    WORK.mkdir(parents=True,exist_ok=True)
    source_hash=hashlib.sha256(SOURCE.read_bytes()).hexdigest()
    prefix=WORK/'prefix.mp4'
    record=WORK/'source.json'
    cached=json.loads(record.read_text()) if record.exists() else {}
    if not prefix.exists() or cached.get('sha256')!=source_hash:
        run(['-i',str(SOURCE),'-t','61.4','-frames:v','1842','-map','0:v:0','-map','0:a:0',
             '-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-r','30','-threads','4',
             '-c:a','aac','-b:a','192k','-ar','48000','-ac','2','-video_track_timescale','15360','-movflags','+faststart',str(prefix)])
        record.write_text(json.dumps({'sha256':source_hash,'end_seconds':61.4},indent=2),encoding='utf-8')
    if args.prepare_prefix:
        print('Original prefix prepared; source file unchanged.',flush=True)
        return
    for path,expected in [(ADDITIONS,49),(CLOSING,9.6)]:
        if not path.exists():raise RuntimeError(f'Render {path.name} first or pass --render.')
        item=probe(path)
        v=next(s for s in item['streams'] if s['codec_type']=='video')
        if abs(float(v['duration'])-expected)>.05:raise RuntimeError(f'Unexpected duration: {path.name}')
    # Remotion and FFmpeg can mux different video time bases. The concat demuxer
    # interprets later packets with the first stream's clock: normalize every
    # segment before joining, not just its dimensions and nominal frame rate.
    normalized=[]
    for source,name,seconds,frames in [(prefix,'prefix-normalized.mp4',61.4,1842),
            (ADDITIONS,'additions-normalized.mp4',49,1470),(CLOSING,'closing-normalized.mp4',9.6,288)]:
        target=WORK/name
        run(['-i',str(source),'-t',str(seconds),'-frames:v',str(frames),'-map','0:v:0','-map','0:a:0',
             '-r','30','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-threads','4',
             '-c:a','aac','-b:a','192k','-ar','48000','-ac','2','-video_track_timescale','15360',str(target)])
        normalized.append(probe(target))
    clocks=[next(s['time_base'] for s in p['streams'] if s['codec_type']=='video') for p in normalized]
    if len(set(clocks))!=1:raise RuntimeError('Video clocks differ after normalization; do not concatenate.')
    listing=WORK/'concat.txt'
    listing.write_text("file 'prefix-normalized.mp4'\nfile 'additions-normalized.mp4'\nfile 'closing-normalized.mp4'\n",encoding='utf-8')
    run(['-f','concat','-safe','0','-i',str(listing),'-t','120','-frames:v','3600','-r','30',
         '-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-threads','4',
         '-c:a','aac','-b:a','192k','-ar','48000','-ac','2','-movflags','+faststart',
         '-metadata','title=C4 AI - Agent Reliability Engineer',
         '-metadata','comment=Original video: Santiago. Extension: Deimer/Codex. Original narration retained; new chapters subtitled.',str(OUTPUT)])
    final=probe(OUTPUT)
    video=next(s for s in final['streams'] if s['codec_type']=='video')
    if int(video['nb_frames'])!=3600 or abs(float(video['duration'])-120)>.001:
        raise RuntimeError('Final video did not meet the frame/duration requirement.')
    report={'source_sha256':source_hash,'output_sha256':hashlib.sha256(OUTPUT.read_bytes()).hexdigest(),
            'source_seconds':71,'cut_seconds':61.4,'inserted_seconds':49,'final':final,
            'voice':'Original narration retained. New chapters subtitled; no voice replacement or cloning.',
            'editor_of_original':'Unknown: no encoder tag or editable source in the inspected remote.'}
    (ARTIFACTS/'santiago-extension-probe.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
    print(json.dumps({'output':str(OUTPUT),'frames':video['nb_frames'],'duration':video['duration']}),flush=True)


if __name__=='__main__':main()
