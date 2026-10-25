"use client";

import { useEffect, useRef, useState } from "react";
import { AppleIcon, BotIcon, LinuxIcon, SparklesIcon, WindowsIcon } from "@/components/icons";

interface Message {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: string;
}

const STARTER_PROMPTS = [
  {
    icon: "⚡",
    label: "¿Cómo funciona el ciclo de 5 fases?",
    query: "¿Cómo funciona el ciclo de 5 fases de C4 AI?",
  },
  {
    icon: "🛡️",
    label: "¿Cómo previene regresiones el Decision Gate?",
    query: "¿Cómo garantiza el Gate que no hay regresiones y el baseline es inmutable?",
  },
  {
    icon: "💰",
    label: "¿Cuáles son las tarifas de Grok, Groq y Ollama?",
    query: "¿Qué modelos son compatibles y cómo se calculan las tarifas de tokens?",
  },
  {
    icon: "💻",
    label: "¿Cómo lo instalo en Windows, macOS o Linux?",
    query: "¿Cómo instalo y configuro C4 AI en mi sistema operativo?",
  },
  {
    icon: "📊",
    label: "¿Cómo correr el benchmark de 1.000 unidades?",
    query: "¿Cómo funciona el benchmark de 1.000 casos y el disyuntor de circuito?",
  },
];

function getKnowledgeResponse(input: string): string {
  const query = input.toLowerCase();

  if (query.includes("ciclo") || query.includes("5 fases") || query.includes("fases") || query.includes("etapas")) {
    return `### El Ciclo Autónomo de Confiabilidad de C4 AI
C4 AI ejecuta un pipeline cerrado de **5 fases deterministas** para diagnosticar y corregir agentes de IA:

1. **Detectar**: Lee la traza de ejecución fallida del agente (\`trace_reader\`) y extrae la discrepancia contra la política corporativa.
2. **Diagnosticar**: El modelo analista (**xAI Grok-4.7**) aísla el disparador específico del error en las llamadas a herramientas.
3. **Formular**: Genera parches sintácticos y semánticos (\`patch_writer\`) en formato unificado (\`unified diff\`).
4. **Evaluar**: Ejecuta el baseline inmutable y el candidato sobre el **mismo dataset** en paralelo (\`eval_runner\`).
5. **Decidir**: El **Decision Gate** emite un veredicto formal (\`accepted\`, \`rejected\`, \`needs_human_review\`). Solo acepta si el candidato mejora el caso objetivo y presenta **cero regresiones**.`;
  }

  if (query.includes("gate") || query.includes("regresi") || query.includes("inmutable") || query.includes("merkle")) {
    return `### Decision Gate y Cadena de Custodia Criptográfica
El **Decision Gate** es el núcleo de seguridad de C4 AI y opera bajo dos reglas no negociables:

- **Baseline Inmutable**: La versión original del agente se evalúa en paralelo y jamás es sobreescrita en producción.
- **Tolerancia Cero a Regresiones**: Si el nuevo candidato resuelve el fallo pero rompe un solo caso que antes pasaba, el veredicto es automáticamente **\`REJECTED\`**.
- **Firma Merkle SHA-256**: Cada evaluación genera una prueba de integridad criptográfica:
\`\`\`text
Merkle Root = SHA256(DatasetHash : BaselineHash : CandidateHash : VerdictHash)
\`\`\`
Ningún resultado puede ser alterado en base de datos sin invalidar la firma.`;
  }

  if (query.includes("costo") || query.includes("tarifa") || query.includes("precio") || query.includes("groq") || query.includes("grok") || query.includes("ollama")) {
    return `### Catálogo Multi-Proveedor y Tarifas de Tokens
C4 AI registra el costo financiero exacto (\`cost_usd\`) de cada ejecución:

| Proveedor | Modelo | Rol | Tarifa Entrada (1M) | Tarifa Salida (1M) |
|---|---|---|---|---|
| **xAI** | \`grok-4.7\` | Analista de Diagnóstico | $2,00 USD | $10,00 USD |
| **xAI** | \`grok-beta\` | Razonamiento Rápido | $5,00 USD | $15,00 USD |
| **Groq** | \`llama-3.3-70b\` | Agente Evaluado | $0,59 USD | $0,79 USD |
| **Groq** | \`qwen-2.5-coder\` | Agente de Código | $0,59 USD | $0,79 USD |
| **Ollama** | Modelos locales | Inferencia Privada | **$0,00 USD** | **$0,00 USD** |

> **Garantía $0.00:** Para inferencia local con Ollama, el módulo \`c4.tools.rates\` garantiza costo nulo devuelto con precisión flotante.`;
  }

  if (query.includes("instala") || query.includes("windows") || query.includes("mac") || query.includes("linux") || query.includes("powershell")) {
    return `### Instalación Universal de C4 AI
Compatible de forma nativa con **Windows 11**, **macOS Sequoia** y **Linux Ubuntu**.

**En Windows (PowerShell):**
\`\`\`powershell
git clone https://github.com/DEIMER-PY/c4-ai.git
cd c4-ai
uv sync --locked
uv run c4 interactive
\`\`\`

**En Linux / macOS (Bash / Zsh):**
\`\`\`bash
git clone https://github.com/DEIMER-PY/c4-ai.git
cd c4-ai
uv sync --locked
uv run c4 interactive
\`\`\`
Para levantar el servidor backend de evidencia:
\`\`\`bash
uv run c4-api --port 8000
\`\`\``;
  }

  if (query.includes("benchmark") || query.includes("1000") || query.includes("1.000") || query.includes("batch") || query.includes("disyuntor") || query.includes("circuit")) {
    return `### Procesamiento en Lote de Alta Escala (1.000 Unidades - S4)
C4 AI cuenta con un motor masivo de resiliencia industrial:

\`\`\`bash
# Ejecutar benchmark de 1.000 unidades con 10 trabajadores
c4 batch --dataset datasets/sample/refunds_v2.json --units 1000 --concurrency 10
\`\`\`

**Mecanismos de Resiliencia:**
1. **Disyuntor de Circuito (Circuit Breaker)**: Bloquea llamadas tras 5 fallos consecutivos para evitar derroche presupuestario. Pasa a \`HALF_OPEN\` tras 2.0s de enfriamiento.
2. **Backoff Exponencial con Jitter**: Mitiga respuestas HTTP 429 de proveedores evitando picos de saturación.
3. **Métricas de Latencia**: Registra percentiles críticos (p50, p95 y p99) exportables en JSON estructurado.`;
  }

  if (query.includes("observabilidad") || query.includes("prometheus") || query.includes("metrics") || query.includes("sse") || query.includes("streaming")) {
    return `### Observabilidad y Telemetría en Tiempo Real
- **Endpoint Prometheus (\`/metrics\`)**: Exporta métricas estándar como \`c4_evaluations_total\`, \`c4_tokens_total\` y \`c4_cost_usd_total\`.
- **Endpoint Readiness (\`/healthz\`)**: Validado para Kubernetes Probes.
- **Server-Sent Events (\`/api/v1/runs/{id}/stream\`)**: Transmite eventos en caliente (fases de ejecución, evaluaciones de casos y veredictos finales) hacia el Dashboard o clientes SSE.`;
  }

  return `### Asistente Técnico C4 AI
He analizado tu consulta sobre **"${input}"**. C4 AI es el sistema de ingeniería de confiabilidad diseñado para agentes de IA autónomos.

**Aspectos clave que puedes explorar:**
- **\`El ciclo de 5 fases\`**: Cómo detectamos, diagnosticamos y corregimos trazas con Grok-4.7.
- **\`Decision Gate\`**: Por qué un candidato nunca se aplica a producción si presenta regresiones.
- **\`Modelos y Costos\`**: Tarifas de xAI Grok, Groq y cómo usar Ollama local a $0.00 USD.
- **\`Instalación en tu SO\`**: Comandos rápidos para Windows, macOS o Linux con \`uv\`.
- **\`Benchmark 1.000\`**: Ejecución masiva en lote con disyuntor de circuito.

Escribe cualquiera de estos términos o haz una pregunta específica para obtener el comando o explicación exacta.`;
}

export function C4Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-welcome",
      sender: "assistant",
      content:
        "👋 ¡Hola! Soy **C4 AI Copilot**, tu asistente de confiabilidad de agentes. Puedo guiarte en arquitectura, diagnosis con Grok-4.7, comandos de CLI o el Decision Gate. ¿En qué puedo ayudarte?",
      timestamp: "Ahora",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend ?? inputValue).trim();
    if (!text) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const responseContent = getKnowledgeResponse(text);
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        content: responseContent,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 450);
  };

  const handleClear = () => {
    setMessages([
      {
        id: "cleared-welcome",
        sender: "assistant",
        content: "Conversación reiniciada. Pregúntame lo que necesites sobre C4 AI o selecciona uno de los atajos sugeridos.",
        timestamp: "Ahora",
      },
    ]);
  };

  return (
    <>
      {/* Botón Flotante Launcher */}
      <div className="fixed bottom-5 right-5 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 rounded-full border border-violet/50 bg-[#0d1322] px-5 py-3.5 text-ink shadow-[0_0_30px_-5px_rgba(139,92,246,0.6)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-cyan hover:shadow-[0_0_40px_-5px_rgba(6,182,212,0.8)]"
            aria-label="Abrir C4 AI Copilot Chatbot"
          >
            <span className="relative flex size-3">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan opacity-75" />
              <span className="relative inline-flex size-3 rounded-full bg-cyan" />
            </span>
            <div className="flex items-center gap-2">
              <BotIcon className="size-5 text-violet group-hover:text-cyan transition-colors" />
              <span className="text-sm font-semibold tracking-tight">C4 Copilot</span>
            </div>
            <span className="hidden rounded-full bg-violet/20 px-2 py-0.5 text-[10px] font-mono font-medium text-cyan sm:inline-block">
              Grok-4.7
            </span>
          </button>
        )}
      </div>

      {/* Ventana Conversacional Claude / ChatGPT Style */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 flex h-[620px] max-h-[88vh] w-[92vw] sm:w-[460px] flex-col overflow-hidden rounded-2xl border border-rule bg-[#070b14]/95 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(139,92,246,0.25)] backdrop-blur-2xl transition-all">
          {/* Cabecera */}
          <div className="flex items-center justify-between border-b border-rule/80 bg-[#0d1322] px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="relative flex size-9 items-center justify-center rounded-xl border border-violet/40 bg-violet/10 text-cyan">
                <BotIcon className="size-5" />
                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-pass ring-2 ring-[#0d1322]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold tracking-tight text-ink">C4 AI Copilot</h3>
                  <span className="rounded bg-violet/20 px-1.5 py-0.2 text-[10px] font-mono text-cyan">v0.1.0</span>
                </div>
                <p className="text-[11px] text-ink-soft">Ingeniería de confiabilidad con xAI Grok-4.7</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                title="Reiniciar chat"
                className="rounded-lg p-1.5 text-ink-soft hover:bg-white/5 hover:text-ink transition-colors"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimizar chat"
                className="rounded-lg p-1.5 text-ink-soft hover:bg-white/5 hover:text-ink transition-colors"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Historial de Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[13px] leading-relaxed">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "assistant" && (
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-violet/30 bg-violet/10 text-cyan">
                    <SparklesIcon className="size-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.sender === "user"
                      ? "rounded-br-sm bg-violet text-white shadow-md"
                      : "rounded-tl-sm border border-rule/90 bg-[#0d1322] text-ink shadow-[0_4px_20px_-5px_rgba(0,0,0,0.5)]"
                  }`}
                >
                  <div className="whitespace-pre-wrap space-y-2">
                    {msg.content.split("\n\n").map((block, idx) => {
                      if (block.startsWith("```")) {
                        const cleanCode = block.replace(/```[a-z]*\n?/g, "").trim();
                        return (
                          <div key={idx} className="my-2 overflow-x-auto rounded-lg border border-rule/80 bg-black/60 p-3 font-mono text-[12px] text-cyan">
                            <code>{cleanCode}</code>
                          </div>
                        );
                      }
                      return <p key={idx}>{block}</p>;
                    })}
                  </div>
                  <span className={`mt-1.5 block text-[10px] ${msg.sender === "user" ? "text-violet-200" : "text-window-soft"}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-ink-soft">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-violet/30 bg-violet/10 text-cyan">
                  <SparklesIcon className="size-4 animate-spin" />
                </div>
                <div className="flex items-center gap-1 rounded-full border border-rule bg-[#0d1322] px-3 py-1.5">
                  <span className="size-1.5 rounded-full bg-cyan animate-bounce" />
                  <span className="size-1.5 rounded-full bg-cyan animate-bounce [animation-delay:0.2s]" />
                  <span className="size-1.5 rounded-full bg-cyan animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Atajos Rápidos / Chips Sugeridos */}
          {messages.length <= 2 && (
            <div className="border-t border-rule/60 bg-[#0a0f1a] px-3 py-2.5">
              <p className="mb-2 text-[11px] font-medium text-ink-soft">Preguntas rápidas sugeridas:</p>
              <div className="flex flex-wrap gap-1.5">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.label}
                    onClick={() => handleSend(prompt.query)}
                    className="flex items-center gap-1 rounded-full border border-rule bg-[#0d1322] px-2.5 py-1 text-[11px] text-ink-soft hover:border-cyan/50 hover:text-cyan transition-colors"
                  >
                    <span>{prompt.icon}</span>
                    <span>{prompt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Caja de Entrada de Texto */}
          <div className="border-t border-rule bg-[#0d1322] p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Pregunta sobre C4, fallos, parches, modelos..."
                className="flex-1 rounded-xl border border-rule bg-[#070b14] px-3.5 py-2.5 text-xs text-ink placeholder:text-ink-soft/70 focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="flex size-9 items-center justify-center rounded-xl bg-violet text-white transition-all hover:bg-violet-deep disabled:opacity-40 disabled:hover:bg-violet"
                aria-label="Enviar pregunta"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
            <div className="mt-2 flex items-center justify-between text-[10px] text-window-soft">
              <span className="flex items-center gap-1">
                <WindowsIcon className="size-2.5 text-cyan" />
                <AppleIcon className="size-2.5" />
                <LinuxIcon className="size-2.5 text-yellow-400" />
                Soporte multiplataforma verificado
              </span>
              <span>Enter para enviar</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
