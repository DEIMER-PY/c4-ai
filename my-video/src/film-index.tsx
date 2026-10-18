import { Composition, registerRoot } from "remotion";
import { MainVideo } from "./film/MainVideo";
import "./launch.css";
const FilmRoot = () => (
  <Composition
    id="C4AIVideo"
    component={MainVideo}
    width={1920}
    height={1080}
    fps={30}
    durationInFrames={3600}
  />
);
registerRoot(FilmRoot);
