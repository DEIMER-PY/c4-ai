param([switch]$Studio)
$ErrorActionPreference = 'Stop'
Push-Location $PSScriptRoot
try {
    if (-not (Test-Path 'node_modules/@remotion/cli/remotion-cli.js')) { throw 'Ejecuta npm ci en my-video antes de continuar.' }
    # Voz local de Windows: no se envía texto a servicios externos.
    $texts = Get-Content -LiteralPath 'narration.json' -Raw -Encoding utf8 | ConvertFrom-Json
    $speaker = New-Object -ComObject SAPI.SpVoice
    $spanish = @($speaker.GetVoices() | Where-Object { $_.GetDescription() -match 'Helena' })
    if ($spanish.Count -eq 0) { throw 'Instala Helena (español) en Windows para generar la narración.' }
    $speaker.Voice = $spanish[0]
    $speaker.Rate = 3
    for ($index=0; $index -lt $texts.Count; $index++) {
        $stream = New-Object -ComObject SAPI.SpFileStream
        $stream.Format.Type = 22
        $stream.Open((Join-Path $PSScriptRoot "public/c4/narration-$($index+1).wav"), 3, $false)
        try { $speaker.AudioOutputStream = $stream; $null = $speaker.Speak($texts[$index]) } finally { $stream.Close() }
    }
    & node node_modules/typescript/bin/tsc --noEmit
    if ($LASTEXITCODE -ne 0) { throw 'TypeScript no pasó; exportación detenida.' }
    if ($Studio) {
        & node node_modules/@remotion/cli/remotion-cli.js studio src/index.ts --port=3334
    } else {
        $browser = Join-Path $env:LOCALAPPDATA 'ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe'
        if (-not (Test-Path -LiteralPath $browser)) { throw 'Chromium local no encontrado. Configura su ruta antes de exportar.' }
        & node node_modules/@remotion/cli/remotion-cli.js render src/index.ts C4S1Delivery ../artifacts/c4-ai-s1-entrega.mp4 --browser-executable="$browser" --codec=h264 --concurrency=2
    }
    if ($LASTEXITCODE -ne 0) { throw 'Remotion terminó con error; no se confirma exportación.' }
} finally { Pop-Location }
