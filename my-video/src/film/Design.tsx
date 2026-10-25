import { useId, type CSSProperties, type ReactNode } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const colors = {
  bg: "#07090e",
  surface: "#0e131f",
  border: "#252b3b",
  text: "#fafafa",
  muted: "#a1a6b5",
  cyan: "#06b6d4",
  violet: "#8b5cf6",
  pink: "#ec4899",
  gold: "#f59e0b",
  green: "#10b981",
  red: "#ef4444",
};
export const mono = "'Cascadia Code','Consolas',monospace";
export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
export const enter = (frame: number, delay = 0) =>
  spring({
    frame: frame - delay,
    fps: 30,
    config: { damping: 22, stiffness: 115 },
  });
export const reveal = (frame: number, delay = 0): CSSProperties => ({
  opacity: interpolate(frame - delay, [0, 18], [0, 1], clamp),
  transform: `translateY(${(1 - enter(frame, delay)) * 32}px)`,
});

export const Mark = ({ size = 44 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="1" y="1" width="46" height="46" rx="13" stroke="#444854" />
    <path
      d="M26 13a12 12 0 1 0 0 22M32 17l7 7-7 7"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="21" cy="24" r="3" fill={colors.cyan} />
  </svg>
);

export const Background = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <AbsoluteFill
        style={{
          opacity: 0.28,
          backgroundImage:
            "linear-gradient(#ffffff06 1px,transparent 1px),linear-gradient(90deg,#ffffff06 1px,transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1250,
          height: 1100,
          top: -450,
          left: 700,
          transform: `translate3d(${Math.sin(f / 180) * 60}px,${Math.cos(f / 230) * 35}px,0)`,
          background: "radial-gradient(ellipse,#8b5cf61c,transparent 65%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1100,
          top: 400,
          left: -400,
          transform: `translate3d(${Math.cos(f / 220) * 80}px,0,0)`,
          background: "radial-gradient(ellipse,#06b6d414,transparent 65%)",
        }}
      />
    </AbsoluteFill>
  );
};

export const Panel = ({
  children,
  style = {},
  accent = colors.border,
}: {
  children: ReactNode;
  style?: CSSProperties;
  accent?: string;
}) => (
  <div
    className="rounded-3xl border"
    style={{
      background: "linear-gradient(135deg,#111622eb,#090c14f0)",
      borderColor: accent,
      boxShadow: "0 24px 70px #0005",
      ...style,
    }}
  >
    {children}
  </div>
);
export const Badge = ({
  children,
  color = colors.cyan,
}: {
  children: ReactNode;
  color?: string;
}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      fontFamily: mono,
      fontSize: 17,
      color,
      border: `1px solid ${color}44`,
      background: `${color}0c`,
      padding: "9px 15px",
      borderRadius: 30,
    }}
  >
    <span style={{ width: 6, height: 6, borderRadius: 9, background: color }} />
    {children}
  </span>
);
export const Scene = ({
  index,
  kicker,
  title,
  subtitle,
  children,
  status = "REPLAY / EVIDENCIA",
  color = colors.cyan,
}: {
  index: number;
  kicker: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  status?: string;
  color?: string;
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{ color: colors.text, fontFamily: "Inter,'Segoe UI',sans-serif" }}
    >
      <Background />
      <div
        style={{
          position: "absolute",
          left: 86,
          top: 48,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Mark />
        <b style={{ fontSize: 24 }}>C4 AI</b>
        <span
          style={{
            width: 1,
            height: 24,
            background: colors.border,
            margin: "0 8px",
          }}
        />
        <span
          style={{
            fontFamily: mono,
            fontSize: 14,
            color: colors.muted,
            letterSpacing: 2,
          }}
        >
          AGENT RELIABILITY ENGINEER
        </span>
      </div>
      <div style={{ position: "absolute", right: 86, top: 57 }}>
        <Badge color={color}>{status}</Badge>
      </div>
      <div
        style={{ position: "absolute", left: 108, top: 149, ...reveal(f, 4) }}
      >
        <div
          style={{
            fontFamily: mono,
            fontSize: 17,
            color,
            letterSpacing: 3,
            marginBottom: 23,
          }}
        >
          0{index} / {kicker}
        </div>
        <h1
          style={{
            fontSize: 68,
            letterSpacing: -3,
            lineHeight: 1.08,
            margin: 0,
            fontWeight: 600,
            maxWidth: 1630,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <div
            style={{
              fontSize: 23,
              color: colors.muted,
              marginTop: 20,
              lineHeight: 1.5,
              maxWidth: 1450,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          perspective: 1200,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "50% 55%",
            transform: `rotateX(${Math.sin(f / (fps * 6)) * 0.45}deg) rotateY(${Math.sin(f / (fps * 7)) * 0.6}deg) scale(${interpolate(f, [0, 600], [1, 1.012], clamp)})`,
          }}
        >
          {children}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 86,
          bottom: 32,
          fontFamily: mono,
          fontSize: 13,
          color: "#747b8e",
        }}
      >
        CASOS SINTÉTICOS · RESPUESTAS REALES · VERSIONES DE PRUEBA
      </div>
      <div
        style={{
          position: "absolute",
          right: 86,
          bottom: 32,
          fontFamily: mono,
          fontSize: 13,
          color: "#747b8e",
        }}
      >
        DEIMER + SANTIAGO / S1
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 2,
          width: `${interpolate(f, [0, 450], [0, 100], clamp)}%`,
          background: `linear-gradient(90deg,${color},${colors.violet})`,
        }}
      />
    </AbsoluteFill>
  );
};

export type CortexState =
  | "idle"
  | "alert"
  | "scanning"
  | "hermes-sync"
  | "gate-check"
  | "celebrate";
export const CortexMascot = ({
  state = "idle",
  size = 240,
}: {
  state?: CortexState;
  size?: number;
}) => {
  const f = useCurrentFrame();
  const id = useId().replace(/:/g, "");
  const c =
    state === "alert"
      ? colors.red
      : state === "hermes-sync"
        ? colors.gold
        : state === "celebrate" || state === "gate-check"
          ? colors.green
          : colors.violet;
  const wings = state === "hermes-sync" || state === "celebrate";
  return (
    <div
      style={{
        width: size,
        height: size,
        transform: `translateY(${Math.sin(f / 17) * 7}px) rotate(${Math.sin(f / 31) * 1.4}deg)`,
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 300 300" fill="none">
        <defs>
          <radialGradient id={`glow${id}`}>
            <stop stopColor={c} stopOpacity=".45" />
            <stop offset="1" stopColor={c} stopOpacity="0" />
          </radialGradient>
          <linearGradient
            id={`shell${id}`}
            x1="60"
            y1="45"
            x2="220"
            y2="250"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#273147" />
            <stop offset=".5" stopColor="#111726" />
            <stop offset="1" stopColor="#080d17" />
          </linearGradient>
          <linearGradient id={`gold${id}`}>
            <stop stopColor="#fde68a" />
            <stop offset="1" stopColor="#b45309" />
          </linearGradient>
        </defs>
        <circle
          cx="150"
          cy="145"
          r={144 + Math.sin(f / 15) * 5}
          fill={`url(#glow${id})`}
        />
        <g
          opacity={wings ? 1 : 0.35}
          transform={`translate(150 130) scale(${wings ? 1 : 0.8}) translate(-150 -130)`}
        >
          <path
            d="M76 125 23 76l12 38-22-7 24 29-18 3 57 34M224 125l53-49-12 38 22-7-24 29 18 3-57 34"
            fill={`url(#gold${id})`}
            stroke="#fcd34d"
            strokeWidth="1.5"
          />
        </g>
        <ellipse cx="150" cy="267" rx="53" ry="7" fill="#000" opacity=".4" />
        <circle
          cx="150"
          cy="145"
          r="86"
          fill={`url(#shell${id})`}
          stroke="#4c5669"
          strokeWidth="2"
        />
        <path
          d="M79 111a80 80 0 0 1 119-31"
          stroke="#cbd5e1"
          opacity=".4"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle
          cx="150"
          cy="145"
          r="70"
          stroke={c}
          opacity=".4"
          strokeDasharray="3 9"
          transform={`rotate(${f * 0.35} 150 145)`}
        />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI) / 6;
          const x = 150 + Math.cos(a) * 55,
            y = 137 + Math.sin(a) * 46;
          return (
            <g
              key={i}
              stroke={i % 2 ? c : colors.cyan}
              opacity={0.3 + 0.55 * (0.5 + 0.5 * Math.sin(f / 12 + i))}
            >
              <path
                d={`M150 139 Q${150 + Math.cos(a + 0.3) * 30} ${139 + Math.sin(a + 0.3) * 27} ${x} ${y}`}
                strokeWidth="1.8"
              />
              <path
                d={`M${x} ${y} l${Math.cos(a + 0.8) * 13} ${Math.sin(a + 0.8) * 13}`}
              />
              <circle cx={x} cy={y} r="2" fill={c} />
            </g>
          );
        })}
        <circle cx="150" cy="138" r={10 + Math.sin(f / 10)} fill={c} />
        <circle cx="150" cy="138" r="5" fill="#fff1dc" />
        <rect
          x="110"
          y="174"
          width="80"
          height="25"
          rx="12"
          fill="#05090f"
          stroke="#334155"
        />
        <path
          d={
            state === "alert"
              ? "M125 183l10 7M175 183l-10 7"
              : state === "celebrate"
                ? "m126 188 7-5 7 5m20 0 7-5 7 5"
                : "M127 186h10m26 0h10"
          }
          stroke={state === "alert" ? colors.red : colors.cyan}
          strokeWidth="3"
          strokeLinecap="round"
        />
        {state === "scanning" && (
          <path
            d={`M91 ${112 + (f % 80)}h118`}
            stroke={colors.cyan}
            opacity=".55"
          />
        )}
      </svg>
    </div>
  );
};

export const NeuralArt = ({ size = 360 }: { size?: number }) => {
  const f = useCurrentFrame();
  return (
    <svg width={size} height={size} viewBox="0 0 420 420" fill="none">
      <defs>
        <radialGradient id="neuralGlow">
          <stop stopColor="#ec4899" stopOpacity=".6" />
          <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="196" cy="192" r="110" fill="url(#neuralGlow)" />
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i * Math.PI) / 12;
        const r = 138 + (i % 4) * 12;
        const x = 196 + Math.cos(a) * r,
          y = 192 + Math.sin(a) * r;
        const mx = 196 + Math.cos(a + 0.15) * 78,
          my = 192 + Math.sin(a + 0.15) * 78;
        const c = i < 12 ? colors.cyan : colors.pink;
        return (
          <g
            key={i}
            stroke={c}
            opacity={0.4 + 0.5 * (0.5 + 0.5 * Math.sin(f / 17 + i))}
          >
            <path d={`M196 192 Q${mx} ${my} ${x} ${y}`} strokeWidth="1.4" />
            <path
              d={`M${mx} ${my} l${Math.cos(a + 0.6) * 56} ${Math.sin(a + 0.6) * 56}m${-Math.cos(a + 0.6) * 56} ${-Math.sin(a + 0.6) * 56}l${Math.cos(a - 0.6) * 52} ${Math.sin(a - 0.6) * 52}`}
              strokeWidth="1"
            />
            <circle cx={x} cy={y} r="2.5" fill={c} />
          </g>
        );
      })}
      <path
        d="M200 200Q216 315 330 345l60 26"
        stroke={colors.violet}
        strokeWidth="8"
      />
      <path
        d="M200 200Q216 315 330 345l60 26"
        stroke={colors.cyan}
        strokeWidth="2"
      />
      <circle cx="196" cy="192" r="17" fill={colors.pink} />
      <circle cx="196" cy="192" r="8" fill="#fff1c7" />
    </svg>
  );
};

export const Terminal = ({
  title,
  children,
  style,
}: {
  title: string;
  children: ReactNode;
  style?: CSSProperties;
}) => (
  <Panel style={{ overflow: "hidden", ...style }}>
    <div
      style={{
        height: 53,
        borderBottom: `1px solid ${colors.border}`,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "0 22px",
        background: "#141822",
      }}
    >
      {["#fb7185", "#fbbf24", "#34d399"].map((c) => (
        <span
          key={c}
          style={{
            width: 9,
            height: 9,
            borderRadius: 10,
            background: c,
            opacity: 0.7,
          }}
        />
      ))}
      <span
        style={{
          fontFamily: mono,
          fontSize: 16,
          color: colors.muted,
          marginLeft: 22,
        }}
      >
        {title}
      </span>
    </div>
    {children}
  </Panel>
);

export const Line = ({
  text,
  delay = 0,
  color = colors.muted,
}: {
  text: string;
  delay?: number;
  color?: string;
}) => {
  const f = useCurrentFrame();
  const n = Math.floor(
    interpolate(f - delay, [0, 55], [0, text.length], clamp),
  );
  return (
    <div
      style={{
        fontFamily: mono,
        fontSize: 20,
        lineHeight: 1.75,
        color,
        opacity: f >= delay ? 1 : 0,
        whiteSpace: "pre-wrap",
      }}
    >
      {text.slice(0, n)}
      {f >= delay && f < delay + 55 && Math.floor(f / 12) % 2 === 0 ? "▌" : ""}
    </div>
  );
};
