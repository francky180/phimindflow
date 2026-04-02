import { Composition } from "remotion";
import { PhimindflowVideo } from "./PhimindflowVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="PhimindflowPromo"
      component={PhimindflowVideo}
      durationInFrames={450}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
