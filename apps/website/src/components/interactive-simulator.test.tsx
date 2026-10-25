import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { InteractiveSimulator } from "@/components/interactive-simulator";

afterEach(cleanup);

describe("InteractiveSimulator", () => {
  it("renderiza el simulador y muestra la fase inicial de evaluación", () => {
    render(<InteractiveSimulator />);
    expect(screen.getByText("Simulador Interactivo de Confiabilidad")).toBeInTheDocument();
    expect(screen.getByText(/EVALUACIÓN EN HARNESS PARALELO/i)).toBeInTheDocument();
    expect(screen.getByText(/Veredicto: accepted/i)).toBeInTheDocument();
  });

  it("permite cambiar de fase mediante los botones del pipeline", async () => {
    render(<InteractiveSimulator />);
    
    // Clic en Detección
    await userEvent.click(screen.getByRole("button", { name: /Detección/i }));
    expect(screen.getByText(/INCIDENTE DETECTADO/i)).toBeInTheDocument();

    // Clic en Diagnóstico
    await userEvent.click(screen.getByRole("button", { name: /Diagnóstico/i }));
    expect(screen.getByText(/DIAGNÓSTICO CAUSAL \(GROK 4.7\)/i)).toBeInTheDocument();

    // Clic en Parche y Diff
    await userEvent.click(screen.getByRole("button", { name: /Parche y Diff/i }));
    expect(screen.getByText(/PARCHE Y DIFF DECLARATIVO/i)).toBeInTheDocument();

    // Clic en Sellado Cripto
    await userEvent.click(screen.getByRole("button", { name: /Sellado Cripto/i }));
    expect(screen.getByText(/CADENA DE CUSTODIA Y SELLO CRIPTOGRÁFICO/i)).toBeInTheDocument();
    expect(screen.getByText(/merkle_root:/i)).toBeInTheDocument();
  });

  it("actualiza el contenido al cambiar de incidente", async () => {
    render(<InteractiveSimulator />);
    const select = screen.getByLabelText(/Incidente:/i);
    await userEvent.selectOptions(select, "prompt_injection");

    expect(screen.getByText("Inyección de Prompt (OWASP LLM-01)")).toBeInTheDocument();
  });
});
