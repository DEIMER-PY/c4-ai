import { MyComposition } from "./Composition";
import { Composition, Folder } from "remotion";
import { C4Delivery, C4Scene } from "./C4Delivery";
import { C4Launch, launchDefaults } from "./C4Launch";
import "./launch.css";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <Composition
        id="C4Launch"
        component={C4Launch}
        durationInFrames={900}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={launchDefaults}
      />
      <Composition
        id="C4S1Delivery"
        component={C4Delivery}
        durationInFrames={3600}
        fps={30}
        width={1920}
        height={1080}
      />
      <Folder name="C4-escenas">
        <Composition
          id="C4Scene"
          component={C4Scene}
          durationInFrames={510}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            kind: "hero",
            heading: "Confiabilidad para agentes de IA.",
            kicker: "C4 AI / END TO END",
            detail: "Casos sintéticos · respuestas reales",
            asset: "c4/dashboard-desktop.jpg",
            audio: "c4/narration-1.wav",
          }}
        />
      </Folder>
    </>
  );
};
