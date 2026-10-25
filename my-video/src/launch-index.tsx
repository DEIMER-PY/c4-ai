import { Composition, registerRoot } from "remotion";
import { C4Launch, launchDefaults } from "./C4Launch";
import "./launch.css";

const LaunchRoot = () => (
  <Composition
    id="C4Launch"
    component={C4Launch}
    durationInFrames={900}
    fps={60}
    width={1920}
    height={1080}
    defaultProps={launchDefaults}
  />
);

registerRoot(LaunchRoot);
