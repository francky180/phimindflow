import { Composition } from "remotion";
import { PhimindflowVideo } from "./PhimindflowVideo";
import { PromoVideo } from "./PromoVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PhimindflowPromo"
        component={PhimindflowVideo}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PhimindflowPromoV2"
        component={PromoVideo}
        durationInFrames={540}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
