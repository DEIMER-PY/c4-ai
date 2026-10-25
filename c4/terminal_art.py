"""Original procedural neuron rendered as terminal cells, without image protocols."""
from functools import lru_cache
from math import cos, exp, hypot, pi, sin
from random import Random

from rich.text import Text


ASCII_NEURON = r"""
        .---.  .---.           +----------------------+
       /     \/     \          | [C4-AI NEURAL CORE]  |
   .--'   *      *   '--.      | STATUS: ONLINE       |
  /    \            /    \     | GATE: DETERMINISTIC  |
 |  === ( C4 ) ===  |          | AUDIT: SHA-256 HMAC  |
  \    /            \    /     +----------------------+
   '--.   *      *   .--'          \\
       \     /\     /               \\====>> [GATEWAY]
        '---'  '---'                 \\
""".strip('\n')


@lru_cache(maxsize=8)
def _cells(width: int, height: int) -> tuple[tuple[str, str], ...]:
    # Render in a fixed logical coordinate system so resizing preserves anatomy.
    pixels: dict[tuple[int, int], float] = {}
    rng = Random(42)
    sx, sy = (width * 2 - 1) / 104, (height * 4 - 1) / 116

    def point(x: float, y: float, light: float = 1):
        px, py = round(x * sx), round(y * sy)
        if 0 <= px < width * 2 and 0 <= py < height * 4:
            pixels[px, py] = max(light, pixels.get((px, py), 0))

    def stroke(points, light=1, thickness=0):
        for (ax, ay), (bx, by) in zip(points, points[1:]):
            count = max(1, int(hypot((bx-ax)*sx, (by-ay)*sy)*2))
            for n in range(count+1):
                t = n / count
                x, y = ax+(bx-ax)*t, ay+(by-ay)*t
                point(x, y, light)
                if thickness:
                    point(x+0.65, y, light*0.7)
                    point(x, y+0.6, light*0.7)

    def branch(x, y, angle, length, depth):
        bend = rng.uniform(-0.45, 0.45)
        points = [(x, y)]
        for n in range(1, 19):
            t = n/18
            a = angle+bend*t
            points.append((x+cos(a)*length*t, y+sin(a)*length*t))
        stroke(points, 0.88 if depth else 0.55, thickness=depth >= 2)
        if depth:
            ex, ey = points[-1]
            for offset in (-0.5, 0.42):
                branch(ex, ey, angle+bend+offset, length*rng.uniform(0.42, 0.62), depth-1)
            if depth >= 2:
                mx, my = points[11]
                branch(mx, my, angle-0.85, length*0.48, depth-1)
        else:
            # Sparse terminal boutons with electric energy pulses
            ex, ey = points[-1]
            for _ in range(4):
                point(ex+rng.uniform(-2, 2), ey+rng.uniform(-2, 2), 0.35)

    cx, cy = 40, 48
    for n in range(11):
        angle = -pi + n*2*pi/11
        if 0.45 < angle < 1.15:  # Leave room for the outgoing axon.
            continue
        branch(cx+cos(angle)*5, cy+sin(angle)*6, angle, rng.uniform(17, 26), 2)

    # Filamented soma and glowing cybernetic nucleus.
    for y in range(34, 63):
        for x in range(26, 55):
            r = hypot((x-cx)/13, (y-cy)/14)
            if r < 1 and rng.random() < 0.78*(1-r)+0.20:
                point(x, y, max(0.45, 1-r*0.28))
    for phase in range(7):
        curve = []
        for n in range(90):
            a = n*0.1+phase
            r = 2+n*0.1
            curve.append((cx+cos(a)*r, cy+sin(a)*r))
        stroke(curve, 0.72)
    for y in range(44, 53):
        for x in range(36, 45):
            if hypot(x-cx, y-cy) < 4.5:
                point(x, y, 1.0)

    def axon(t):
        return (cx+57*t, cy+62*t+7*sin(t*pi))

    for offset in (-1.1, 0, 1.1):
        stroke([(axon(n/160)[0]+offset, axon(n/160)[1]) for n in range(161)], 1, 1)
    for n in range(9):
        t = 0.28+n*0.078
        x, y = axon(t)
        # Myelin outlines wrap diagonally around the continuous axon.
        ring = [(x+4.4*cos(a)+1.5*sin(a), y-2*cos(a)+3.2*sin(a))
                for a in (k*pi/24 for k in range(49))]
        stroke(ring, 0.95)

    dots = ((0, 0, 1), (0, 1, 2), (0, 2, 4), (1, 0, 8),
            (1, 1, 16), (1, 2, 32), (0, 3, 64), (1, 3, 128))
    result = []
    for row in range(height):
        for col in range(width):
            mask, light = 0, 0.0
            for dx, dy, bit in dots:
                value = pixels.get((col*2+dx, row*4+dy), 0)
                if value:
                    mask |= bit
                    light = max(light, value)
            # High-voltage neon blend: Electric Magenta through Cyber Violet to Quantum Cyan.
            x, y = col*2/sx, row*4/sy
            mix = max(0, min(1, (x-26)/67))
            nucleus = exp(-((x-cx)**2+(y-cy)**2)/22)
            rgb = [int((a+(b-a)*mix)*(0.58+light*0.42))
                   for a, b in zip((255, 45, 175), (20, 235, 255))]
            rgb = [int(c+(warm-c)*nucleus) for c, warm in zip(rgb, (255, 238, 170))]
            color = '#'+''.join(f'{min(255, max(0, c)):02x}' for c in rgb)
            result.append((chr(0x2800+mask) if mask else ' ', color))
        result.append(('\n', ''))
    return tuple(result)


def neuron(width: int = 52, height: int = 29, unicode: bool = True) -> Text:
    """Return fixed-width colored art; cached geometry, fresh mutable Rich text."""
    if not unicode or width < 30:
        return Text(ASCII_NEURON, style='bold magenta')
    art = Text(no_wrap=True, overflow='crop')
    for char, color in _cells(width, height):
        art.append(char, style=color or None)
    return art
