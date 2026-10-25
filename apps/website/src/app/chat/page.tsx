import type { Metadata } from "next";
import { ChatInterface } from "@/components/chat-interface";

export const metadata: Metadata = {
  title: "Chat C4 AI — Asistente de Confiabilidad Kimi-Style",
  description:
    "Entorno conversacional autónomo para diagnosticar fallos de agentes de IA, formular parches de prompt y auditar regresiones.",
};

export default function ChatPage() {
  return <ChatInterface />;
}
