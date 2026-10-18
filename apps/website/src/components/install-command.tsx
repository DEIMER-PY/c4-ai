import { CopyButton } from "@/components/copy-button";
import { Tabs } from "@/components/tabs";
import { INSTALL_COMMANDS } from "@/content/install";

function CommandBlock({ command }: { command: string }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl border border-rule bg-paper-raised py-3 pr-3 pl-5 text-left shadow-[0_1px_0_rgba(29,27,38,0.04)]">
      <pre className="overflow-x-auto py-1 font-mono text-[13px] leading-6 text-ink">
        <code>
          {command.split("\n").map((line) => (
            <span key={line} className="block">
              <span aria-hidden className="mr-3 text-ink-soft select-none">
                $
              </span>
              {line}
            </span>
          ))}
        </code>
      </pre>
      <CopyButton
        text={command}
        className="shrink-0 rounded-full border border-rule px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink"
      />
    </div>
  );
}

export function InstallCommand() {
  return (
    <div className="mx-auto w-full max-w-xl">
      <Tabs
        label="Sistema operativo"
        variant="underline"
        items={[
          { id: "powershell", label: "Windows (PowerShell)", content: <CommandBlock command={INSTALL_COMMANDS.powershell} /> },
          { id: "unix", label: "Linux y macOS", content: <CommandBlock command={INSTALL_COMMANDS.unix} /> },
        ]}
      />
      <p className="mt-3 text-left text-[13px] text-ink-soft">
        Requiere Python 3.12, uv y acceso al repositorio, que es privado durante el reto.
      </p>
    </div>
  );
}
