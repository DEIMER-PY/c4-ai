import { Composition, registerRoot } from "remotion";
import {
  SantiagoAdditions,
  SantiagoClosing,
  SantiagoExtended,
} from "./extension/SantiagoExtension";
const Root = () => (
  <>
    <Composition
      id="C4SantiagoExtended"
      component={SantiagoExtended}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={3600}
    />
    <Composition
      id="C4SantiagoAdditions"
      component={SantiagoAdditions}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={1470}
    />
    <Composition
      id="C4SantiagoClosing"
      component={SantiagoClosing}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={288}
    />
  </>
);
registerRoot(Root);
