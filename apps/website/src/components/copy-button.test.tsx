import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CopyButton } from "@/components/copy-button";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("CopyButton", () => {
  it("copia el texto exacto y lo anuncia", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    render(<CopyButton text={"git clone x\ncd c4-ai"} />);
    await user.click(screen.getByRole("button", { name: "Copiar" }));
    expect(writeText).toHaveBeenCalledWith("git clone x\ncd c4-ai");
    expect(await screen.findByRole("button", { name: "Copiado" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Comando copiado al portapapeles");
  });

  it("si el navegador bloquea el portapapeles, pide copiar a mano", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("denied"));
    render(<CopyButton text="uv sync" />);
    await user.click(screen.getByRole("button", { name: "Copiar" }));
    expect(await screen.findByRole("button", { name: "Cópialo a mano" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("No se pudo copiar");
  });
});
