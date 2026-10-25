import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const C = {
  bg: "#09090b",
  surface: "#18181b",
  border: "#27272a",
  muted: "#a1a1aa",
  cyan: "#06b6d4",
  violet: "#8b5cf6",
  green: "#10b981",
};
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const mono = "'Cascadia Code','Consolas',monospace";
export const LAUNCH_EVIDENCE = {
  before: 5,
  after: 6,
  total: 6,
  regressions: 0,
  calls: 14,
  tokens: 20720,
};

export const Brand = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect
      x="1"
      y="1"
      width="46"
      height="46"
      rx="13"
      stroke="currentColor"
      strokeOpacity=".25"
    />
    <path
      d="M26 13a12 12 0 1 0 0 22M32 17l7 7-7 7"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="21" cy="24" r="3" fill={C.cyan} />
  </svg>
);
const Icon = ({
  kind,
  size = 30,
}: {
  kind: "trace" | "brain" | "check" | "arrow" | "code";
  size?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {kind === "trace" ? (
      <>
        <path d="M8 5h16v22H8zM12 11h8M12 16h8M12 21h4" />
        <path d="M5 9v14" />
      </>
    ) : kind === "brain" ? (
      <>
        <path d="M15 7c-4-5-10 0-7 4-6 2-4 9 0 9-2 7 5 10 8 5 4 5 10 1 8-4 6-1 6-8 1-10 2-6-5-9-9-4v18" />
        <path d="M8 12l4 3M8 21l4-2M20 11l-4 4M25 19l-5-2" />
      </>
    ) : kind === "check" ? (
      <path d="m7 17 6 6L26 9" />
    ) : kind === "arrow" ? (
      <path d="M6 16h20m-7-7 7 7-7 7" />
    ) : (
      <>
        <path d="m11 9-7 7 7 7m10-14 7 7-7 7M18 6l-4 20" />
      </>
    )}
  </svg>
);

export const CameraRig = ({
  children,
  phase = 0,
  style,
}: {
  children: ReactNode;
  phase?: number;
  style?: CSSProperties;
}) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div
      style={{ position: "absolute", inset: 0, perspective: 1200, ...style }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: `rotateX(${1.2 + Math.sin((f + phase) / 140) * 0.65}deg) rotateY(${-1.3 + Math.cos((f + phase) / 180) * 0.8}deg) scale(${interpolate(f + phase, [0, durationInFrames], [1, 1.04], clamp)})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Backdrop = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      className="bg-zinc-950"
      style={{ background: C.bg, overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 650,
          left: 700,
          top: -200,
          background: `radial-gradient(ellipse,${C.violet}45,transparent 66%)`,
          transform: `translate3d(${Math.sin(f / 170) * 100}px,0,0)`,
          willChange: "transform,opacity",
          opacity: 0.6 + Math.sin(f / 95) * 0.12,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 750,
          left: -220,
          top: 420,
          background: `radial-gradient(ellipse,${C.cyan}32,transparent 65%)`,
          transform: `translate3d(0,${Math.sin(f / 150) * 70}px,0)`,
          willChange: "transform,opacity",
          opacity: 0.55 + Math.cos(f / 130) * 0.12,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(#ffffff05 1px,transparent 1px),linear-gradient(90deg,#ffffff05 1px,transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center,black,transparent 85%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%,transparent 25%,#09090b99 95%)",
        }}
      />
    </AbsoluteFill>
  );
};
const Beacon = ({
  label,
  ready = false,
}: {
  label: string;
  ready?: boolean;
}) => {
  const f = useCurrentFrame();
  const color = ready ? C.green : C.cyan;
  return (
    <div
      className="flex items-center gap-3 rounded-full border px-5 py-3"
      style={{
        borderColor: color + "35",
        background: color + "0c",
        fontFamily: mono,
        fontSize: 17,
        color,
      }}
    >
      <span
        style={{
          position: "relative",
          width: 8,
          height: 8,
          borderRadius: 99,
          background: color,
          boxShadow: `0 0 20px ${color}`,
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: -6,
            border: "1px solid " + color,
            borderRadius: 99,
            scale: 1 + (f % 70) / 70,
            opacity: 0.5 * (1 - (f % 70) / 70),
          }}
        />
      </span>
      {label}
    </div>
  );
};
const FrameLabel = ({ number, text }: { number: string; text: string }) => (
  <div
    className="flex items-center gap-4"
    style={{ fontFamily: mono, fontSize: 16, letterSpacing: 2, color: C.muted }}
  >
    <span style={{ color: C.cyan }}>{number}</span>
    <span className="h-px w-8 bg-zinc-700" />
    {text}
  </div>
);

const SimulatedCursor = ({
  start,
  end,
  at,
  clickAt,
}: {
  start: [number, number];
  end: [number, number];
  at: number;
  clickAt: number;
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.min(
    1,
    Math.max(
      0,
      spring({ frame: f - at, fps, config: { damping: 26, stiffness: 100 } }),
    ),
  );
  const u = 1 - t;
  const x =
    u * u * u * start[0] +
    3 * u * u * t * (start[0] - 120) +
    3 * u * t * t * (end[0] + 80) +
    t * t * t * end[0];
  const y =
    u * u * u * start[1] +
    3 * u * u * t * (start[1] - 180) +
    3 * u * t * t * (end[1] + 100) +
    t * t * t * end[1];
  const click = interpolate(
    f,
    [clickAt, clickAt + 4, clickAt + 12],
    [1, 0.87, 1],
    clamp,
  );
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        scale: click,
        opacity: interpolate(
          f,
          [at - 8, at, clickAt + 18, clickAt + 32],
          [0, 1, 1, 0],
          clamp,
        ),
        filter: "drop-shadow(0 4px 8px #000a)",
        zIndex: 20,
      }}
    >
      <svg width="33" height="40" viewBox="0 0 33 40">
        <path
          d="M3 2v29l8-8 6 13 6-3-6-12h12z"
          fill="#fafafa"
          stroke="#09090b"
          strokeWidth="2"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: -20,
          top: -20,
          width: 44,
          height: 44,
          borderRadius: 99,
          border: "1px solid #fff",
          scale: interpolate(f, [clickAt, clickAt + 22], [0.4, 2.5], clamp),
          opacity: interpolate(
            f,
            [clickAt, clickAt + 2, clickAt + 22],
            [0, 0.5, 0],
            clamp,
          ),
        }}
      />
    </div>
  );
};

export const TerminalWindow = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entered = f >= 154;
  const command = "uv run --locked c4 demo";
  const count = Math.floor(
    interpolate(f, [32, 143], [0, command.length], clamp),
  );
  const press = interpolate(f, [151, 155, 164], [1, 0.96, 1], clamp);
  return (
    <div
      className="overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xs"
      style={{
        position: "absolute",
        left: 210,
        top: 330,
        width: 1500,
        height: 505,
        boxShadow: "0 40px 110px #000b,0 0 90px #06b6d40a",
        transform: `translateY(${(1 - spring({ frame: f - 12, fps, config: { damping: 24, stiffness: 90 } })) * 90}px)`,
        opacity: interpolate(f, [5, 32], [0, 1], clamp),
      }}
    >
      <div className="flex h-20 items-center justify-between border-b border-zinc-800 px-8">
        <div className="flex gap-3">
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span
              key={c}
              style={{
                width: 13,
                height: 13,
                borderRadius: 99,
                background: c,
                opacity: 0.75,
              }}
            />
          ))}
        </div>
        <span style={{ font: "18px " + mono, color: C.muted }}>
          c4-ai / testbed
        </span>
        <Beacon label={entered ? "THINKING" : "READY"} />
      </div>
      <div style={{ padding: "48px 55px", fontFamily: mono }}>
        <div style={{ fontSize: 40, letterSpacing: -0.8 }}>
          <span style={{ color: C.green, marginRight: 22 }}>❯</span>
          <span style={{ color: "#fafafa" }}>
            {command.slice(0, Math.min(count, 6))}
          </span>
          <span style={{ color: "#a78bfa" }}>
            {command.slice(6, Math.min(count, 15))}
          </span>
          <span style={{ color: "#67e8f9" }}>{command.slice(15, count)}</span>
          <span
            style={{
              opacity: f % 50 < 28 ? 1 : 0,
              display: "inline-block",
              width: 19,
              height: 39,
              background: "#e4e4e7",
              verticalAlign: "middle",
              marginLeft: 7,
            }}
          />
        </div>
        <div
          style={{
            marginTop: 37,
            opacity: interpolate(f, [155, 177], [0, 1], clamp),
            fontSize: 23,
            color: C.muted,
          }}
        >
          <span style={{ color: C.cyan }}>↳</span> refund_expired{" "}
          <span style={{ opacity: 0.4, margin: "0 18px" }}>/</span> baseline:
          5/6{" "}
          <span style={{ color: "#fbbf24", marginLeft: 25 }}>
            incident detected
          </span>
        </div>
        <div
          className="flex items-center justify-between"
          style={{ marginTop: 43 }}
        >
          <span style={{ fontSize: 18, color: "#71717a" }}>
            Grok · soporte/reembolsos · versión de prueba
          </span>
          <div
            className="flex items-center gap-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-6 py-4 text-cyan-200"
            style={{ fontSize: 19, scale: press }}
          >
            Analizar evidencia <Icon kind="arrow" size={23} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const MetricsPill = ({
  label,
  value,
  suffix = "",
  accent = C.cyan,
}: {
  label: string;
  value: number | string;
  suffix?: string;
  accent?: string;
}) => (
  <div
    className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-7 py-5"
    style={{ minWidth: 230 }}
  >
    <div style={{ font: "14px " + mono, color: C.muted, letterSpacing: 0.5 }}>
      {label}
    </div>
    <div
      style={{
        fontSize: 42,
        fontWeight: 550,
        color: accent,
        letterSpacing: -1.5,
        marginTop: 8,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
      <span style={{ fontSize: 24, color: C.muted, letterSpacing: 0 }}>
        {suffix}
      </span>
    </div>
  </div>
);

const Node = ({
  x,
  index,
  title,
  tool,
  kind,
  ready,
}: {
  x: number;
  index: number;
  title: string;
  tool: string;
  kind: "trace" | "brain" | "check";
  ready: boolean;
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: f - index * 24 - 22,
    fps,
    config: { damping: 22, stiffness: 115 },
  });
  const lit = f > index * 70 + 75;
  const color = ready ? C.green : lit ? C.cyan : "#52525b";
  return (
    <div
      className="rounded-3xl border bg-zinc-950/90 p-7"
      style={{
        position: "absolute",
        left: x,
        top: 135,
        width: 300,
        height: 235,
        borderColor: color + "70",
        boxShadow: `0 0 60px ${color}0d,0 26px 45px #0007`,
        opacity: p,
        transform: `translateY(${(1 - p) * 45}px) scale(${0.96 + p * 0.04})`,
      }}
    >
      <div className="flex items-center justify-between">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ background: color + "16", color }}
        >
          <Icon kind={kind} />
        </div>
        <span style={{ font: "13px " + mono, color }}>
          {ready ? "VERIFIED" : lit ? "PROCESSING" : "QUEUED"}
        </span>
      </div>
      <h3
        style={{
          fontSize: 29,
          fontWeight: 550,
          margin: "23px 0 10px",
          letterSpacing: -0.5,
        }}
      >
        {title}
      </h3>
      <code style={{ fontSize: 17, color: C.muted }}>{tool}</code>
    </div>
  );
};

export const WorkflowGraph = () => {
  const f = useCurrentFrame();
  const ready = f >= 350;
  const color = ready ? C.green : C.cyan;
  return (
    <div style={{ position: "relative", width: 1220, height: 500 }}>
      <svg width="1220" height="500" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="particle-glow">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
        {[350, 760].map((x, i) => (
          <g key={x}>
            <path d={`M${x} 250H${x + 110}`} stroke="#27272a" strokeWidth="2" />
            <path
              d={`M${x} 250H${x + 110}`}
              stroke={color}
              strokeWidth="2"
              strokeDasharray="7 14"
              strokeDashoffset={-f * 2.2}
              opacity={interpolate(
                f,
                [60 + i * 80, 90 + i * 80],
                [0, 1],
                clamp,
              )}
            />
            <circle
              cx={x + ((f * 2 + i * 35) % 110)}
              cy="250"
              r="6"
              fill={color}
              filter="url(#particle-glow)"
            />
            <circle
              cx={x + ((f * 2 + i * 35) % 110)}
              cy="250"
              r="2.5"
              fill="#e0faff"
            />
          </g>
        ))}
      </svg>
      <Node
        x={50}
        index={0}
        title="Inspección"
        tool="trace_reader"
        kind="trace"
        ready={ready}
      />
      <Node
        x={460}
        index={1}
        title="Diagnóstico"
        tool="Grok → patch_writer"
        kind="brain"
        ready={ready}
      />
      <Node
        x={870}
        index={2}
        title="Evaluación"
        tool="eval_runner → gate"
        kind="check"
        ready={ready}
      />
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 420,
          font: "17px " + mono,
          color: C.muted,
        }}
      >
        <span style={{ color: ready ? C.green : C.violet }}>●</span>{" "}
        {ready
          ? "Evaluación completa · sin regresiones"
          : "Baseline inmutable · candidato versionado · mismo dataset"}
      </div>
    </div>
  );
};

const StreamingLogs = () => {
  const f = useCurrentFrame();
  const entries = [
    ["trace_reader", "refund_expired → fallo"],
    ["diagnoser", "causa identificada"],
    ["patch_writer", "prompt candidato guardado"],
    ["eval_runner", "mismo dataset · 6 casos"],
    ["security", "controles obligatorios OK"],
    ["gate", "accepted · 0 regresiones"],
  ];
  return (
    <div
      className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80"
      style={{ width: 400, height: 550, boxShadow: "0 24px 70px #0006" }}
    >
      <div
        className="flex items-center gap-3 border-b border-zinc-800 px-7 py-6"
        style={{ font: "16px " + mono, color: C.muted }}
      >
        <Icon kind="code" size={22} />
        Execution trace
        <span style={{ marginLeft: "auto", color: C.green, fontSize: 12 }}>
          REPLAY
        </span>
      </div>
      <div style={{ padding: "10px 27px" }}>
        {entries.map(([name, body], i) => {
          const start = 35 + i * 52;
          const n = Math.floor(
            interpolate(f, [start, start + 29], [0, body.length], clamp),
          );
          return (
            <div
              key={name}
              style={{
                padding: "15px 0",
                borderBottom: "1px solid #ffffff06",
                opacity: interpolate(f, [start - 6, start + 7], [0, 1], clamp),
              }}
            >
              <div
                style={{
                  font: "13px " + mono,
                  color: i === 5 ? C.green : C.violet,
                  marginBottom: 8,
                }}
              >
                {String(i + 1).padStart(2, "0")} / {name}
              </div>
              <div style={{ font: "17px " + mono, color: "#d4d4d8" }}>
                {body.slice(0, n)}
                <span
                  style={{ color: C.cyan, opacity: n < body.length ? 0.8 : 0 }}
                >
                  ▎
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TriggerScene = () => {
  const f = useCurrentFrame();
  const out = interpolate(f, [192, 210], [1, 0], { ...clamp, easing: ease });
  const shake =
    f >= 154 && f < 165
      ? Math.sin((f - 154) * 2) * 2.2 * Math.exp(-(f - 154) / 5)
      : 0;
  return (
    <AbsoluteFill
      style={{
        opacity: out,
        transform: `translateX(${shake}px) scale(${interpolate(f, [190, 210], [1, 1.035], clamp)})`,
      }}
    >
      <div style={{ position: "absolute", left: 220, top: 150 }}>
        <FrameLabel number="01" text="THE TRIGGER" />
        <h1
          style={{
            fontSize: 86,
            fontWeight: 550,
            letterSpacing: -4,
            marginTop: 25,
            lineHeight: 1.05,
          }}
        >
          Tu agente puede fallar.
        </h1>
      </div>
      <CameraRig>
        <TerminalWindow />
      </CameraRig>
      <SimulatedCursor
        start={[1710, 970]}
        end={[1515, 655]}
        at={90}
        clickAt={154}
      />
    </AbsoluteFill>
  );
};
const ReasoningScene = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f, fps, config: { damping: 26, stiffness: 90 } });
  const count = Math.round(
    interpolate(f, [80, 340], [0, LAUNCH_EVIDENCE.tokens], clamp),
  );
  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(f, [0, 20, 396, 420], [0, 1, 1, 0], clamp),
        transform: `translateX(${(1 - p) * 120}px) scale(${interpolate(f, [390, 420], [1, 1.035], clamp)})`,
      }}
    >
      <div style={{ position: "absolute", left: 125, top: 150 }}>
        <FrameLabel number="02" text="THE RELIABILITY LOOP" />
        <h1
          style={{
            fontSize: 79,
            fontWeight: 550,
            letterSpacing: -3.8,
            lineHeight: 1.06,
            marginTop: 25,
          }}
        >
          Una corrección.
          <br />
          <span style={{ color: C.muted }}>Toda la evidencia.</span>
        </h1>
      </div>
      <CameraRig phase={210}>
        <div style={{ position: "absolute", left: 75, top: 365 }}>
          <WorkflowGraph />
        </div>
        <div style={{ position: "absolute", left: 1390, top: 280 }}>
          <StreamingLogs />
        </div>
        <div
          className="flex gap-5"
          style={{ position: "absolute", left: 135, top: 830 }}
        >
          <MetricsPill
            label="TOKENS REPORTADOS"
            value={count.toLocaleString("en-US")}
          />
          <MetricsPill
            label="CASOS DEL DATASET"
            value={6}
            suffix=" sintéticos"
            accent="#c4b5fd"
          />
          <MetricsPill label="LLAMADAS GUARDADAS" value={14} accent="#e4e4e7" />
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};

const SuccessMark = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: f - 8,
    fps,
    config: { damping: 20, stiffness: 105 },
  });
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      style={{ overflow: "visible", scale: 0.8 + p * 0.2 }}
    >
      <circle cx="50" cy="50" r="44" fill="#10b98110" stroke="#10b98155" />
      <circle cx="50" cy="50" r="35" fill="#10b9810a" />
      <path
        d="m30 51 13 13 28-30"
        stroke={C.green}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset={1 - Math.min(1, p)}
      />
    </svg>
  );
};
const ResolutionScene = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f, fps, config: { damping: 25, stiffness: 100 } });
  const click = interpolate(f, [191, 196, 205], [1, 0.96, 1], clamp);
  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(f, [0, 20], [0, 1], clamp),
        transform: `scale(${0.92 + p * 0.08})`,
      }}
    >
      <CameraRig phase={630}>
        <div
          style={{
            position: "absolute",
            left: 170,
            top: 195,
            width: 1580,
            height: 675,
            borderRadius: 34,
            padding: 1,
            background: `conic-gradient(from ${f * 0.35 + 210}deg,#27272a 0deg,#27272a 105deg,#06b6d4aa 145deg,#8b5cf6aa 175deg,#27272a 220deg)`,
            boxShadow: "0 30px 130px #000a,0 0 100px #8b5cf611",
          }}
        >
          <div
            className="h-full rounded-[33px] bg-zinc-950/95"
            style={{ padding: "66px 70px" }}
          >
            <div className="flex items-center gap-5">
              <Beacon label="CANDIDATE ACCEPTED" ready />
              <span style={{ font: "15px " + mono, color: C.muted }}>
                Evidencia registrada
              </span>
            </div>
            <h1
              style={{
                fontSize: 89,
                fontWeight: 550,
                letterSpacing: -4.5,
                lineHeight: 1.04,
                margin: "33px 0 26px",
              }}
            >
              Menos suposiciones.
              <br />
              <span style={{ color: "#a1a1aa" }}>Más evidencia.</span>
            </h1>
            <p style={{ fontSize: 23, color: C.muted }}>
              Baseline 5/6 → candidato 6/6 · cero regresiones.
            </p>
            <div
              className="flex items-center gap-5 rounded-xl border border-zinc-700/80 bg-zinc-900/80 px-7 py-5"
              style={{
                width: 750,
                marginTop: 35,
                font: "23px " + mono,
                scale: click,
              }}
            >
              <span style={{ color: C.cyan }}>❯</span>uv run --locked c4 tui
              <span style={{ marginLeft: "auto", color: C.muted }}>
                <Icon kind="arrow" size={25} />
              </span>
            </div>
            <p
              style={{ font: "13px " + mono, color: "#71717a", marginTop: 17 }}
            >
              Desde el clon del repositorio · Python 3.12 + uv
            </p>
            <div
              style={{
                position: "absolute",
                right: 65,
                top: 115,
                width: 365,
                textAlign: "center",
                padding: 25,
              }}
            >
              <div className="flex justify-center">
                <SuccessMark />
              </div>
              <div
                style={{
                  fontSize: 143,
                  letterSpacing: -10,
                  lineHeight: 1.1,
                  fontWeight: 550,
                  marginTop: 24,
                }}
              >
                6
                <span
                  style={{ fontSize: 76, color: "#52525b", letterSpacing: -5 }}
                >
                  /6
                </span>
              </div>
              <div
                style={{ font: "16px " + mono, color: C.green, marginTop: 18 }}
              >
                CONTROLES APROBADOS
              </div>
              <div
                style={{
                  marginTop: 29,
                  height: 3,
                  borderRadius: 99,
                  background: "#27272a",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: `linear-gradient(90deg,${C.cyan},${C.green})`,
                    width: `${interpolate(f, [20, 80], [0, 100], clamp)}%`,
                    boxShadow: "0 0 20px #10b98155",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </CameraRig>
      <SimulatedCursor
        start={[1530, 970]}
        end={[950, 665]}
        at={140}
        clickAt={196}
      />
    </AbsoluteFill>
  );
};

export type LaunchProps = {
  voiceover: string;
  ambient: string;
  keystroke: string;
  whoosh: string;
  success: string;
  subdrop: string;
  voiceoverEnabled: boolean;
  voiceWindows: Array<[number, number]>;
};
export const launchDefaults: LaunchProps = {
  voiceover: "launch/voiceover.mp3",
  ambient: "launch/ambient-drone.mp3",
  keystroke: "launch/keystroke.mp3",
  whoosh: "launch/whoosh.mp3",
  success: "launch/success-ping.mp3",
  subdrop: "launch/sub-drop.mp3",
  voiceoverEnabled: true,
  voiceWindows: [
    [0.35, 2.474],
    [3.85, 7.178],
    [10.85, 14.543],
  ],
};

export const AudioLayer = ({
  voiceover,
  ambient,
  keystroke,
  whoosh,
  success,
  subdrop,
  voiceoverEnabled,
  voiceWindows,
}: LaunchProps) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {voiceoverEnabled ? (
        <Audio src={staticFile(voiceover)} volume={1} />
      ) : null}
      <Audio
        src={staticFile(ambient)}
        loop
        volume={(f) => {
          const s = f / fps;
          const duck =
            voiceoverEnabled && voiceWindows.length
              ? Math.max(
                  ...voiceWindows.map(([a, b]) =>
                    interpolate(
                      s,
                      [a - 0.12, a, b, b + 0.12],
                      [0, 1, 1, 0],
                      clamp,
                    ),
                  ),
                )
              : 0;
          return (
            (0.18 - duck * 0.08) *
            interpolate(f, [0, 24, 14.5 * fps, 15 * fps], [0, 1, 1, 0], clamp)
          );
        }}
      />
      <Sequence name="Initial sub drop" durationInFrames={fps}>
        <Audio src={staticFile(subdrop)} volume={0.35} />
      </Sequence>
      <Sequence name="Typing" from={32} durationInFrames={112}>
        <Audio
          src={staticFile(keystroke)}
          loop
          volume={(f) =>
            interpolate(f, [0, 5, 103, 112], [0, 0.25, 0.25, 0], clamp)
          }
        />
      </Sequence>
      <Sequence
        name="Trigger click"
        from={154}
        durationInFrames={Math.round(0.5 * fps)}
      >
        <Audio
          src={staticFile(success)}
          volume={0.12}
          trimAfter={Math.round(0.15 * fps)}
        />
      </Sequence>
      <Sequence
        name="Workflow whoosh"
        from={198}
        durationInFrames={Math.round(0.8 * fps)}
      >
        <Audio src={staticFile(whoosh)} volume={0.3} />
      </Sequence>
      <Sequence
        name="Resolution whoosh"
        from={618}
        durationInFrames={Math.round(0.8 * fps)}
      >
        <Audio src={staticFile(whoosh)} volume={0.22} />
      </Sequence>
      <Sequence
        name="Verified chime"
        from={642}
        durationInFrames={Math.round(1.4 * fps)}
      >
        <Audio src={staticFile(success)} volume={0.3} />
      </Sequence>
      <Sequence
        name="CTA click"
        from={826}
        durationInFrames={Math.round(0.25 * fps)}
      >
        <Audio
          src={staticFile(keystroke)}
          volume={0.18}
          trimAfter={Math.round(0.08 * fps)}
        />
      </Sequence>
    </>
  );
};

const TransitionSweep = ({ at }: { at: number }) => {
  const f = useCurrentFrame() - at;
  if (f < -18 || f > 22) return null;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        mixBlendMode: "screen",
        opacity: interpolate(f, [-18, -5, 6, 22], [0, 0.32, 0.32, 0], clamp),
      }}
    >
      <div
        style={{
          position: "absolute",
          left: interpolate(f, [-18, 22], [-600, 2300], {
            ...clamp,
            easing: Easing.bezier(0.6, 0, 0.2, 1),
          }),
          top: -200,
          width: 270,
          height: 1600,
          transform: "rotate(-17deg)",
          background:
            "linear-gradient(90deg,transparent,#06b6d440,#d8faff70,#8b5cf640,transparent)",
          filter: "blur(26px)",
        }}
      />
    </AbsoluteFill>
  );
};

export const C4Launch = (props: LaunchProps) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        background: C.bg,
        color: "#fafafa",
        fontFamily: "'Segoe UI',Arial,sans-serif",
        overflow: "hidden",
      }}
    >
      <Backdrop />
      <Sequence name="01 — Trigger" durationInFrames={3.5 * fps}>
        <TriggerScene />
      </Sequence>
      <Sequence
        name="02 — Reasoning and tools"
        from={3.5 * fps}
        durationInFrames={7 * fps}
      >
        <ReasoningScene />
      </Sequence>
      <Sequence
        name="03 — Resolution"
        from={10.5 * fps}
        durationInFrames={4.5 * fps}
      >
        <ResolutionScene />
      </Sequence>
      <TransitionSweep at={3.5 * fps} />
      <TransitionSweep at={10.5 * fps} />
      <div
        className="flex items-center justify-between"
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 55,
          opacity: interpolate(f, [0, 28], [0, 1], clamp),
        }}
      >
        <div className="flex items-center gap-4">
          <Brand />
          <strong
            style={{ fontSize: 23, fontWeight: 650, letterSpacing: -0.5 }}
          >
            C4 AI
          </strong>
          <span
            style={{
              width: 1,
              height: 20,
              background: "#3f3f46",
              margin: "0 8px",
            }}
          />
          <span
            style={{ font: "13px " + mono, color: "#a1a1aa", letterSpacing: 2 }}
          >
            RELIABILITY ENGINEERING
          </span>
        </div>
        <span style={{ font: "13px " + mono, color: "#71717a" }}>
          PRODUCT SHOWCASE / S1
        </span>
      </div>
      <div
        className="flex items-center justify-between"
        style={{
          position: "absolute",
          bottom: 48,
          left: 90,
          right: 90,
          font: "13px " + mono,
          color: "#71717a",
        }}
      >
        <span>
          Reproducción acelerada de evidencia · casos sintéticos · respuestas
          reales
        </span>
        <span>Versiones de prueba / sin aplicación en producción</span>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 2,
          width: `${(f / 899) * 100}%`,
          background: `linear-gradient(90deg,${C.cyan},${C.violet})`,
          opacity: 0.6,
        }}
      />
      <AbsoluteFill
        style={{
          background: "#09090b",
          opacity: interpolate(f, [0, 15, 879, 899], [1, 0, 0, 1], clamp),
          pointerEvents: "none",
        }}
      />
      <AudioLayer {...props} />
    </AbsoluteFill>
  );
};
