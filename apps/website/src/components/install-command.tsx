import { CopyButton } from "@/components/copy-button";
import { AppleIcon, LinuxIcon, WindowsIcon } from "@/components/icons";
import { Tabs } from "@/components/tabs";
import { INSTALL_COMMANDS } from "@/content/install";

function CommandBlock({ command }: { command: string }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl border border-rule bg-paper-raised/80 py-3 pr-3 pl-5 text-left shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] backdrop-blur-sm">
      <pre className="overflow-x-auto py-1 font-mono text-[13px] leading-6 text-ink">
        <code>
          {command.split("\n").map((line) => (
            <span key={line} className="block">
              <span aria-hidden className="mr-3 text-cyan select-none">
                $
              </span>
              {line}
            </span>
          ))}
        </code>
      </pre>
      <CopyButton
        text={command}
        className="shrink-0 rounded-full border border-rule/80 bg-paper px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-cyan hover:text-cyan"
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
          {
            id: "powershell",
            label: "Windows (PowerShell)",
            content: <CommandBlock command={INSTALL_COMMANDS.powershell} />,
          },
          {
            id: "unix",
            label: "Linux y macOS",
            content: <CommandBlock command={INSTALL_COMMANDS.unix} />,
          },
        ]}
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[12px] text-ink-soft">
        <span className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-ink">
            <WindowsIcon className="size-3.5 text-cyan" />
            <AppleIcon className="size-3.5" />
            <LinuxIcon className="size-3.5 text-yellow-400" />
          </span>
          Universal: Windows, macOS y Linux
        </span>
        <span className="font-mono text-cyan text-[11px] rounded bg-cyan/10 px-2 py-0.5 border border-cyan/20">
          Python 3.12 + uv
        </span>
      </div>
    </div>
  );
}
