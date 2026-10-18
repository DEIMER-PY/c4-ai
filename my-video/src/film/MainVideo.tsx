import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import {
  Scene1Problem,
  Scene2HarnessCLI,
  Scene3HermesAgent,
  Scene4Architecture,
  Scene5DeterministicGate,
  Scene6Omnichannel,
  Scene7ResponsiveWeb,
  Scene8Outro,
} from "./Scenes";
import { clamp } from "./Design";
import audioManifest from "./audio-manifest.json";
import narration from "../../film-narration.json";

const Whoosh = () => (
  <Audio src={staticFile("launch/whoosh.mp3")} volume={0.19} />
);
export const MainVideo = () => {
  const f = useCurrentFrame();
  const starts = [0, 450, 900, 1350, 1950, 2400, 2850, 3300];
  const vo: Array<{
    file: string;
    startFrame: number;
    durationFrames: number;
  }> = audioManifest.complete ? audioManifest.clips : [];
  const duck = vo.reduce(
    (level, c) =>
      Math.min(
        level,
        interpolate(
          f,
          [
            c.startFrame - 4,
            c.startFrame,
            c.startFrame + c.durationFrames,
            c.startFrame + c.durationFrames + 4,
          ],
          [1, 0, 0, 1],
          clamp,
        ),
      ),
    1,
  );
  const chapter = narration.find(
    (c) => f >= c.start * 30 && f < (c.start + c.duration) * 30,
  );
  const words = chapter?.text.split(" ") ?? [];
  const chunk = chapter
    ? Math.min(
        Math.ceil(words.length / 12) - 1,
        Math.floor(
          (f - chapter.start * 30) /
            ((chapter.duration * 30) / Math.ceil(words.length / 12)),
        ),
      )
    : 0;
  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={468}>
          <Scene1Problem />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: 18 })}
        />
        <TransitionSeries.Sequence durationInFrames={468}>
          <Scene2HarnessCLI />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 18 })}
        />
        <TransitionSeries.Sequence durationInFrames={468}>
          <Scene3HermesAgent />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 18 })}
        />
        <TransitionSeries.Sequence durationInFrames={618}>
          <Scene4Architecture />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: 18 })}
        />
        <TransitionSeries.Sequence durationInFrames={468}>
          <Scene5DeterministicGate />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={linearTiming({ durationInFrames: 18 })}
        />
        <TransitionSeries.Sequence durationInFrames={468}>
          <Scene6Omnichannel />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 18 })}
        />
        <TransitionSeries.Sequence durationInFrames={468}>
          <Scene7ResponsiveWeb />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 18 })}
        />
        <TransitionSeries.Sequence durationInFrames={300}>
          <Scene8Outro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Audio
        src={staticFile("launch/ambient-drone.mp3")}
        loop
        volume={(frame) =>
          interpolate(
            frame,
            [0, 30, 3550, 3600],
            [0, 0.1 + duck * 0.08, 0.1 + duck * 0.08, 0],
            clamp,
          )
        }
      />
      <Sequence durationInFrames={35}>
        <Audio src={staticFile("launch/sub-drop.mp3")} volume={0.28} />
      </Sequence>
      <Sequence from={505} durationInFrames={280}>
        <Audio
          src={staticFile("launch/keystroke.mp3")}
          loop
          volume={(n) =>
            interpolate(n, [0, 10, 265, 280], [0, 0.08, 0.08, 0], clamp)
          }
        />
      </Sequence>
      {starts.slice(1).map((n) => (
        <Sequence key={n} from={n} durationInFrames={24}>
          <Whoosh />
        </Sequence>
      ))}
      <Sequence from={2240} durationInFrames={45}>
        <Audio src={staticFile("launch/success-ping.mp3")} volume={0.2} />
      </Sequence>
      {vo.map((c) => (
        <Sequence
          key={c.file}
          from={c.startFrame}
          durationInFrames={c.durationFrames}
        >
          <Audio src={staticFile(c.file)} volume={1} />
        </Sequence>
      ))}
      <div
        style={{
          position: "absolute",
          left: 170,
          right: 170,
          bottom: 65,
          textAlign: "center",
          fontFamily: "'Segoe UI',sans-serif",
          fontSize: 21,
          color: "#d5d9e3",
          textShadow: "0 2px 8px #000",
          background: "#07090ecc",
          padding: "7px 14px",
          borderRadius: 9,
        }}
      >
        {words.slice(chunk * 12, chunk * 12 + 12).join(" ")}
      </div>
      {!audioManifest.complete && (
        <div
          style={{
            position: "absolute",
            top: 108,
            right: 93,
            fontFamily: "Consolas,monospace",
            fontSize: 11,
            color: "#7c859b",
          }}
        >
          MONTAJE VISUAL / LOCUCIÓN DYLAN EN PREPARACIÓN
        </div>
      )}
      <AbsoluteFill
        style={{
          background: "#07090e",
          pointerEvents: "none",
          opacity: interpolate(f, [0, 16, 3575, 3599], [1, 0, 0, 1], clamp),
        }}
      />
    </AbsoluteFill>
  );
};
