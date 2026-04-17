import { Composition } from "remotion";
import { PhimindflowVideo } from "./PhimindflowVideo";
import { PromoVideo } from "./PromoVideo";
import { FunnelShowcase } from "./FunnelShowcase";
import { EpikAuditVideo } from "./EpikAuditVideo";
import { InstaReel } from "./InstaReel";
import { SupplyDemandReel } from "./SupplyDemandReel";
import { WhatYouGet } from "./WhatYouGet";
import { BookLibrary, LIBRARY_DURATION } from "./BookLibrary";
import { ASFJourney, ASF_JOURNEY_DURATION } from "./ASFJourney";
import { CreditPathJourney, CREDITPATH_JOURNEY_DURATION } from "./CreditPathJourney";
import { FlorifyeJourney, FLORIFYE_JOURNEY_DURATION } from "./FlorifyeJourney";
import { GHLSyncJourney, GHL_SYNC_DURATION } from "./GHLSyncJourney";
import { ASFCheckout, ASF_CHECKOUT_DURATION } from "./ASFCheckout";
import { PhimindflowPaymentFlow, PMF_PAYMENT_DURATION } from "./PhimindflowPaymentFlow";
import { CommentYesReel, COMMENT_YES_DURATION } from "./CommentYesReel";
import { RebuildWalkthrough, REBUILD_DURATION } from "./RebuildWalkthrough";

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
      <Composition
        id="ASFJourney"
        component={ASFJourney}
        durationInFrames={ASF_JOURNEY_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CreditPathJourney"
        component={CreditPathJourney}
        durationInFrames={CREDITPATH_JOURNEY_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FlorifyeJourney"
        component={FlorifyeJourney}
        durationInFrames={FLORIFYE_JOURNEY_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="GHLSyncJourney"
        component={GHLSyncJourney}
        durationInFrames={GHL_SYNC_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ASFCheckout"
        component={ASFCheckout}
        durationInFrames={ASF_CHECKOUT_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PhimindflowPaymentFlow"
        component={PhimindflowPaymentFlow}
        durationInFrames={PMF_PAYMENT_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CommentYesReel"
        component={CommentYesReel}
        durationInFrames={COMMENT_YES_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RebuildWalkthrough"
        component={RebuildWalkthrough}
        durationInFrames={REBUILD_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
