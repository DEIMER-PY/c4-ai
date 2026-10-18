$ErrorActionPreference='Stop'
$audioRoot=Join-Path $PSScriptRoot '../public/launch'
New-Item -ItemType Directory -Force -Path $audioRoot | Out-Null
$voice=New-Object -ComObject SAPI.SpVoice
$spanish=@($voice.GetVoices() | Where-Object { $_.GetDescription() -match 'Helena' })
if ($spanish.Count -eq 0) { throw 'Falta voz local Helena. Usar voiceover.mp3 de ElevenLabs o instalar voz española.' }
$voice.Voice=$spanish[0]
$voice.Rate=0
$lines=@('Tu agente puede fallar.','Diagnostica y evalúa sobre las mismas pruebas.','C cuatro. Evidencia antes de aceptar.')
for ($n=0;$n -lt $lines.Count;$n++) {
 $stream=New-Object -ComObject SAPI.SpFileStream
 $stream.Format.Type=22
 $stream.Open((Join-Path $audioRoot "voice-part-$n.wav"),3,$false)
 try { $voice.AudioOutputStream=$stream; $null=$voice.Speak($lines[$n]) } finally { $stream.Close() }
}
Write-Output 'Narración local provisional generada; no es ElevenLabs.'
