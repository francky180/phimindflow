/**
 * AI Credit Report Analyzer
 *
 * Analyzes credit report data and generates a personalized action plan.
 * This is the free hook — builds trust and funnels to paid service.
 */

export interface CreditInput {
  scoreRange: "300-499" | "500-579" | "580-669" | "670-739" | "740-850";
  negativeItems: {
    latePayments: number;
    collections: number;
    chargeOffs: number;
    publicRecords: number;
    inquiries: number;
  };
  goals: ("buy-home" | "buy-car" | "rent-apartment" | "lower-rates" | "build-credit")[];
  timeline: "asap" | "3-months" | "6-months" | "1-year";
}

export interface CreditAnalysis {
  currentRange: string;
  estimatedScore: number;
  totalNegativeItems: number;
  disputableItems: number;
  estimatedScoreIncrease: number;
  estimatedTimeline: string;
  priority: "critical" | "moderate" | "minor";
  actionPlan: ActionItem[];
  goalFeasibility: GoalAssessment[];
}

interface ActionItem {
  order: number;
  action: string;
  impact: "high" | "medium" | "low";
  description: string;
  diyDifficulty: "easy" | "moderate" | "hard";
}

interface GoalAssessment {
  goal: string;
  currentlyFeasible: boolean;
  scoreNeeded: number;
  estimatedTimeToReach: string;
}

const SCORE_MIDPOINTS: Record<CreditInput["scoreRange"], number> = {
  "300-499": 420,
  "500-579": 540,
  "580-669": 620,
  "670-739": 700,
  "740-850": 780,
};

const GOAL_SCORES: Record<string, number> = {
  "buy-home": 620,
  "buy-car": 580,
  "rent-apartment": 580,
  "lower-rates": 670,
  "build-credit": 500,
};

const GOAL_LABELS: Record<string, string> = {
  "buy-home": "Buy a Home",
  "buy-car": "Buy a Car",
  "rent-apartment": "Rent an Apartment",
  "lower-rates": "Lower Interest Rates",
  "build-credit": "Build Credit History",
};

export function analyzeCreditReport(input: CreditInput): CreditAnalysis {
  const estimatedScore = SCORE_MIDPOINTS[input.scoreRange];
  const { latePayments, collections, chargeOffs, publicRecords, inquiries } =
    input.negativeItems;

  const totalNegativeItems =
    latePayments + collections + chargeOffs + publicRecords + inquiries;

  // Estimate disputable items (collections and inquiries are most disputable)
  const disputableItems = Math.min(
    totalNegativeItems,
    collections + Math.ceil(inquiries * 0.8) + Math.ceil(latePayments * 0.3)
  );

  // Estimate score increase per removed item
  const pointsPerItem = estimatedScore < 580 ? 15 : estimatedScore < 670 ? 10 : 5;
  const estimatedScoreIncrease = Math.min(
    disputableItems * pointsPerItem,
    150
  );

  const priority: CreditAnalysis["priority"] =
    estimatedScore < 500
      ? "critical"
      : estimatedScore < 620
        ? "moderate"
        : "minor";

  // Build action plan
  const actionPlan: ActionItem[] = [];
  let order = 1;

  if (collections > 0) {
    actionPlan.push({
      order: order++,
      action: "Dispute Collection Accounts",
      impact: "high",
      description: `You have ${collections} collection account${collections > 1 ? "s" : ""}. Collections are the most damaging items and the most commonly removed through disputes. Many collection agencies can't verify the debt when challenged.`,
      diyDifficulty: "moderate",
    });
  }

  if (latePayments > 0) {
    actionPlan.push({
      order: order++,
      action: "Address Late Payments",
      impact: "high",
      description: `You have ${latePayments} late payment${latePayments > 1 ? "s" : ""}. Request goodwill removal from the creditor or dispute inaccurate reporting dates. Even one removed late payment can boost your score significantly.`,
      diyDifficulty: "moderate",
    });
  }

  if (chargeOffs > 0) {
    actionPlan.push({
      order: order++,
      action: "Negotiate Charge-Offs",
      impact: "high",
      description: `You have ${chargeOffs} charge-off${chargeOffs > 1 ? "s" : ""}. Negotiate pay-for-delete agreements or dispute the accuracy of the reported amount. Charge-offs are serious but often negotiable.`,
      diyDifficulty: "hard",
    });
  }

  if (inquiries > 2) {
    actionPlan.push({
      order: order++,
      action: "Remove Hard Inquiries",
      impact: "low",
      description: `You have ${inquiries} hard inquiries. Dispute unauthorized inquiries directly with the bureaus. Each removed inquiry gives a small score bump.`,
      diyDifficulty: "easy",
    });
  }

  if (publicRecords > 0) {
    actionPlan.push({
      order: order++,
      action: "Address Public Records",
      impact: "high",
      description: `You have ${publicRecords} public record${publicRecords > 1 ? "s" : ""}. These are the most serious items. Verify accuracy and dispute any errors. Bankruptcies can be challenged if reporting details are wrong.`,
      diyDifficulty: "hard",
    });
  }

  // Always recommend these
  actionPlan.push({
    order: order++,
    action: "Optimize Credit Utilization",
    impact: "medium",
    description:
      "Keep credit card balances below 30% of your limit. Below 10% is ideal. This is the fastest way to see a score increase — often within 30 days.",
    diyDifficulty: "easy",
  });

  actionPlan.push({
    order: order++,
    action: "Set Up Automatic Payments",
    impact: "medium",
    description:
      "Payment history is 35% of your score. Set up autopay for at least the minimum on every account. One missed payment can drop your score 50-100 points.",
    diyDifficulty: "easy",
  });

  // Goal feasibility
  const goalFeasibility: GoalAssessment[] = input.goals.map((goal) => {
    const scoreNeeded = GOAL_SCORES[goal] || 620;
    const gap = Math.max(0, scoreNeeded - estimatedScore);
    const monthsNeeded = gap > 0 ? Math.ceil(gap / 15) : 0;

    return {
      goal: GOAL_LABELS[goal] || goal,
      currentlyFeasible: estimatedScore >= scoreNeeded,
      scoreNeeded,
      estimatedTimeToReach:
        monthsNeeded === 0
          ? "You qualify now"
          : `~${monthsNeeded} months with active repair`,
    };
  });

  // Timeline estimate
  const monthsEstimate = Math.max(2, Math.ceil(totalNegativeItems * 1.5));
  const estimatedTimeline =
    totalNegativeItems === 0
      ? "Your credit looks clean"
      : `${monthsEstimate}-${monthsEstimate + 2} months for full repair`;

  return {
    currentRange: input.scoreRange,
    estimatedScore,
    totalNegativeItems,
    disputableItems,
    estimatedScoreIncrease,
    estimatedTimeline,
    priority,
    actionPlan,
    goalFeasibility,
  };
}
