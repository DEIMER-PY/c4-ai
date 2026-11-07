import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import manifest from "./audio-manifest.json";

// S2 video: real live run (screen recording of `c4 demo` against Grok, session
// c4_75aac87433974f239db1bb6edd5035c2) plus the real `c4 report` capture of a
// session that recovered from HTTP 503. No simulated metrics.
export const FPS = 30;
const s = (seconds: number) => Math.round(seconds * FPS);

// Live recording remap (source frames at 30 fps): inspection in real time,
// the wait for Grok's diagnosis at 6x, the 12 evaluation calls at 2x and the
// final report in real time. The on-screen label always states the speed.
const LIVE = [
  { from: 0, to: 360, rate: 1 },
  { from: 360, to: 1920, rate: 6 },
  { from: 1920, to: 2940, rate: 2 },
  { from: 2940, to: 3258, rate: 1 },
];
const liveLength = LIVE.reduce((sum, seg) => sum + Math.round((seg.to - seg.from) / seg.rate), 0);

const A = { start: 0, length: s(14) };
const B = { start: A.start + A.length, length: liveLength };
const C = { start: B.start + B.length, length: s(29.5) };
const D = { start: C.start + C.length, length: s(22) };
export const TOTAL = D.start + D.length;

const audio = Object.fromEntries(manifest.map((m) => [m.id, m.file]));

const colors = { bg: "#11130f", fg: "#e8e6df", dim: "#9a978c", accent: "#7fd18b", warn: "#f0c25e" };
const mono = "Consolas, 'Cascadia Mono', monospace";
const sans = "'Segoe UI', Arial, sans-serif";

const Fade: React.FC<{ length: number; children: React.ReactNode }> = ({ length, children }) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [0, 12, length - 12, length], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

const Label: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = colors.dim }) => (
  <div style={{ fontFamily: mono, fontSize: 26, color, letterSpacing: 1 }}>{children}</div>
);

const Problem: React.FC = () => (
  <Fade length={A.length}>
    <AbsoluteFill style={{ background: colors.bg, padding: 140, justifyContent: "center", gap: 36 }}>
      <Label>C4 AI · S2 · herramientas reales</Label>
      <div style={{ fontFamily: sans, fontSize: 76, color: colors.fg, lineHeight: 1.15, maxWidth: 1500 }}>
        Un agente de reembolsos aprueba devoluciones que su política prohíbe.
      </div>
      <div style={{ fontFamily: sans, fontSize: 40, color: colors.dim, maxWidth: 1500 }}>
        C4 detecta el fallo, propone una corrección y la acepta solo si la evaluación lo demuestra.
      </div>
    </AbsoluteFill>
  </Fade>
);

const Live: React.FC = () => {
  const f = useCurrentFrame();
  let offset = 0;
  let acc = 0;
  let rate = 1;
  for (const seg of LIVE) {
    const length = Math.round((seg.to - seg.from) / seg.rate);
    if (f >= acc && f < acc + length) rate = seg.rate;
    acc += length;
  }
  const speed =
    rate === 6 ? "Esperando el diagnóstico de Grok · acelerado x6" : rate === 2 ? "Evaluación · acelerado x2" : "Velocidad real";
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {LIVE.map((seg) => {
        const length = Math.round((seg.to - seg.from) / seg.rate);
        const node = (
          <Sequence key={seg.from} from={offset} durationInFrames={length}>
            <OffthreadVideo
              src={staticFile("s2/live.mp4")}
              startFrom={seg.from}
              endAt={seg.to}
              playbackRate={seg.rate}
              muted
              style={{ position: "absolute", top: 60, left: 0, width: 1920, height: 960 }}
            />
          </Sequence>
        );
        offset += length;
        return node;
      })}
      <div style={{ position: "absolute", top: 14, left: 28, right: 28, display: "flex", justifyContent: "space-between" }}>
        <Label color={colors.accent}>● Grabación real · c4 demo contra Grok (grok-4.7)</Label>
        <Label color={rate > 1 ? colors.warn : colors.dim}>{speed}</Label>
      </div>
    </AbsoluteFill>
  );
};

const ErrorRecovery: React.FC = () => {
  const f = useCurrentFrame();
  const y = interpolate(f, [s(2), s(17)], [0, -440], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Fade length={C.length}>
      <AbsoluteFill style={{ background: "#272822", overflow: "hidden" }}>
        <Img src={staticFile("s2/retry.svg")} style={{ position: "absolute", left: 97, top: 90 + y, width: 1726 }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "18px 28px", background: colors.bg }}>
          <Label color={colors.warn}>
            Error y recuperación · c4 report c4_4015ff60… · refunds_v2, 32 casos · HTTP 503 → reintento → aceptada
          </Label>
        </div>
      </AbsoluteFill>
    </Fade>
  );
};

const rows: [string, string][] = [
  ["Ejecuciones reales registradas", "31 (11 aceptadas · 9 rechazadas por el gate · 7 fallidas · 4 incompletas)"],
  ["Verificación", "SHA-256 de cada sesión · scripts/export_run_evidence.py --check"],
  ["Costo por tarea, 6 casos", "≈ USD 0,05 (14 llamadas)"],
  ["Costo por tarea, 32 casos", "USD 0,20–0,22 (66 llamadas)"],
  ["Repositorio", "github.com/DEIMER-PY/c4-ai · licencia MIT"],
];

const Result: React.FC = () => (
  <Fade length={D.length}>
    <AbsoluteFill style={{ background: colors.bg, padding: "120px 140px", gap: 44 }}>
      <Label>Resultado · evidencia en docs/evidencia/2026-11-07-ejecuciones-reales.json</Label>
      <div style={{ display: "grid", gridTemplateColumns: "520px 1fr", rowGap: 30, columnGap: 40 }}>
        {rows.map(([k, v]) => (
          <React.Fragment key={k}>
            <div style={{ fontFamily: sans, fontSize: 34, color: colors.dim }}>{k}</div>
            <div style={{ fontFamily: mono, fontSize: 30, color: colors.fg }}>{v}</div>
          </React.Fragment>
        ))}
      </div>
      <div style={{ fontFamily: sans, fontSize: 30, color: colors.dim, marginTop: 20 }}>
        Casos sintéticos · llamadas reales a Grok · solo se modifican versiones de prueba del agente.
      </div>
    </AbsoluteFill>
  </Fade>
);

export const S2Video: React.FC = () => (
  <AbsoluteFill style={{ background: colors.bg }}>
    <Sequence from={A.start} durationInFrames={A.length}><Problem /></Sequence>
    <Sequence from={B.start} durationInFrames={B.length}><Live /></Sequence>
    <Sequence from={C.start} durationInFrames={C.length}><ErrorRecovery /></Sequence>
    <Sequence from={D.start} durationInFrames={D.length}><Result /></Sequence>
    <Sequence from={A.start + 15}><Audio src={staticFile(audio.problema)} /></Sequence>
    <Sequence from={B.start + 60}><Audio src={staticFile(audio.vivo)} /></Sequence>
    <Sequence from={C.start + 15}><Audio src={staticFile(audio.error)} /></Sequence>
    <Sequence from={D.start + 15}><Audio src={staticFile(audio.resultado)} /></Sequence>
  </AbsoluteFill>
);
