import { interpolate, useCurrentFrame } from "remotion";
import {
  Badge,
  CortexMascot,
  Line,
  Mark,
  NeuralArt,
  Panel,
  Scene,
  Terminal,
  clamp,
  colors as C,
  enter,
  mono,
  reveal,
} from "./Design";

export const Scene1Problem = () => {
  const f = useCurrentFrame();
  const patched = f > 180;
  const broken = f > 290;
  return (
    <Scene
      index={1}
      kicker="EL DESAFÍO"
      title="Una respuesta convincente puede fallar."
      subtitle="Agentes de soporte y reembolsos · escenario ilustrativo de riesgo"
      color={C.red}
      status="ESCENARIO ILUSTRATIVO"
    >
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 350,
          width: 1060,
          ...reveal(f, 20),
        }}
      >
        <Terminal title="refund-agent / execution trace">
          <div style={{ padding: "28px 36px", height: 375 }}>
            <Line
              text="$ refund-agent: evaluar solicitud"
              delay={35}
              color={C.text}
            />
            <Line
              text="[trace] política → herramientas → respuesta"
              delay={80}
            />
            <Line
              text="[error] reembolso fuera de política"
              delay={120}
              color={C.red}
            />
            <Line
              text="[patch] ajuste manual del prompt"
              delay={185}
              color={C.gold}
            />
            <Line
              text="[case] incidente inicial corregido"
              delay={230}
              color={C.green}
            />
            <Line
              text="[alert] regresiones en casos anteriores"
              delay={300}
              color={C.red}
            />
          </div>
        </Terminal>
      </div>
      <div style={{ position: "absolute", right: 190, top: 280 }}>
        <CortexMascot
          state={broken ? "alert" : patched ? "scanning" : "alert"}
          size={380}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 104,
          top: 845,
          display: "flex",
          gap: 20,
        }}
      >
        {["Revisar trazas", "Ajustar a ciegas", "Repetir pruebas"].map(
          (t, i) => (
            <Panel
              key={t}
              style={{
                width: 450,
                padding: "25px 28px",
                ...reveal(f, 140 + i * 28),
              }}
            >
              <span style={{ fontFamily: mono, fontSize: 15, color: C.red }}>
                0{i + 1} / FRICCIÓN
              </span>
              <div style={{ fontSize: 26, marginTop: 10 }}>{t}</div>
            </Panel>
          ),
        )}
      </div>
      <div
        style={{
          position: "absolute",
          right: 104,
          top: 710,
          width: 540,
          fontSize: 27,
          lineHeight: 1.5,
          color: broken ? C.red : C.muted,
          ...reveal(f, 270),
          transform: `translateX(${broken ? Math.sin(f * 2) * 2 : 0}px)`,
        }}
      >
        Resolver un caso no demuestra que el resto siga funcionando.
      </div>
    </Scene>
  );
};

export const Scene2HarnessCLI = () => {
  const f = useCurrentFrame();
  return (
    <Scene
      index={2}
      kicker="C4 AI HARNESS"
      title="Conversa. Investiga. Comprueba."
      subtitle="Consola interactiva y ciclo de confiabilidad sobre agentes de prueba."
    >
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 345,
          width: 1695,
          ...reveal(f, 20),
        }}
      >
        <Terminal title="C4 AI / Harness CLI">
          <div style={{ display: "flex", padding: 25, height: 535, gap: 42 }}>
            <div
              style={{
                width: 430,
                borderRight: `1px solid ${C.border}`,
                paddingTop: 20,
              }}
            >
              <NeuralArt size={410} />
              <div
                style={{
                  fontFamily: mono,
                  textAlign: "center",
                  fontSize: 16,
                  color: C.violet,
                }}
              >
                NEURAL RELIABILITY CORE
              </div>
            </div>
            <div style={{ paddingTop: 14, flex: 1 }}>
              <div
                style={{
                  fontSize: 25,
                  fontWeight: 600,
                  color: C.pink,
                  marginBottom: 16,
                }}
              >
                C4 AI HARNESS CLI
              </div>
              <Line
                delay={35}
                text="Razonamiento: Grok · gateway del reto"
                color={C.text}
              />
              <Line delay={75} text="Target configurable: Groq / Qwen o Grok" />
              <Line delay={115} text="Entorno: local · soporte / reembolsos" />
              <Line
                delay={160}
                text="[*] detectar > diagnosticar > proponer"
                color={C.cyan}
              />
              <Line
                delay={205}
                text="[*] evaluar > aceptar / rechazar / escalar"
                color={C.cyan}
              />
              <Line
                delay={255}
                text="[gate] mismas pruebas · cero regresiones"
                color={C.green}
              />
              <Line
                delay={305}
                text="c4 > ¿Qué evidencia respalda esta decisión?"
                color={C.text}
              />
              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  gap: 12,
                  ...reveal(f, 345),
                }}
              >
                {["/help", "/doctor", "/use last", "/chat groq", "/status"].map(
                  (t) => (
                    <Badge key={t}>{t}</Badge>
                  ),
                )}
              </div>
            </div>
          </div>
        </Terminal>
      </div>
      <div
        style={{
          position: "absolute",
          left: 135,
          top: 950,
          fontFamily: mono,
          fontSize: 18,
          color: C.muted,
        }}
      >
        uv run --locked c4 --target-provider groq tui
      </div>
    </Scene>
  );
};

export const Scene3HermesAgent = () => {
  const f = useCurrentFrame();
  const connected = f > 130;
  return (
    <Scene
      index={3}
      kicker="HERMES × C4"
      title="La conversación encuentra la evidencia."
      subtitle="Hermes Agent → MCP stdio → herramientas de lectura de C4"
      color={C.gold}
    >
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 360,
          width: 970,
          ...reveal(f, 15),
        }}
      >
        <Terminal title="HERMES AGENT / local">
          <div style={{ padding: "32px 40px", height: 420 }}>
            <div
              style={{
                fontFamily: mono,
                fontSize: 56,
                fontWeight: 700,
                color: C.gold,
                letterSpacing: 5,
                marginBottom: 20,
              }}
            >
              HERMES
            </div>
            <Line delay={45} text="provider: custom:c4-reto" color={C.text} />
            <Line delay={85} text="protocol: chat_completions" />
            <Line
              delay={120}
              text={
                connected
                  ? "MCP c4-ai (stdio)  → CONNECTED"
                  : "MCP c4-ai (stdio)  → connecting"
              }
              color={connected ? C.green : C.gold}
            />
            <Line
              delay={170}
              text="4 herramientas C4 · solo lectura"
              color={C.cyan}
            />
            <Line delay={230} text="get_report · get_evaluation" />
            <Line delay={275} text="get_incident · list_incidents" />
          </div>
        </Terminal>
      </div>
      <div style={{ position: "absolute", right: 190, top: 330 }}>
        <CortexMascot state="hermes-sync" size={365} />
      </div>
      <div
        style={{
          position: "absolute",
          right: 135,
          top: 725,
          width: 570,
          ...reveal(f, 290),
        }}
      >
        <Panel accent={`${C.gold}55`} style={{ padding: 30 }}>
          <Badge color={C.gold}>LÍMITES CONSERVADOS</Badge>
          <p style={{ fontSize: 26, lineHeight: 1.5, marginBottom: 0 }}>
            Consultar reportes y comparar resultados. Sin ejecución ni cambios
            de producción.
          </p>
        </Panel>
      </div>
      <svg
        style={{ position: "absolute", left: 1080, top: 530 }}
        width="220"
        height="100"
      >
        <path d="M0 50H220" stroke={`${C.gold}33`} strokeWidth="2" />
        <path
          d="M0 50H220"
          stroke={C.gold}
          strokeWidth="2"
          strokeDasharray="12 90"
          strokeDashoffset={-f * 3}
        />
      </svg>
    </Scene>
  );
};

const modules = [
  ["Inspector", "trace_reader", "Hallazgos e incidente"],
  ["Diagnoser", "Grok", "Hipótesis y referencias"],
  ["Patcher", "patch_writer", "Candidato versionado"],
  ["Evaluator", "eval_runner", "Comparación y regresiones"],
  ["Security Sentinel", "policy checks", "Controles obligatorios"],
  ["Reporter", "evidence store", "Decisión trazable"],
];
export const Scene4Architecture = () => {
  const f = useCurrentFrame();
  const active = Math.min(5, Math.floor(Math.max(0, f - 140) / 65));
  return (
    <Scene
      index={4}
      kicker="ARQUITECTURA"
      title="Un núcleo. Seis responsabilidades."
      subtitle="API y CLI comparten servicios de negocio. Los modelos no sustituyen el gate."
    >
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 345,
          display: "flex",
          gap: 22,
          ...reveal(f, 20),
        }}
      >
        {[
          ["CLI", "Typer / Rich"],
          ["Dashboard", "Next.js / TypeScript"],
          ["API + servicios", "FastAPI / Pydantic"],
          ["Gateway", "Grok configurable"],
        ].map(([t, d], i) => (
          <Panel
            key={t}
            accent={i === 2 ? `${C.cyan}66` : C.border}
            style={{ width: 405, padding: "22px 28px" }}
          >
            <div style={{ fontSize: 25 }}>{t}</div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 16,
                color: C.muted,
                marginTop: 9,
              }}
            >
              {d}
            </div>
          </Panel>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 505,
          display: "grid",
          gridTemplateColumns: "repeat(3, 535px)",
          gap: 25,
        }}
      >
        {modules.map(([t, tool, result], i) => (
          <Panel
            key={t}
            accent={f > 140 + i * 65 ? `${C.cyan}77` : C.border}
            style={{
              height: 180,
              padding: "23px 26px",
              transform: `scale(${i === active ? 1 + Math.sin(Math.min(1, Math.max(0, (f - 140 - i * 65) / 30)) * Math.PI) * 0.025 : 1})`,
              ...reveal(f, 65 + i * 15),
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <b style={{ fontSize: 26 }}>{t}</b>
              <span
                style={{
                  color: f > 140 + i * 65 ? C.cyan : C.muted,
                  fontFamily: mono,
                  fontSize: 16,
                }}
              >
                0{i + 1}
              </span>
            </div>
            <div
              style={{
                fontFamily: mono,
                color: C.violet,
                fontSize: 17,
                margin: "13px 0",
              }}
            >
              {tool}
            </div>
            <div style={{ fontSize: 20, color: C.muted }}>{result}</div>
          </Panel>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 116,
          top: 932,
          display: "flex",
          gap: 25,
          ...reveal(f, 450),
        }}
      >
        <Badge color={C.green}>HOY: checkpoints locales</Badge>
        <Badge color={C.gold}>PLANIFICADO: PostgreSQL / JSONB</Badge>
        <Badge color={C.gold}>PLANIFICADO: Redis / RQ</Badge>
      </div>
    </Scene>
  );
};

export const Scene5DeterministicGate = () => {
  const f = useCurrentFrame();
  return (
    <Scene
      index={5}
      kicker="GATE DETERMINISTA"
      title="Aceptar requiere pruebas."
      subtitle="La mejora del incidente no basta. Las cuatro condiciones son obligatorias."
      color={C.green}
    >
      <Panel
        accent={`${C.green}55`}
        style={{
          position: "absolute",
          left: 110,
          top: 345,
          width: 1050,
          padding: "34px 40px",
          ...reveal(f, 20),
        }}
      >
        {[
          "Evaluación completa · mismo dataset",
          "Mejora del caso objetivo",
          "Cero regresiones en casos que pasaban",
          "Controles de seguridad aprobados",
        ].map((t, i) => (
          <div
            key={t}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: "21px 0",
              borderBottom: i < 3 ? `1px solid ${C.border}` : "none",
              fontSize: 27,
              ...reveal(f, 45 + i * 50),
            }}
          >
            <span
              style={{
                width: 36,
                height: 36,
                background: `${C.green}16`,
                borderRadius: 10,
                color: C.green,
                display: "grid",
                placeItems: "center",
              }}
            >
              ✓
            </span>
            {t}
          </div>
        ))}
      </Panel>
      <div style={{ position: "absolute", right: 175, top: 330 }}>
        <CortexMascot state="gate-check" size={290} />
      </div>
      <div
        style={{
          position: "absolute",
          right: 110,
          top: 665,
          width: 570,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          ...reveal(f, 250),
        }}
      >
        <Badge color={C.green}>Aceptar</Badge>
        <Badge color={C.red}>Rechazar</Badge>
        <Badge color={C.gold}>Revisión humana</Badge>
        <p
          style={{
            fontSize: 25,
            color: C.muted,
            lineHeight: 1.5,
            marginTop: 15,
          }}
        >
          Evidencia incompleta exige revisión. Fallar conserva el reporte.
        </p>
      </div>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 875,
          display: "flex",
          gap: 20,
          ...reveal(f, 300),
        }}
      >
        <Badge color={C.green}>Grok: 5/6 → 6/6 · aceptado</Badge>
        <Badge color={C.red}>Groq: 5/6 → 5/6 · rechazado por regresión</Badge>
      </div>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 945,
          fontSize: 19,
          color: C.muted,
          ...reveal(f, 325),
        }}
      >
        Pruebas distintas · prompts/config de prueba · sin aplicación automática
        a producción ni código arbitrario.
      </div>
    </Scene>
  );
};

const ChannelIcon = ({ kind }: { kind: "telegram" | "slack" | "whatsapp" }) => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    {kind === "telegram" ? (
      <path d="m5 18 29-11-6 27-10-8-6 5 2-10 15-10-18 8z" fill="#26a5e4" />
    ) : kind === "whatsapp" ? (
      <>
        <path
          d="M8 30 5 36l9-3a15 15 0 1 0-6-3z"
          stroke="#25d366"
          strokeWidth="2.5"
        />
        <path
          d="m14 13 3 5-2 2c2 4 4 6 8 7l2-3 5 3c-1 6-6 6-12 2-7-4-11-12-7-16z"
          fill="#25d366"
        />
      </>
    ) : (
      <>
        {["#36c5f0", "#2eb67d", "#ecb22e", "#e01e5a"].map((c, i) => (
          <rect
            key={c}
            x="17"
            y="3"
            width="6"
            height="15"
            rx="3"
            fill={c}
            transform={`rotate(${i * 90} 20 20)`}
          />
        ))}
      </>
    )}
  </svg>
);
export const Scene6Omnichannel = () => {
  const f = useCurrentFrame();
  return (
    <Scene
      index={6}
      kicker="CANALES Y ESTADO REAL"
      title="Evidencia donde trabaja tu equipo."
      subtitle="Una integración comprobada. Dos siguientes pasos con límites explícitos."
    >
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 385,
          display: "flex",
          gap: 28,
        }}
      >
        {(
          [
            [
              "telegram",
              "Telegram",
              "VERIFICADO",
              C.cyan,
              "Usuario → Hermes → C4 → respuesta",
              "Consulta de reporte y evaluación",
              "5/6 → 6/6 · 0 regresiones",
              "Prueba registrada: 19,110 s",
            ],
            [
              "slack",
              "Slack",
              "COORDINACIÓN",
              C.pink,
              "Repositorio como fuente de verdad",
              "Hilos por tarea y revisión de equipo",
              "Bot de aprobaciones: planificado",
              "Sin endpoint de aprobación actual",
            ],
            [
              "whatsapp",
              "WhatsApp Business",
              "EN PREPARACIÓN",
              C.green,
              "Meta Cloud API · número de prueba",
              "App y credenciales pendientes",
              "Webhook firmado + acceso limitado",
              "Sin puente QR no oficial",
            ],
          ] as const
        ).map(([kind, name, status, color, ...lines], i) => (
          <Panel
            key={kind}
            style={{
              width: 545,
              height: 460,
              padding: 33,
              ...reveal(f, 25 + i * 38),
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 18,
                alignItems: "center",
                marginBottom: 26,
              }}
            >
              <ChannelIcon kind={kind} />
              <b style={{ fontSize: 29 }}>{name}</b>
            </div>
            <Badge color={color}>{status}</Badge>
            <div style={{ marginTop: 30 }}>
              {lines.map((t, j) => (
                <div
                  key={t}
                  style={{
                    fontSize: j === 0 ? 24 : 21,
                    color: j === 0 ? C.text : C.muted,
                    lineHeight: 1.45,
                    marginTop: 20,
                    ...reveal(f, 110 + i * 35 + j * 20),
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </div>
      <div
        style={{ position: "absolute", left: 125, top: 910, ...reveal(f, 320) }}
      >
        <Badge color={C.gold}>
          Las aprobaciones por mensajería pertenecen al roadmap.
        </Badge>
      </div>
    </Scene>
  );
};

export const DashboardMini = ({ compact = false }: { compact?: boolean }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        height: "100%",
        background: "#0b0e17",
        borderRadius: 18,
        overflow: "hidden",
        border: `1px solid ${C.border}`,
        color: C.text,
      }}
    >
      <div
        style={{
          height: 52,
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 12,
        }}
      >
        <Mark size={24} />
        <b style={{ fontSize: 16 }}>C4 AI</b>
        <span style={{ marginLeft: "auto", fontSize: 11, color: C.cyan }}>
          EVIDENCIA / REPLAY
        </span>
      </div>
      <div style={{ padding: compact ? 12 : 22 }}>
        <div style={{ color: C.violet, fontSize: 12, fontFamily: mono }}>
          CENTRO DE CONTROL
        </div>
        <h2
          style={{
            fontSize: compact ? 18 : 32,
            lineHeight: 1.12,
            letterSpacing: -1,
            margin: "12px 0 16px",
          }}
        >
          Menos incertidumbre.
          <br />
          Más evidencia.
        </h2>
        <div style={{ display: "flex", gap: compact ? 8 : 16 }}>
          {[
            ["Baseline", "5/6"],
            ["Candidato", "6/6"],
            ["Regresiones", "0"],
          ]
            .slice(0, compact ? 2 : 3)
            .map(([l, v]) => (
              <div
                key={l}
                style={{
                  border: `1px solid ${C.border}`,
                  background: "#121726",
                  borderRadius: 12,
                  padding: compact ? 10 : 16,
                  flex: 1,
                }}
              >
                <div style={{ fontSize: compact ? 9 : 13, color: C.muted }}>
                  {l}
                </div>
                <div
                  style={{
                    fontSize: compact ? 22 : 36,
                    color: l === "Candidato" ? C.violet : C.text,
                    marginTop: 10,
                  }}
                >
                  {v}
                </div>
              </div>
            ))}
        </div>
        <div
          style={{
            marginTop: 18,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: compact ? 12 : 18,
          }}
        >
          <div style={{ fontSize: compact ? 12 : 18 }}>
            Baseline y candidato
          </div>
          <div
            style={{
              display: "flex",
              height: compact ? 60 : 110,
              gap: compact ? 14 : 30,
              alignItems: "flex-end",
              paddingTop: 20,
            }}
          >
            {[0.65, 1, 0.8, 1, 0.78, 1].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h * 100 * Math.max(0, Math.min(1, enter(f, 60 + i * 8)))}%`,
                  borderRadius: "4px 4px 0 0",
                  background: i % 2 ? C.violet : "#455067",
                }}
              />
            ))}
          </div>
          <div
            style={{
              fontFamily: mono,
              fontSize: compact ? 9 : 13,
              color: C.muted,
              marginTop: 14,
            }}
          >
            ILUSTRACIÓN · seis casos sintéticos
          </div>
        </div>
      </div>
    </div>
  );
};
export const Scene7ResponsiveWeb = () => {
  const f = useCurrentFrame();
  return (
    <Scene
      index={7}
      kicker="ECOSISTEMA DE PRODUCTO"
      title="La misma evidencia. Más superficies."
      subtitle="Dashboard web actual · escritorio y app móvil planificados"
      status="ACTUAL + ROADMAP"
    >
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 360,
          width: 1040,
          height: 595,
          transform: `perspective(1200px) rotateY(${interpolate(f, [0, 300], [-2, 0], clamp)}deg)`,
          ...reveal(f, 18),
        }}
      >
        <DashboardMini />
      </div>
      <div
        style={{
          position: "absolute",
          right: 310,
          top: 400,
          width: 410,
          height: 535,
          transform: "rotate(3deg)",
          ...reveal(f, 65),
        }}
      >
        <DashboardMini compact />
      </div>
      <div
        style={{
          position: "absolute",
          right: 105,
          top: 505,
          width: 255,
          height: 450,
          padding: 9,
          borderRadius: 32,
          background: "#1e2534",
          border: "1px solid #485067",
          transform: "rotate(-4deg)",
          ...reveal(f, 105),
        }}
      >
        <DashboardMini compact />
      </div>
      <div
        style={{
          position: "absolute",
          left: 135,
          top: 950,
          fontSize: 16,
          color: C.muted,
          fontFamily: mono,
        }}
      >
        Mockups de producto · no son aplicaciones nativas publicadas
      </div>
    </Scene>
  );
};

export const Scene8Outro = () => {
  const f = useCurrentFrame();
  return (
    <Scene
      index={8}
      kicker="EL SIGUIENTE CAPÍTULO"
      title="Confiabilidad que se puede comprobar."
      status="ROADMAP DEL EQUIPO"
    >
      <div
        style={{ position: "absolute", left: 100, top: 350, ...reveal(f, 15) }}
      >
        <CortexMascot state="celebrate" size={410} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 615,
          top: 365,
          width: 1170,
          ...reveal(f, 30),
        }}
      >
        <div style={{ fontSize: 106, fontWeight: 600, letterSpacing: -6 }}>
          C4 AI
        </div>
        <div style={{ fontSize: 34, color: C.muted, margin: "15px 0 32px" }}>
          Menos suposiciones. Más evidencia.
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Badge color={C.green}>HOY: CLI + dashboard + Telegram</Badge>
          <Badge color={C.gold}>SIGUIENTE: website + documentación</Badge>
          <Badge color={C.gold}>DESPUÉS: desktop + React Native</Badge>
        </div>
        <Panel
          style={{
            marginTop: 37,
            padding: "23px 28px",
            fontFamily: mono,
            fontSize: 25,
          }}
        >
          uv run --locked c4 --target-provider groq tui
        </Panel>
        <div style={{ fontSize: 17, color: C.muted, marginTop: 16 }}>
          Desde el clon privado · Python 3.12 + uv · acceso del equipo
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 925,
          display: "flex",
          gap: 27,
          fontSize: 19,
          color: C.muted,
          ...reveal(f, 100),
        }}
      >
        <span>Grok × Groq</span>
        <span>FastAPI × Next.js</span>
        <span>Hermes × MCP</span>
        <span>Deimer × Santiago</span>
      </div>
    </Scene>
  );
};
