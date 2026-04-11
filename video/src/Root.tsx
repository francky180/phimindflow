import { Composition } from "remotion";
import { PhimindflowVideo } from "./PhimindflowVideo";
import { PromoVideo } from "./PromoVideo";
import { FunnelShowcase } from "./FunnelShowcase";
import { EpikAuditVideo } from "./EpikAuditVideo";
import { InstaReel } from "./InstaReel";
import { SupplyDemandReel } from "./SupplyDemandReel";
import { WhatYouGet } from "./WhatYouGet";
import { BookLibrary, LIBRARY_DURATION } from "./BookLibrary";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SupplyDemandReel"
        component={SupplyDemandReel}
        durationInFrames={510}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="InstaReel"
        component={InstaReel}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
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
      <Composition
        id="FunnelShowcase"
        component={FunnelShowcase}
        durationInFrames={750}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="EpikStudioAudit"
        component={EpikAuditVideo}
        durationInFrames={780}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="WhatYouGet"
        component={WhatYouGet}
        durationInFrames={2700}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="BookLibrary"
        component={BookLibrary}
        durationInFrames={LIBRARY_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
