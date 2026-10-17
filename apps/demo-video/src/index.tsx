import React from 'react';
import {AbsoluteFill, Audio, Composition, Img, Sequence, interpolate, registerRoot, staticFile, useCurrentFrame} from 'remotion';

const scenes = [
  {start:0, end:14, title:'Confiabilidad para agentes', label:'C4 AI · S1', text:'Detectar → diagnosticar → corregir → evaluar → decidir', image:'dashboard-desktop.png', detail:'Montaje de ejecuciones guardadas · 17 oct 2026'},
  {start:14, end:30, title:'Un ciclo, evidencia completa', label:'ARQUITECTURA', text:'Grok analiza y propone. El gate decide con pruebas.', image:'cli-chat-preview.png', detail:'CLI → servicio compartido → checkpoints → API → dashboard'},
  {start:30, end:48, title:'Conversación y comandos', label:'CLI / TUI', text:'Streaming · contexto de evidencia · consumo visible', image:'cli-chat-preview.png', detail:'Groq: TTFT 625 ms, total 906 ms · una muestra, no garantía'},
  {start:48, end:66, title:'La evidencia llega al dashboard', label:'API LOCAL', text:'Incidentes, reportes y comparación real', image:'dashboard-desktop.png', detail:'Sin fallback silencioso a mocks · costo desconocido visible'},
  {start:66, end:85, title:'Mejora aceptada', label:'GROK → GROK', text:'5/6 → 6/6 · cero regresiones', image:'evaluation-accepted.png', detail:'14 llamadas · 20.720 tokens reportados · costo USD desconocido'},
  {start:85, end:103, title:'Una regresión bloquea el candidato', label:'GROK ANALIZA / GROQ EJECUTA', text:'5/6 → 5/6 · refund_eligible regresó', image:'evaluation-rejected.png', detail:'Decisión: rejected · completar el ciclo no implica aceptación'},
  {start:103, end:120, title:'Herramientas, alcance y próximos pasos', label:'HERMES + MCP', text:'4 consultas de evidencia · versiones de prueba', image:'dashboard-tablet.png', detail:'6 casos sintéticos · repo privado · publicación y escala pendientes'},
];

const Scene: React.FC<{scene:typeof scenes[number]}> = ({scene}) => {
  const f=useCurrentFrame();
  const opacity=interpolate(f,[0,12],[0,1],{extrapolateRight:'clamp'});
  return <AbsoluteFill style={{padding:'42px 54px', background:'radial-gradient(ellipse at 90% 0%,#39245d 0%,#13121d 55%)',color:'#f5f3ff',fontFamily:'Segoe UI, Arial',opacity}}>
    <div style={{fontSize:16,letterSpacing:3,color:'#b99af7',fontWeight:700}}>{scene.label}</div>
    <div style={{fontSize:39,fontWeight:750,marginTop:10}}>{scene.title}</div>
    <div style={{fontSize:22,color:'#74d6e2',marginTop:9}}>{scene.text}</div>
    <div style={{marginTop:24,height:410,background:'#100f19',border:'1px solid #514067',borderRadius:18,overflow:'hidden',display:'flex',justifyContent:'center'}}>
      <Img src={staticFile(scene.image)} style={{width:'100%',height:'100%',objectFit:'contain'}}/>
    </div>
    <div style={{fontSize:18,color:'#d1c6e3',marginTop:18}}>{scene.detail}</div>
    <div style={{position:'absolute',bottom:18,right:54,fontSize:13,color:'#b7acc9'}}>C4 AI · Deimer & Santiago · evidencia de pruebas sintéticas</div>
  </AbsoluteFill>;
};

const Demo=()=> <AbsoluteFill>{scenes.map((scene,index)=><Sequence key={scene.start} from={scene.start*24} durationInFrames={(scene.end-scene.start)*24}>
  <Scene scene={scene}/><Audio src={staticFile(`narration-${index+1}.wav`)}/>
</Sequence>)}</AbsoluteFill>;
registerRoot(()=> <Composition id="S1" component={Demo} durationInFrames={2880} fps={24} width={1280} height={720}/>);
