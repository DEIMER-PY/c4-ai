// Fondo de la vitrina: curvas de traza generadas de forma determinista (sin imágenes externas).
// Evoca las ejecuciones que C4 inspecciona; es decorativo y queda oculto para lectores de pantalla.

const WIDTH = 1200;
const HEIGHT = 720;
const LINES = 34;

function tracePath(index: number): string {
  const offset = (index / LINES) * HEIGHT * 1.2 - HEIGHT * 0.1;
  const amp = 26 + (index % 7) * 9;
  const phase = index * 0.37;
  const points: string[] = [];
  for (let x = 0; x <= WIDTH; x += 40) {
    const t = x / WIDTH;
    const y =
      offset +
      Math.sin(t * Math.PI * 2.2 + phase) * amp +
      Math.sin(t * Math.PI * 5.1 + phase * 1.7) * (amp * 0.28) -
      t * 120;
    points.push(`${x === 0 ? "M" : "L"}${x} ${y.toFixed(1)}`);
  }
  return points.join(" ");
}

const PATHS = Array.from({ length: LINES }, (_, i) => tracePath(i));

export function TraceBackdrop() {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full"
    >
      <defs>
        <linearGradient id="trace-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f7ebf4" />
          <stop offset="0.55" stopColor="#f3f1fb" />
          <stop offset="1" stopColor="#e3f5f7" />
        </linearGradient>
        <linearGradient id="trace-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c2246e" />
          <stop offset="0.5" stopColor="#6b46f5" />
          <stop offset="1" stopColor="#1ba6b8" />
        </linearGradient>
      </defs>
      <rect width={WIDTH} height={HEIGHT} fill="url(#trace-bg)" />
      <g fill="none" stroke="url(#trace-line)" strokeWidth="1.1">
        {PATHS.map((d, i) => (
          <path key={i} d={d} strokeOpacity={0.1 + (i % 5) * 0.045} />
        ))}
      </g>
    </svg>
  );
}
