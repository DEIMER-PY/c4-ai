"""Compose unaltered dashboard screenshots inside device frames (stdlib only)."""
import base64
from pathlib import Path

root = Path(__file__).resolve().parents[1]
parts = ['<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="820" viewBox="0 0 1200 820">',
         '<rect width="1200" height="820" fill="#14111e"/>',
         '<text x="45" y="65" fill="#f4edff" font-size="32" font-family="sans-serif">C4 AI · vistas web responsive</text>',
         '<text x="45" y="100" fill="#a99abf" font-size="17" font-family="sans-serif">Capturas de la aplicación implementada · no app nativa</text>']
for name, x, y, width, height in [('desktop', 40, 155, 730, 507),
                                 ('tablet', 790, 155, 200, 288),
                                 ('phone', 1005, 155, 150, 325)]:
    raw = (root / f'docs/assets/dashboard-{name}.png').read_bytes()
    mime = 'image/jpeg' if raw.startswith(b'\xff\xd8\xff') else 'image/png'
    data = base64.b64encode(raw).decode()
    parts += [f'<rect x="{x-5}" y="{y-5}" width="{width+10}" height="{height+10}" rx="12" fill="#483558"/>',
              f'<image x="{x}" y="{y}" width="{width}" height="{height}" href="data:{mime};base64,{data}"/>',
              f'<text x="{x}" y="{y+height+35}" fill="#75d8e6" font-size="17" font-family="sans-serif">{name}</text>']
parts += ['<text x="45" y="765" fill="#beaed0" font-size="17" font-family="sans-serif">Misma API y evidencia · modelo, tokens y costos con cobertura explícita</text>', '</svg>']
(root / 'docs/assets/app-responsive-preview.svg').write_text('\n'.join(parts), encoding='utf-8')
