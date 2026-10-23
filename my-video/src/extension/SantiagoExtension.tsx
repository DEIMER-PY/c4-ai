import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import narration from "./narration.json";
import manifest from "./audio-manifest.json";

const C = {
  bg: "#faf9fd",
  ink: "#201e2c",
  muted: "#6b677b",
  violet: "#7140ff",
  border: "#ded9ec",
  green: "#218764",
  panel: "#14111f",
};
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const mono = "'Cascadia Code','Consolas',monospace";
const entry = (f: number, delay = 0): CSSProperties => ({
  opacity: interpolate(f - delay, [0, 15], [0, 1], clamp),
  transform: `translateY(${(1 - spring({ frame: f - delay, fps: 30, config: { damping: 24, stiffness: 100 } })) * 28}px)`,
});

export const TracePaper = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <svg
        width="1920"
        height="1080"
        style={{ position: "absolute", inset: 0 }}
        viewBox="0 0 1920 1080"
        fill="none"
      >
        {Array.from({ length: 17 }, (_, i) => (
          <path
            key={i}
            d={`M-80 ${i * 76 - 90} C420 ${i * 76 - 225 + Math.sin(f / 120 + i) * 12} 1210 ${i * 76 + 140} 2000 ${i * 76 - 90}`}
            stroke={
              i % 3 === 0 ? "#b798ea" : i % 3 === 1 ? "#c5b8ec" : "#b2d5e8"
            }
            strokeOpacity={0.18}
            strokeWidth="1"
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
const Tag = ({
  children,
  color = C.violet,
}: {
  children: ReactNode;
  color?: string;
}) => (
  <span
    style={{
      fontSize: 18,
      fontFamily: mono,
      color,
      background: `${color}0c`,
      border: `1px solid ${color}33`,
      borderRadius: 22,
      padding: "9px 16px",
      display: "inline-block",
    }}
  >
    {children}
  </span>
);
const WhiteCard = ({
  children,
  style = {},
}: {
  children: ReactNode;
  style?: CSSProperties;
}) => (
  <div
    style={{
      boxSizing: "border-box",
      border: `1px solid ${C.border}`,
      background: "#ffffffdb",
      borderRadius: 24,
      padding: 30,
      ...style,
    }}
  >
    {children}
  </div>
);
const Chapter = ({
  index,
  title,
  subtitle,
  duration,
  children,
}: {
  index: string;
  title: string;
  subtitle: string;
  duration: number;
  children: ReactNode;
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        fontFamily: "Inter,'Segoe UI',sans-serif",
        color: C.ink,
        opacity: interpolate(
          f,
          [0, 12, duration - 12, duration - 1],
          [0, 1, 1, 0],
          clamp,
        ),
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 110,
          fontWeight: 600,
          fontSize: 24,
        }}
      >
        C4 AI{" "}
        <span
          style={{
            fontSize: 16,
            color: C.muted,
            fontWeight: 400,
            marginLeft: 20,
          }}
        >
          Agent Reliability Engineer
        </span>
      </div>
      <div style={{ position: "absolute", right: 110, top: 70 }}>
        <Tag>{index}</Tag>
      </div>
      <div
        style={{ position: "absolute", left: 110, top: 180, ...entry(f, 8) }}
      >
        <h1
          style={{
            fontWeight: 600,
            fontSize: 76,
            lineHeight: 1.1,
            letterSpacing: -3,
            margin: 0,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            color: C.muted,
            fontSize: 28,
            lineHeight: 1.5,
            marginTop: 22,
            maxWidth: 1650,
          }}
        >
          {subtitle}
        </p>
      </div>
      {children}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          left: 110,
          fontFamily: mono,
          fontSize: 14,
          color: "#888396",
        }}
      >
        CASOS SINTÉTICOS · EVIDENCIA REGISTRADA · SIN CAMBIOS EN PRODUCCIÓN
      </div>
    </AbsoluteFill>
  );
};

export const TestsChapter = () => {
  const f = useCurrentFrame();
  return (
    <Chapter
      index="PRUEBAS / HOY Y SIGUIENTE"
      title="Cuando tu agente falla, vuelve a probar."
      subtitle="C4 compara comportamientos. La decisión llega después de la evaluación."
      duration={450}
    >
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 420,
          display: "flex",
          gap: 24,
        }}
      >
        {[
          "Reproducir el caso",
          "Evaluar ambas versiones",
          "Detectar regresiones",
          "Decidir con evidencia",
        ].map((t, i) => (
          <WhiteCard
            key={t}
            style={{ width: 405, height: 170, ...entry(f, 35 + i * 28) }}
          >
            <div
              style={{
                fontFamily: mono,
                fontSize: 23,
                color: C.violet,
                marginBottom: 20,
              }}
            >
              0{i + 1}
            </div>
            <div style={{ fontSize: 29, fontWeight: 600, lineHeight: 1.3 }}>
              {t}
            </div>
          </WhiteCard>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 685,
          display: "flex",
          gap: 28,
          ...entry(f, 160),
        }}
      >
        <WhiteCard
          style={{ width: 830, height: 155, borderColor: "#21876455" }}
        >
          <Tag color={C.green}>DISPONIBLE</Tag>
          <div style={{ fontSize: 27, marginTop: 17 }}>
            Casos controlados · mismo dataset · seguridad
          </div>
        </WhiteCard>
        <WhiteCard style={{ width: 830, height: 155 }}>
          <Tag>PLANIFICADO</Tag>
          <div style={{ fontSize: 27, marginTop: 17 }}>
            Pruebas unitarias de repositorios · runner aislado
          </div>
        </WhiteCard>
      </div>
    </Chapter>
  );
};

export const JevChapter = () => {
  const f = useCurrentFrame();
  return (
    <Chapter
      index="JEV / PLANIFICADO"
      title="Probabilidad para orientar la investigación."
      subtitle="Jev de TypeSafe: propuesta en modo sombra, todavía sin integración en C4."
      duration={450}
    >
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 420,
          width: 440,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {[
          ["Choice", "Categoría del incidente"],
          ["Noul", "Riesgo de política"],
          ["Score", "Prioridad de investigación"],
        ].map(([k, t], i) => (
          <WhiteCard
            key={k}
            style={{ padding: "22px 28px", ...entry(f, 30 + i * 35) }}
          >
            <div style={{ fontFamily: mono, color: C.violet, fontSize: 21 }}>
              {k}
            </div>
            <div style={{ fontSize: 24, marginTop: 12 }}>{t}</div>
          </WhiteCard>
        ))}
      </div>
      <svg
        width="330"
        height="260"
        style={{ position: "absolute", left: 550, top: 495 }}
        fill="none"
      >
        <path
          d="M0 20C170 20 150 130 330 130M0 130H330M0 240C170 240 150 130 330 130"
          stroke="#bca5f9"
          strokeWidth="2"
        />
        <path
          d="M0 130H330"
          stroke={C.violet}
          strokeWidth="2"
          strokeDasharray="10 45"
          strokeDashoffset={-f * 2}
        />
      </svg>
      <WhiteCard
        style={{
          position: "absolute",
          left: 880,
          top: 505,
          width: 420,
          height: 280,
          ...entry(f, 100),
          borderColor: "#7140ff66",
          background: "#f0eafa",
        }}
      >
        <Tag>SHADOW MODE</Tag>
        <div style={{ fontSize: 30, fontWeight: 600, margin: "27px 0 18px" }}>
          Categorizar y priorizar
        </div>
        <div style={{ fontSize: 23, color: C.muted, lineHeight: 1.5 }}>
          Registrar la recomendación.
          <br />
          Medir antes de activar rutas.
        </div>
      </WhiteCard>
      <div
        style={{
          position: "absolute",
          left: 1370,
          top: 515,
          width: 430,
          ...entry(f, 180),
        }}
      >
        <WhiteCard
          style={{
            background: C.panel,
            color: "#faf9fd",
            borderColor: C.panel,
          }}
        >
          <div style={{ fontSize: 31, fontWeight: 600 }}>
            El gate no cambia.
          </div>
          <p
            style={{
              fontSize: 24,
              lineHeight: 1.5,
              color: "#b9b3ca",
              marginBottom: 0,
            }}
          >
            Mismas pruebas.
            <br />
            Seguridad obligatoria.
            <br />
            Cero regresiones.
          </p>
        </WhiteCard>
      </div>
    </Chapter>
  );
};

export const ImpactChapter = () => {
  const f = useCurrentFrame();
  return (
    <Chapter
      index="IMPACTO / OBJETIVO"
      title="Una corrección que tu equipo puede explicar."
      subtitle="Menos ajustes a ciegas. La misma evidencia para desarrollo, calidad y operaciones."
      duration={330}
    >
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 435,
          display: "flex",
          gap: 28,
        }}
      >
        {[
          ["Desarrollo", "Entender la causa.", "Candidato y diff versionados."],
          [
            "Calidad",
            "Comprobar la mejora.",
            "Comparación por caso y regresiones.",
          ],
          [
            "Operaciones",
            "Explicar la decisión.",
            "Reporte trazable y revisión humana.",
          ],
        ].map(([who, t, d], i) => (
          <WhiteCard
            key={who}
            style={{
              width: 545,
              height: 340,
              padding: 35,
              ...entry(f, 30 + i * 40),
            }}
          >
            <Tag>{who}</Tag>
            <div
              style={{
                fontSize: 39,
                fontWeight: 600,
                letterSpacing: -1,
                lineHeight: 1.12,
                marginTop: 30,
              }}
            >
              {t}
            </div>
            <div
              style={{
                fontSize: 26,
                color: C.muted,
                lineHeight: 1.5,
                marginTop: 22,
              }}
            >
              {d}
            </div>
          </WhiteCard>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 115,
          top: 845,
          fontSize: 23,
          color: C.muted,
          ...entry(f, 190),
        }}
      >
        Ahorro de tiempo, costo y efecto de JEV: objetivos por medir, sin
        porcentajes inventados.
      </div>
    </Chapter>
  );
};

export const EcosystemChapter = () => {
  const f = useCurrentFrame();
  return (
    <Chapter
      index="PRODUCTO / ACTUAL + ROADMAP"
      title="Un núcleo. Varias formas de trabajar."
      subtitle="Website y documentación implementados. Publicación pendiente."
      duration={240}
    >
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 430,
          display: "grid",
          gridTemplateColumns: "repeat(3,545px)",
          gap: 25,
        }}
      >
        {[
          ["CLI + chat", "Disponible"],
          ["Dashboard + API local", "Disponible"],
          ["Website + documentación", "Implementado"],
          ["Hermes + Telegram", "Verificado"],
          ["Desktop / Tauri", "Siguiente paso"],
          ["App / React Native", "Planificada"],
        ].map(([name, state], i) => (
          <WhiteCard
            key={name}
            style={{ height: 155, ...entry(f, 18 + i * 13) }}
          >
            <div style={{ fontSize: 29, fontWeight: 600, marginBottom: 20 }}>
              {name}
            </div>
            <Tag color={i < 4 ? C.green : C.violet}>{state}</Tag>
          </WhiteCard>
        ))}
      </div>
    </Chapter>
  );
};

export const SantiagoAdditions = ({ silent = false }: { silent?: boolean }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chapter = narration.find(
    (c) => f >= c.start * fps && f < (c.start + c.duration) * fps,
  );
  const words = chapter?.text.split(" ") ?? [];
  const group = chapter
    ? Math.min(
        Math.ceil(words.length / 13) - 1,
        Math.floor(
          (f - chapter.start * fps) /
            ((chapter.duration * fps) / Math.ceil(words.length / 13)),
        ),
      )
    : 0;
  const clips: Array<{
    file: string;
    startFrame: number;
    durationFrames: number;
  }> = manifest.clips;
  return (
    <AbsoluteFill>
      <TracePaper />
      <Sequence durationInFrames={450}>
        <TestsChapter />
      </Sequence>
      <Sequence from={450} durationInFrames={450}>
        <JevChapter />
      </Sequence>
      <Sequence from={900} durationInFrames={330}>
        <ImpactChapter />
      </Sequence>
      <Sequence from={1230} durationInFrames={240}>
        <EcosystemChapter />
      </Sequence>
      <div
        style={{
          position: "absolute",
          left: 340,
          right: 340,
          bottom: 62,
          textAlign: "center",
          padding: "14px 24px",
          borderRadius: 20,
          background: "#ffffffed",
          border: `1px solid ${C.border}`,
          fontFamily: "'Segoe UI',sans-serif",
          fontSize: 27,
          lineHeight: 1.35,
          color: C.ink,
        }}
      >
        {words.slice(group * 13, group * 13 + 13).join(" ")}
      </div>
      <Audio
        src={staticFile("launch/ambient-drone.mp3")}
        loop
        volume={(n) =>
          silent
            ? 0
            : interpolate(n, [0, 15, 1455, 1470], [0, 0.07, 0.07, 0], clamp)
        }
      />
      {[0, 450, 900, 1230].map((n) => (
        <Sequence key={n} from={n} durationInFrames={24}>
          <Audio
            src={staticFile("launch/whoosh.mp3")}
            volume={silent ? 0 : 0.08}
          />
        </Sequence>
      ))}
      {clips.map((c) => (
        <Sequence
          key={c.file}
          from={c.startFrame}
          durationInFrames={c.durationFrames}
        >
          <Audio src={staticFile(c.file)} volume={silent ? 0 : 1} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const SantiagoClosing = ({ silent = false }: { silent?: boolean }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <OffthreadVideo
        src={staticFile("reference/santiago-original.mp4")}
        trimBefore={1842}
        style={{ opacity: interpolate(f, [0, 9, 18], [0, 0, 1], clamp) }}
        volume={(n) => (silent ? 0 : interpolate(n, [0, 4], [0, 1], clamp))}
      />
    </AbsoluteFill>
  );
};

export const SantiagoExtended = ({ silent = false }: { silent?: boolean }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Sequence durationInFrames={1842}>
      <OffthreadVideo
        src={staticFile("reference/santiago-original.mp4")}
        trimAfter={1842}
        volume={(f) =>
          silent ? 0 : interpolate(f, [0, 4, 1838, 1842], [1, 1, 1, 0], clamp)
        }
      />
    </Sequence>
    <Sequence from={1842} durationInFrames={1470}>
      <SantiagoAdditions silent={silent} />
    </Sequence>
    <Sequence from={3312} durationInFrames={288}>
      <SantiagoClosing silent={silent} />
    </Sequence>
  </AbsoluteFill>
);

export const SantiagoBrian = () => (
  <AbsoluteFill>
    <SantiagoExtended silent />
    <Audio src={staticFile("extension-voice/brian-120s.mp3")} />
  </AbsoluteFill>
);
