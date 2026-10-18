"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

/**
 * Pestañas accesibles (patrón WAI-ARIA tabs): flechas, Inicio y Fin mueven el foco y activan la pestaña.
 * Sin JavaScript se ve la primera, porque el HTML inicial ya la renderiza.
 */
export function Tabs({
  items,
  label,
  variant = "pill",
  panelClassName,
}: {
  items: TabItem[];
  label: string;
  variant?: "pill" | "underline";
  panelClassName?: string;
}) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function focusTab(index: number) {
    const next = (index + items.length) % items.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const keys: Record<string, () => void> = {
      ArrowRight: () => focusTab(active + 1),
      ArrowLeft: () => focusTab(active - 1),
      Home: () => focusTab(0),
      End: () => focusTab(items.length - 1),
    };
    const action = keys[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  }

  const tabClass =
    variant === "pill"
      ? "rounded-full px-4 py-1.5 text-sm font-medium transition-colors aria-selected:bg-ink aria-selected:text-paper text-ink-soft hover:text-ink"
      : "border-b-2 border-transparent px-1 pb-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink aria-selected:border-ink aria-selected:text-ink";

  return (
    <div className="flex flex-col gap-4">
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className={variant === "pill" ? "mx-auto flex w-fit gap-1 rounded-full border border-rule bg-paper-raised p-1" : "flex gap-5"}
      >
        {items.map((item, index) => (
          <button
            key={item.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${item.id}`}
            aria-selected={index === active}
            aria-controls={`${baseId}-panel-${item.id}`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
            className={tabClass}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item, index) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${baseId}-panel-${item.id}`}
          aria-labelledby={`${baseId}-tab-${item.id}`}
          hidden={index !== active}
          tabIndex={0}
          className={panelClassName}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
