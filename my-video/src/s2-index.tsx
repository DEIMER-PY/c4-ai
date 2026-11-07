import { Composition, registerRoot } from "remotion";
import { FPS, S2Video, TOTAL } from "./s2/S2Video";

const Root = () => (
  <Composition id="C4S2" component={S2Video} width={1920} height={1080} fps={FPS} durationInFrames={TOTAL} />
);
registerRoot(Root);
