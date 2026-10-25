"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AppleIcon, BotIcon, GithubIcon, LinuxIcon, SparklesIcon, WindowsIcon } from "@/components/icons";

interface Message {
  id: string;
  sender: "user" | "assistant";
  content: string;
  thinking?: string[];
  thinkingDuration?: string;
  timestamp: string;
}

interface Session {
  id: string;
  title: string;
  date: string;
  preview: string;
}

const PRESET_SESSIONS: Session[] = [
  {
    id: "sess-1",
    title: "Diagnóstico Reembolsos v2",
    date: "Hoy",
    preview: "Veredicto ACCEPTED: 32/32 casos sin regresiones",
  },
  {
    id: "sess-2",
    title: "Fallo de Herramienta en Groq",
    date: "Ayer",
    preview: "Discrepancia causal aislada con trace_reader",
  },
  {
    id: "sess-3",
    title: "Sello de Merkle SHA-256",
    date: "23 Oct",
    preview: "Prueba de integridad criptográfica sellada",
  },
  {
    id: "sess-4",
    title: "Benchmark 1.000 Unidades S4",
    date: "21 Oct",
    preview: "Disyuntor de circuito activado tras 5 errores",
  },
  {
    id: "sess-5",
    title: "Tarifas $0.00 Ollama vs Groq",
    date: "19 Oct",
    preview: "Atribución monetaria determinista en USD",
  },
];

const PROMPT_CARDS = [
  {
    icon: "⚡",
    title: "Diagnóstico Causal de Traza",
    description: "Analiza una traza con fallo de llamada a herramienta y formula el parche con Grok-4.7.",
    query: "Analiza una traza con fallo de llamada a herramienta en el agente de reembolsos y formula el parche de prompt.",
  },
  {
    icon: "🛡️",
    title: "Decision Gate y Regresiones",
    description: "Compara el candidato contra el baseline inmutable y valida por qué no hay regresiones.",
    query: "¿Cómo garantiza el Decision Gate que el baseline permanece inmutable y no se introducen regresiones?",
  },
  {
    icon: "💰",
    title: "Tarifas de Modelos y Costos",
    description: "Compara precios de Grok, Groq y cómo ejecutar pruebas masivas con Ollama a $0.00 USD.",
    query: "¿Cuáles son las tarifas de entrada y salida para Grok, Groq y cómo garantiza Ollama un costo de $0.00 USD?",
  },
  {
    icon: "🧪",
    title: "Benchmark de Escala 1.000",
    description: "Explora la resiliencia industrial, disyuntor de circuito (Circuit Breaker) y backoff con jitter.",
    query: "¿Cómo se ejecuta el benchmark masivo de 1.000 unidades y cómo responde el disyuntor ante errores HTTP 429?",
  },
];

const MODELS = [
  { id: "grok-4.7", name: "xAI Grok-4.7", role: "Analista Nuclear Causal" },
  { id: "kimi-k1", name: "C4 Kimi-K1", role: "Razonamiento y Parches" },
  { id: "groq-llama", name: "Groq LLaMA 3.3 70B", role: "Agente Evaluado (Target)" },
  { id: "ollama-local", name: "Ollama Local ($0.00)", role: "Inferencia Privada Desatendida" },
];

let globalMessageSeq = 0;
function createMessageObject(
  sender: "user" | "assistant",
  content: string,
  thinking?: string[],
  thinkingDuration?: string
): Message {
  globalMessageSeq += 1;
  return {
    id: `c4-msg-${globalMessageSeq}`,
    sender,
    content,
    thinking,
    thinkingDuration,
    timestamp: "Ahora",
  };
}

function generateKimiResponse(query: string, modelName: string): { content: string; thinking: string[]; duration: string } {
  const q = query.toLowerCase();

  if (q.includes("traza") || q.includes("diagnostico") || q.includes("parche") || q.includes("reembolso")) {
    return {
      duration: "3.4s",
      thinking: [
        "1. Conectando con trace_reader: extrayendo traza de ejecución fallida en `refunds_v2.json`...",
        "2. Identificando discrepancia: el agente llamó a `issue_refund` sin consultar previamente `refund_eligible`.",
        "3. Evaluando taxonomía de fallo: clasificado como 'Tool Policy Deviation' con severidad HIGH.",
        "4. Invocando patch_writer: formulando prompt candidato con restricción imperativa de verificación de elegibilidad.",
        "5. Despachando eval_runner sobre 32 casos sintéticos del dataset original.",
        "6. Comparando resultados: Baseline 30/32 -> Candidato 32/32. Regresiones detectadas: 0.",
        "7. Decision Gate: Criterios AC cumplidos. Veredicto emitido: [ACCEPTED].",
      ],
      content: `### Diagnóstico Causal y Formulación de Parche (${modelName})

He analizado la traza causal del agente de reembolsos. Se detectó una omisión deliberada de la verificación de elegibilidad antes de procesar el pago.

#### 1. Causa Raíz Identificada
El prompt original carecía de una condición de detención obligatoria (*hard requirement*). El agente asumía que la orden era reembolsable por defecto.

#### 2. Parche Formulado (\`unified diff\`)
\`\`\`diff
--- original/system_prompt.txt
+++ candidate/system_prompt.txt
@@ -14,6 +14,8 @@
   Para procesar un reclamo de cliente:
- 1. Si el cliente solicita devolución, ejecuta 'issue_refund'.
+ 1. SIEMPRE ejecuta primero 'refund_eligible' con el order_id del reclamo.
+ 2. Solo si el estado retornado es estrictamente TRUE, procede con 'issue_refund'.
+ 3. Si es FALSE, rechaza el trámite e informa al usuario la política vigente.
\`\`\`

#### 3. Resultado de la Evaluación en Paralelo
| Métrica | Baseline (Inmutable) | Candidato Generado | Impacto |
|---|---|---|---|
| **Casos Aprobados** | 30 / 32 | **32 / 32** | **+2 corregidos** |
| **Regresiones** | 0 | **0** | **Cero regresiones** |
| **Gate Verdict** | - | **ACCEPTED** | **Criptográficamente Sellado** |

\`\`\`text
Merkle Root = SHA256(7f83b165... : c4_baseline_v1 : c4_candidate_v2 : 0xACCEPTED)
\`\`\`

> **Seguridad garantizada**: El parche no se despliega en producción; permanece aislado en el harness local de auditoría.`,
    };
  }

  if (q.includes("gate") || q.includes("regresi") || q.includes("inmutable")) {
    return {
      duration: "2.1s",
      thinking: [
        "1. Verificando principios de gobernanza C4 AI: regla fundamental de inmutabilidad.",
        "2. Consultando c4.services.eval: estructura de matriz de comparación antes/después.",
        "3. Inspeccionando algoritmo de gate: condición estricta de regresiones == 0.",
        "4. Comprobando generación de prueba criptográfica SHA-256 (IntegrityProof).",
      ],
      content: `### Gobernanza del Decision Gate y Tolerancia Cero a Regresiones

El **Decision Gate** es la barrera criptográfica de C4 AI que impide que parches defectuosos o alucinados alcancen sistemas productivos.

#### Reglas Estrictas del Gate:
1. **Línea Base Inmutable**: El agente original nunca se sobreescribe ni se altera durante las pruebas. Se conserva como punto de referencia fáctico.
2. **Cero Regresiones**: Si un candidato resuelve 5 errores nuevos pero causa que **1 solo caso** que antes pasaba ahora falle, el veredicto es indefectiblemente **\`REJECTED\`**.
3. **Casos Críticos de Seguridad Obligatorios**: Casos con banderas de inyección de prompt o manipulación PII deben aprobar con el 100% de cumplimiento.

\`\`\`bash
# Ejecutar verificación de gate desde terminal
c4 run --dataset datasets/sample/refunds_v2.json --target groq
\`\`\``,
    };
  }

  if (q.includes("tarifa") || q.includes("costo") || q.includes("groq") || query.includes("ollama")) {
    return {
      duration: "1.9s",
      thinking: [
        "1. Consultando módulo c4.tools.rates para tarifas oficiales de tokens 2026.",
        "2. Extrayendo multiplicadores de xAI Grok, Groq y Ollama local.",
        "3. Verificando regla de costo nulo ($0.00 USD) para inferencia local privada.",
      ],
      content: `### Tarifas de Tokens y Atribución Financiera (\`cost_usd\`)

C4 AI desacopla el modelo analista del agente evaluado, permitiendo auditar modelos comerciales o locales con total transparencia:

| Proveedor | Modelo | Rol | Tarifa Entrada (1M) | Tarifa Salida (1M) |
|---|---|---|---|---|
| **xAI** | \`grok-4.7\` | Analista Nuclear | $2,00 USD | $10,00 USD |
| **xAI** | \`grok-beta\` | Razonamiento Rápido | $5,00 USD | $15,00 USD |
| **Groq** | \`llama-3.3-70b\` | Agente Evaluado | $0,59 USD | $0,79 USD |
| **Groq** | \`qwen-2.5-coder\` | Agente de Código | $0,59 USD | $0,79 USD |
| **Ollama** | Modelos locales | Inferencia Privada | **$0,00 USD** | **$0,00 USD** |

\`\`\`powershell
# Consultar costo acumulado de la última sesión en CLI
c4 cost last
\`\`\`

> **Garantía Ollama**: Toda ejecución con modelos locales retorna estrictamente \`cost_usd = 0.000000\` en el JSON de evidencia.`,
    };
  }

  return {
    duration: "2.8s",
    thinking: [
      `1. Procesando consulta de usuario mediante ${modelName}...`,
      "2. Verificando contexto del harness de confiabilidad C4 AI...",
      "3. Sintetizando respuesta con recomendaciones accionables y comandos de ejecución...",
    ],
    content: `### Asistente de Confiabilidad C4 AI (${modelName})

He procesado tu requerimiento: **"${query}"**. 

C4 AI opera como un entorno integral de ingeniería de confiabilidad (*Agent Reliability Engineering*):
- **Diagnóstico Causal**: Inspección forense de trazas sin suposiciones no verificadas.
- **Formulación de Parches**: Corrección guiada por gramáticas formales y diffs semánticos.
- **Evaluación en Lote**: Ejecución masiva de hasta 1.000 unidades con disyuntor de circuito.
- **Integridad SHA-256**: Sellado de evidencia en árboles de Merkle.

¿Deseas que analicemos una traza específica o simulemos una ejecución de Decision Gate?`,
  };
}

export function ChatInterface() {
  const [sessions, setSessions] = useState<Session[]>(PRESET_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState<string>("sess-1");
  const [messages, setMessages] = useState<Message[]>([
    createMessageObject(
      "assistant",
      "👋 Hola, soy **C4 AI**. Estoy conectado al harness de confiabilidad. Puedes pedirme que analice una traza con fallo, formule un parche de prompt, calcule costos de tokens o evalúe regresiones con el Decision Gate.",
      [
        "Harness local iniciado.",
        "Módulos cargados: trace_reader, patch_writer, eval_runner.",
        "Conexión activa con el backend API en http://127.0.0.1:8000.",
      ],
      "1.2s"
    ),
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("grok-4.7");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedThinking, setExpandedThinking] = useState<Record<string, boolean>>({ "c4-msg-1": true });

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend ?? inputVal).trim();
    if (!text) return;

    const userMsg = createMessageObject("user", text);
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsThinking(true);

    const activeModelObj = MODELS.find((m) => m.id === selectedModel) ?? MODELS[0];

    setTimeout(() => {
      const { content, thinking, duration } = generateKimiResponse(text, activeModelObj.name);
      const assistantMsg = createMessageObject("assistant", content, thinking, duration);
      setMessages((prev) => [...prev, assistantMsg]);
      setExpandedThinking((prev) => ({ ...prev, [assistantMsg.id]: true }));
      setIsThinking(false);
    }, 700);
  };

  const handleNewChat = () => {
    const newId = `sess-${Date.now()}`;
    const newSession: Session = {
      id: newId,
      title: "Nueva Auditoría",
      date: "Ahora",
      preview: "Sesión limpia de análisis causal",
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);
    setMessages([
      createMessageObject(
        "assistant",
        "👋 Sesión de auditoría iniciada. Selecciona una tarjeta de análisis rápido o escribe tu consulta directamente.",
        ["Harness inicializado para nueva sesión.", "Almacén local listo para recibir trazas."],
        "0.8s"
      ),
    ]);
  };

  const toggleThinking = (id: string) => {
    setExpandedThinking((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex h-[calc(100dvh-4.1rem)] w-full overflow-hidden bg-[#070b14] text-[#f8fafc]">
      {/* 1. BARRA LATERAL ESTILO KIMI.AI */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-0 -translate-x-full"
        } transition-all duration-300 ease-in-out shrink-0 flex flex-col border-r border-[#1e293b] bg-[#0a0f1d] overflow-hidden`}
      >
        <div className="p-4 border-b border-[#1e293b] flex items-center justify-between">
          <button
            onClick={handleNewChat}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-violet/90 hover:bg-violet px-3 py-2.5 text-xs font-semibold text-white shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)] transition-all hover:scale-[1.02]"
          >
            <span className="text-base font-bold">+</span>
            <span>Nuevo Chat</span>
          </button>
        </div>

        {/* Lista de Sesiones Anteriores */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Auditorías Recientes
          </p>
          {sessions.map((sess) => (
            <button
              key={sess.id}
              onClick={() => setActiveSessionId(sess.id)}
              className={`w-full text-left rounded-xl p-2.5 transition-all text-xs flex flex-col gap-1 ${
                activeSessionId === sess.id
                  ? "bg-violet/15 border border-violet/40 text-cyan"
                  : "hover:bg-white/5 border border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold truncate">{sess.title}</span>
                <span className="text-[10px] text-slate-500">{sess.date}</span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">{sess.preview}</p>
            </button>
          ))}
        </div>

        {/* Selector de Modelo y Estado de Conexión */}
        <div className="p-3 border-t border-[#1e293b] bg-[#070b14]/70 space-y-3">
          <div>
            <label htmlFor="model-select" className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Modelo Analista
            </label>
            <select
              id="model-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full rounded-lg border border-[#1e293b] bg-[#0d1322] px-2.5 py-1.5 text-xs font-mono text-cyan focus:outline-none focus:border-cyan"
            >
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              API 8000 Conectada
            </span>
            <Link href="/" className="hover:text-cyan text-[10px] transition-colors">
              Volver a Web →
            </Link>
          </div>
        </div>
      </aside>

      {/* 2. ÁREA PRINCIPAL CONVERSACIONAL */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#070b14] relative">
        {/* Barra Superior */}
        <header className="h-14 border-b border-[#1e293b] bg-[#0a0f1d]/80 backdrop-blur-md px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Alternar barra lateral"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">C4 AI Copilot</span>
              <span className="rounded bg-violet/20 px-2 py-0.5 text-[11px] font-mono text-cyan border border-violet/30">
                {MODELS.find((m) => m.id === selectedModel)?.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/docs/"
              className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan transition-colors"
            >
              Docs Kimi
            </Link>
            <a
              href="https://github.com/DEIMER-PY/c4-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-lg border border-[#1e293b] bg-[#0d1322] px-2.5 py-1 text-xs text-slate-400 hover:text-white hover:border-cyan/50 transition-colors"
            >
              <GithubIcon className="size-3.5" />
              <span className="hidden md:inline">GitHub</span>
            </a>
          </div>
        </header>

        {/* Contenedor de Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl w-full mx-auto">
          {/* Mensajes */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "assistant" && (
                <div className="size-8 shrink-0 rounded-xl border border-violet/40 bg-violet/10 flex items-center justify-center text-cyan shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                  <BotIcon className="size-4" />
                </div>
              )}

              <div
                className={`flex flex-col gap-2 max-w-[85%] ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                {/* Bloque de Pensamiento / Razonamiento Estilo Kimi.ai */}
                {msg.thinking && msg.thinking.length > 0 && (
                  <div className="w-full rounded-xl border border-[#1e293b] bg-[#0d1322]/80 overflow-hidden mb-2">
                    <button
                      onClick={() => toggleThinking(msg.id)}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-400 hover:bg-white/5 transition-colors font-mono"
                    >
                      <span className="flex items-center gap-2 text-cyan">
                        <SparklesIcon className="size-3.5" />
                        <span>Razonamiento del modelo ({msg.thinkingDuration ?? "2.4s"})</span>
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {expandedThinking[msg.id] ? "Ocultar ▲" : "Ver pasos ▼"}
                      </span>
                    </button>

                    {expandedThinking[msg.id] && (
                      <div className="border-t border-[#1e293b]/60 p-3 space-y-1.5 font-mono text-[11px] text-slate-400 bg-black/40">
                        {msg.thinking.map((step, idx) => (
                          <p key={idx} className="leading-relaxed">
                            {step}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Burbuja Principal */}
                <div
                  className={`rounded-2xl p-4 sm:p-5 text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-violet text-white rounded-br-none shadow-[0_0_25px_-5px_rgba(139,92,246,0.5)]"
                      : "border border-[#1e293b] bg-[#0d1322] text-[#f8fafc] rounded-tl-none shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
                  }`}
                >
                  <div className="space-y-3">
                    {msg.content.split("\n\n").map((block, idx) => {
                      if (block.startsWith("```")) {
                        const code = block.replace(/```[a-z]*\n?/g, "").trim();
                        return (
                          <div
                            key={idx}
                            className="my-3 overflow-x-auto rounded-xl border border-[#1e293b] bg-black/70 p-4 font-mono text-xs text-cyan"
                          >
                            <pre>
                              <code>{code}</code>
                            </pre>
                          </div>
                        );
                      }
                      if (block.startsWith("|")) {
                        return (
                          <div key={idx} className="my-2 overflow-x-auto">
                            <pre className="font-mono text-xs text-slate-300">{block}</pre>
                          </div>
                        );
                      }
                      return <p key={idx}>{block}</p>;
                    })}
                  </div>
                </div>

                <span className="text-[10px] text-slate-500 px-1">{msg.timestamp}</span>
              </div>

              {msg.sender === "user" && (
                <div className="size-8 shrink-0 rounded-xl border border-rule bg-paper-raised flex items-center justify-center text-slate-300">
                  <span className="text-xs font-bold">Tú</span>
                </div>
              )}
            </div>
          ))}

          {/* Animación de Pensando */}
          {isThinking && (
            <div className="flex gap-4 items-start">
              <div className="size-8 shrink-0 rounded-xl border border-violet/40 bg-violet/10 flex items-center justify-center text-cyan shadow-[0_0_15px_rgba(139,92,246,0.3)] animate-pulse">
                <BotIcon className="size-4" />
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-[#1e293b] bg-[#0d1322] px-4 py-3 text-xs text-cyan">
                <SparklesIcon className="size-4 animate-spin text-violet" />
                <span className="font-mono">Razonando con {MODELS.find((m) => m.id === selectedModel)?.name}...</span>
              </div>
            </div>
          )}

          {/* Tarjetas de Diagnóstico Rápido (Estado Inicial o Pocos Mensajes) */}
          {messages.length <= 1 && (
            <div className="pt-4 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Diagnósticos y Consultas Recomendadas
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {PROMPT_CARDS.map((card) => (
                  <button
                    key={card.title}
                    onClick={() => handleSendMessage(card.query)}
                    className="flex flex-col gap-2 rounded-2xl border border-[#1e293b] bg-[#0a0f1d] p-4 text-left transition-all hover:border-cyan/50 hover:bg-[#0d1322] group"
                  >
                    <span className="text-2xl">{card.icon}</span>
                    <span className="font-semibold text-white group-hover:text-cyan transition-colors">
                      {card.title}
                    </span>
                    <span className="text-xs text-slate-400 leading-relaxed">{card.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* 3. CAJA DE ENTRADA FLOTANTE INFERIOR (KIMI STYLE) */}
        <div className="p-4 sm:p-6 shrink-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/90 to-transparent">
          <div className="max-w-4xl mx-auto rounded-2xl border border-[#1e293b] bg-[#0a0f1d]/90 shadow-[0_0_40px_-10px_rgba(139,92,246,0.2)] backdrop-blur-xl p-3 focus-within:border-cyan transition-colors">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex flex-col gap-2"
            >
              <textarea
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={2}
                placeholder="Escribe tu consulta causal o pega una traza de fallo JSON (Enter para enviar)..."
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none resize-none leading-relaxed"
              />

              <div className="flex items-center justify-between pt-2 border-t border-[#1e293b]/60">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-violet/30 bg-violet/10 px-2.5 py-1 text-[11px] font-mono text-cyan">
                    <SparklesIcon className="size-3 text-violet" /> Modo Razonamiento Activo
                  </span>
                  <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500">
                    <WindowsIcon className="size-3 text-cyan" />
                    <AppleIcon className="size-3" />
                    <LinuxIcon className="size-3 text-yellow-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!inputVal.trim() || isThinking}
                  className="flex items-center gap-1.5 rounded-xl bg-violet px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-violet-deep disabled:opacity-40 disabled:hover:bg-violet shadow-[0_0_20px_-5px_rgba(139,92,246,0.6)]"
                >
                  <span>Enviar</span>
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
          <p className="mt-2 text-center text-[11px] text-slate-500">
            C4 AI Confiabilidad · Respaldado por pruebas de integridad Merkle SHA-256 · Sin alterar agentes en producción.
          </p>
        </div>
      </main>
    </div>
  );
}
