import {CanvasImage, Interactive, Track, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';

const colors={ink:'#080b14',panel:'#121728',line:'#30364b',violet:'#ae87ff',cyan:'#5ee3e8',rose:'#ff789b',muted:'#9ca7be'};

export const Mark=({size=70}:{size?:number})=><svg width={size} height={size} viewBox="0 0 100 100" aria-label="C4 AI">
 <defs><linearGradient id="c4mark" x1="0" y1="1" x2="1" y2="0"><stop stopColor="#dc44c0"/><stop offset=".5" stopColor="#975bff"/><stop offset="1" stopColor="#55e8ee"/></linearGradient></defs>
 <rect x="3" y="3" width="94" height="94" rx="27" fill="#121728" stroke="url(#c4mark)" strokeWidth="3"/>
 <path d="M58 27a27 27 0 1 0 0 46M69 36l15 14-15 14" fill="none" stroke="url(#c4mark)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
 <circle cx="47" cy="50" r="6" fill="#5ee3e8"/>
</svg>;

const Neuron=()=>{
 const f=useCurrentFrame();
 return <svg viewBox="0 0 700 650" width="700" height="650" aria-label="Neurona decorativa de C4">
  <defs><radialGradient id="core"><stop stopColor="#fff3ce"/><stop offset=".3" stopColor="#ff5cbb"/><stop offset="1" stopColor="#9a65ff" stopOpacity="0"/></radialGradient><linearGradient id="axon"><stop stopColor="#e954c1"/><stop offset="1" stopColor="#5ee3e8"/></linearGradient></defs>
  {Array.from({length:13},(_,i)=>{const a=(i/13)*Math.PI*2; const x=330+Math.cos(a)*210,y=290+Math.sin(a)*205;return <g key={i} fill="none" stroke={i<7?'#d66acf':'#65dfe8'} strokeWidth="2.5" opacity=".75"><path d={`M330 290 Q${330+Math.cos(a+.3)*105} ${290+Math.sin(a+.3)*115} ${x} ${y}`}/>{[-.45,.45].map(b=><path key={b} d={`M${330+Math.cos(a)*135} ${290+Math.sin(a)*135} L${x+Math.cos(a+b)*70} ${y+Math.sin(a+b)*75}`}/>)}<circle cx={x} cy={y} r="4" fill={i<7?'#d66acf':'#65dfe8'}/></g>;})}
  <path d="M340 310 C400 420 390 490 520 545 S620 580 685 610" stroke="url(#axon)" strokeWidth="26" fill="none" opacity=".32"/>
  <path d="M340 310 C400 420 390 490 520 545 S620 580 685 610" stroke="url(#axon)" strokeWidth="4" fill="none"/>
  <circle cx="330" cy="290" r={80+Math.sin(f/28)*5} fill="url(#core)"/><circle cx="330" cy="290" r="17" fill="#ffefc9"/>
  <circle cx="330" cy="290" r={44+(f%90)*.6} stroke="#a984ff" strokeWidth="1" fill="none" opacity={.4*(1-(f%90)/90)}/>
 </svg>;
};

const Tile=({title,value,note,accent=colors.cyan}:{title:string;value:string;note:string;accent?:string})=><div style={{padding:'26px 30px',border:'1px solid '+colors.line,borderRadius:24,background:colors.panel}}><div style={{fontSize:21,color:colors.muted}}>{title}</div><div style={{fontSize:44,fontWeight:700,color:accent,margin:'9px 0'}}>{value}</div><div style={{fontSize:20,lineHeight:1.45,color:'#d0d8e9'}}>{note}</div></div>;

const Flow=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 const stages=['Detectar','Diagnosticar','Proponer','Evaluar','Decidir'];
 return <div style={{display:'grid',gap:15,marginTop:12}}>{stages.map((stage,i)=><div key={stage} style={{display:'flex',alignItems:'center',gap:22,opacity:interpolate(f,[i*.35*fps,i*.35*fps+15],[.22,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),border:'1px solid '+(i===4?colors.cyan:colors.line),borderRadius:20,padding:'18px 25px',background:colors.panel}}><span style={{fontFamily:'Consolas',fontSize:20,color:colors.violet}}>0{i+1}</span><span style={{fontSize:34,fontWeight:650}}>{stage}</span><span style={{marginLeft:'auto',fontSize:21,color:colors.muted}}>{['Traza + versión','Grok','Prompt de prueba','Mismo dataset','Gate determinista'][i]}</span></div>)}</div>;
};

const Comparison=({rejected=false}:{rejected?:boolean})=><div style={{display:'grid',gap:25}}>
 <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:22}}><Tile title="BASELINE INMUTABLE" value="5 / 6" note="refunds_demo · v1.0.0" accent={colors.violet}/><Tile title="CANDIDATO EVALUADO" value={rejected?'5 / 6':'6 / 6'} note={rejected?'Regresión detectada':'Controles obligatorios aprobados'} accent={rejected?colors.rose:colors.cyan}/></div>
 <div style={{border:'1px solid '+(rejected?colors.rose:colors.cyan),borderRadius:24,padding:28,background:rejected?'#291925':'#112529'}}><div style={{fontSize:21,letterSpacing:3,color:colors.muted}}>DECISIÓN GUARDADA</div><div style={{fontSize:54,fontWeight:750,color:rejected?colors.rose:colors.cyan,marginTop:10}}>{rejected?'REJECTED':'ACCEPTED'}</div><p style={{fontSize:25,lineHeight:1.5,marginBottom:0}}>{rejected?'refund_eligible: pasó → falló. Mejorar un caso no permite ocultar una regresión.':'Cero regresiones. Mejora demostrada sobre la misma versión del dataset.'}</p></div>
 <div style={{fontSize:21,color:colors.muted}}>Resultados de ejecución guardada · versiones de prueba · sin cambios en producción</div>
</div>;

type SceneProps={kind:string;heading:string;kicker:string;detail:string;asset:string;audio:string};
const SceneInner=({kind,heading,kicker,detail,asset,audio}:SceneProps)=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 const right=kind==='accepted'||kind==='rejected';
 return <>
  <Audio src={staticFile(audio)}/>
  <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 95% 8%,#35244d 0%,#080b14 62%)'}}/>
  <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(#ffffff04 1px,transparent 1px),linear-gradient(90deg,#ffffff04 1px,transparent 1px)',backgroundSize:'66px 66px'}}/>
  <div style={{position:'absolute',inset:'68px 88px',fontFamily:'Segoe UI,Arial,sans-serif',color:'#f3f5fb',opacity:interpolate(f,[0,.45*fps],[0,1],{extrapolateRight:'clamp'}),transform:'translateY('+interpolate(f,[0,.5*fps],[18,0],{extrapolateRight:'clamp'})+'px)'}}>
   <div style={{display:'flex',alignItems:'center',gap:18}}><Mark size={48}/><span style={{letterSpacing:4,fontSize:19,color:colors.violet,fontWeight:700}}>{kicker}</span><span style={{marginLeft:'auto',fontSize:17,color:colors.muted}}>C4 AI / S1 · 17 OCT 2026</span></div>
   <h1 style={{fontSize:kind==='rejected'?64:76,letterSpacing:-2,lineHeight:1.08,margin:'28px 0 20px',maxWidth:1640}}>{heading}</h1>
   <div style={{height:650,marginTop:30}}>
   {kind==='hero'?<div style={{display:'grid',gridTemplateColumns:'1.1fr 1fr',alignItems:'center',height:'100%'}}><div><p style={{fontSize:41,lineHeight:1.35,maxWidth:740}}>Una corrección necesita <span style={{color:colors.cyan}}>pruebas</span>, no solo una buena explicación.</p><div style={{display:'flex',gap:14,marginTop:30}}>{['Grok','CLI + API','Evidencia'].map(t=><span key={t} style={{border:'1px solid '+colors.line,borderRadius:99,padding:'12px 22px',fontSize:21,color:colors.violet}}>{t}</span>)}</div><p style={{fontSize:22,color:colors.muted,marginTop:42}}>Montaje narrado de ejecuciones reales<br/>sobre seis casos sintéticos.</p></div><Neuron/></div>:
    kind==='flow'?<div style={{display:'grid',gridTemplateColumns:'1.35fr 1fr',gap:70,alignItems:'center'}}><Flow/><div style={{display:'grid',gap:22}}><Tile title="ANÁLISIS Y CANDIDATO" value="Grok" note="Diagnóstico y propuesta estructurados." accent={colors.violet}/><Tile title="ACEPTACIÓN" value="Gate" note="Mejora + evaluación completa + cero regresiones."/><p style={{fontSize:21,color:colors.muted}}>Animación del diseño del flujo; no progreso en vivo.</p></div></div>:
    kind==='telegram'?<div style={{display:'grid',gridTemplateColumns:'1.2fr 1fr',gap:55}}><div style={{padding:40,border:'1px solid '+colors.line,borderRadius:30,background:colors.panel}}><div style={{display:'flex',alignItems:'center',gap:20,fontSize:35,fontWeight:700}}><span style={{color:colors.cyan}}>Telegram</span><span>↔</span><span>Hermes</span><span>↔</span><Mark size={62}/></div><div style={{marginTop:40,borderRadius:'22px 22px 22px 5px',padding:27,background:'#28304a',fontSize:27,lineHeight:1.5}}>Consultar reporte y evaluación de C4. Solo lectura.</div><div style={{marginTop:24,borderRadius:'22px 22px 5px 22px',padding:27,background:'#14363b',fontSize:29,lineHeight:1.55}}>accepted<br/>Baseline 5/6 → candidato 6/6<br/>Cero regresiones.</div><p style={{fontSize:19,color:colors.muted}}>Representación del resultado verificado; no captura de un chat privado.</p></div><div style={{display:'grid',gap:20}}><Tile title="ENTRADA → RESPUESTA ENTREGADA" value="19,110 s" note="Prueba registrada con dos herramientas MCP."/><Tile title="SIGUIENTES HITOS" value="30+ casos" note="Costos, workers y escala pendientes." accent={colors.violet}/><p style={{fontSize:22,color:colors.muted,lineHeight:1.5}}>WhatsApp: pendiente de configurar y verificar.<br/>Repositorio: privado por decisión del equipo.</p></div></div>:
    <div style={{display:'grid',gridTemplateColumns:right?'1.1fr 1fr':'1.7fr 1fr',gap:36,height:'100%',alignItems:'center'}}>
     <div style={{height:640,border:'1px solid '+colors.line,borderRadius:26,overflow:'hidden',background:'#0f1220',padding:10}}><CanvasImage src={staticFile(asset)} style={{width:'100%',height:'100%',objectFit:'contain',scale:interpolate(f,[0,16*fps],[1,1.025],{extrapolateRight:'clamp'})}}/></div>
     {right?<Comparison rejected={kind==='rejected'}/>:<div style={{display:'grid',gap:22}}>{kind==='cli'?<><Tile title="CONVERSACIÓN" value="Streaming" note="Contexto de evidencia y límites por sesión."/><Tile title="GROQ / UNA MUESTRA" value="625 ms" note="Primer fragmento;906ms total. No es garantía." accent={colors.violet}/><p style={{fontSize:23,color:colors.muted}}>Comandos, chat y consumo visibles.</p></>:<><Tile title="FUENTE DE DATOS" value="API local" note="Los mismos checkpoints del CLI."/><Tile title="EVIDENCIA" value="Trazable" note="Incidentes, reportes y comparación." accent={colors.violet}/><p style={{fontSize:23,color:colors.muted}}>Costo desconocido visible.<br/>Sin fallback silencioso a mocks.</p></>}</div>}
    </div>}
   </div>
   <div style={{position:'absolute',bottom:0,left:0,right:0,display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:'1px solid '+colors.line,paddingTop:22,fontSize:21,color:colors.muted}}><span>{detail}</span><span style={{fontSize:17}}>Deimer + Santiago</span></div>
  </div>
 </>;
};

export const C4Scene=Interactive.create({Component:SceneInner,layout:'absolute-fill',schema:{
 kind:{type:'string',default:'hero',description:'Tipo de escena'},heading:{type:'string',default:'C4 AI',description:'Título'},
 kicker:{type:'string',default:'RELIABILITY HARNESS',description:'Sección'},detail:{type:'string',default:'',description:'Nota de evidencia'},
 asset:{type:'string',default:'c4/dashboard-desktop.jpg',description:'Captura local'},audio:{type:'string',default:'c4/narration-1.wav',description:'Narración local'},
}});

export const C4Delivery=()=>{
 const {fps}=useVideoConfig();
 return <Track name="C4 AI — entrega S1">
  <C4Scene name="01 Problema" durationInFrames={14*fps} kind="hero" heading="Confiabilidad para agentes de IA." kicker="C4 AI / END TO END" detail="Capturas y evidencia guardada · casos sintéticos · respuestas reales" asset="c4/dashboard-desktop.jpg" audio="c4/narration-1.wav"/>
  <C4Scene name="02 Arquitectura" from={14*fps} durationInFrames={16*fps} kind="flow" heading="Del fallo a una decisión verificable." kicker="EL CICLO C4" detail="CLI → core compartido → checkpoints → API → dashboard" asset="c4/dashboard-desktop.jpg" audio="c4/narration-2.wav"/>
  <C4Scene name="03 Consola" from={30*fps} durationInFrames={18*fps} kind="cli" heading="Conversación con evidencia." kicker="CLI / TUI" detail="Grok analiza · Groq puede conversar o ejecutar el agente de prueba" asset="c4/cli-chat-preview.png" audio="c4/narration-3.wav"/>
  <C4Scene name="04 Dashboard" from={48*fps} durationInFrames={18*fps} kind="dashboard" heading="La evidencia llega a la interfaz." kicker="DASHBOARD / API REAL" detail="Vista responsive implementada · evidencia del almacén local" asset="c4/dashboard-desktop.jpg" audio="c4/narration-4.wav"/>
  <C4Scene name="05 Aceptación" from={66*fps} durationInFrames={19*fps} kind="accepted" heading="Una mejora respaldada por pruebas." kicker="GROK → GROK" detail="14 llamadas ·20.720 tokens reportados · costo USD desconocido" asset="c4/evaluation-accepted.jpg" audio="c4/narration-5.wav"/>
  <C4Scene name="06 Rechazo" from={85*fps} durationInFrames={18*fps} kind="rejected" heading="La regresión bloquea el candidato." kicker="GROK ANALIZA / GROQ EJECUTA" detail="Completar el ciclo no implica aceptación · baseline inmutable" asset="c4/evaluation-rejected.jpg" audio="c4/narration-6.wav"/>
  <C4Scene name="07 Hermes y alcance" from={103*fps} durationInFrames={17*fps} kind="telegram" heading="Herramientas conectadas. Límites visibles." kicker="HERMES / TELEGRAM / MCP" detail="Consulta de evidencia verificada · sin cambios en producción" asset="c4/dashboard-desktop.jpg" audio="c4/narration-7.wav"/>
 </Track>;
};

