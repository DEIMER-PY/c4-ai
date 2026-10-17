$ErrorActionPreference = 'Stop'
$narrationRoot = $PSScriptRoot
$texts = Get-Content -LiteralPath (Join-Path $narrationRoot 'narration.json') -Raw -Encoding utf8 | ConvertFrom-Json
$speaker = New-Object -ComObject SAPI.SpVoice
$spanish = @($speaker.GetVoices() | Where-Object { $_.GetDescription() -match 'Helena' })
if ($spanish.Count -eq 0) { throw 'Instala la voz local española Helena o proporciona WAV por escena.' }
$speaker.Voice = $spanish[0]
$speaker.Rate = 3
for ($index=0; $index -lt $texts.Count; $index++) {
    $stream = New-Object -ComObject SAPI.SpFileStream
    $stream.Format.Type = 22
    $audioPath = Join-Path $narrationRoot "public/narration-$($index+1).wav"
    $stream.Open($audioPath, 3, $false)
    $speaker.AudioOutputStream = $stream
    $null = $speaker.Speak($texts[$index])
    $stream.Close()
}
Write-Output 'Siete pistas españolas locales generadas; comprobar duración antes de renderizar.'
