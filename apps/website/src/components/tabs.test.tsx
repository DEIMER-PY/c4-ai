import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { Tabs } from "@/components/tabs";

const items = [
  { id: "a", label: "Terminal", content: <p>panel terminal</p> },
  { id: "b", label: "Dashboard", content: <p>panel dashboard</p> },
  { id: "c", label: "Hermes", content: <p>panel hermes</p> },
];

afterEach(cleanup);

describe("Tabs", () => {
  it("muestra la primera pestaña y oculta las demás", () => {
    render(<Tabs label="Vista" items={items} />);
    expect(screen.getByRole("tab", { name: "Terminal" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("panel terminal")).toBeVisible();
    expect(screen.getByText("panel dashboard")).not.toBeVisible();
  });

  it("cambia de panel con clic", async () => {
    render(<Tabs label="Vista" items={items} />);
    await userEvent.click(screen.getByRole("tab", { name: "Hermes" }));
    expect(screen.getByText("panel hermes")).toBeVisible();
    expect(screen.getByText("panel terminal")).not.toBeVisible();
  });

  it("navega con flechas, Inicio y Fin y mueve el foco", async () => {
    render(<Tabs label="Vista" items={items} />);
    screen.getByRole("tab", { name: "Terminal" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Dashboard" })).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "Hermes" })).toHaveFocus();
    await userEvent.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "Terminal" })).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{End}");
    expect(screen.getByText("panel hermes")).toBeVisible();
  });

  it("solo la pestaña activa entra en el orden de tabulación", () => {
    render(<Tabs label="Vista" items={items} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs.map((t) => t.getAttribute("tabindex"))).toEqual(["0", "-1", "-1"]);
  });
});
