/**
 * Smart Skill Matching Algorithm for EduBond
 *
 * Scores mutual alignment between users based on:
 * 1. Skill overlap (direct swap vs one-way)
 * 2. University proximity
 * 3. Reputation score
 * 4. Token affordability
 *
 * Returns ranked list of best matches.
 */

export interface UserSkillNode {
  userId: string;
  name: string;
  university: string;
  reputationScore: number;
  tokenBalance: number;
  offers: string[]; // Skill names they can teach
  needs: string[];  // Skill names they want to learn
}

export interface MatchResult {
  userId: string;
  name: string;
  score: number;
  matchType: "direct_swap" | "one_way_they_teach" | "one_way_you_teach" | "none";
  overlappingTeach: string[];  // Skills they can teach that you need
  overlappingLearn: string[];  // Skills they need that you offer
  reason: string;
}

const WEIGHTS = {
  DIRECT_SWAP: 100,
  ONE_WAY: 30,
  SAME_UNIVERSITY: 20,
  REPUTATION_MULTIPLIER: 2,  // reputationScore * multiplier
  HAS_TOKENS_BONUS: 5,       // bonus if they can afford a session
};

function calculateScore(user: UserSkillNode, candidate: UserSkillNode): MatchResult {
  let score = 0;
  let matchType: MatchResult["matchType"] = "none";
  const reasons: string[] = [];

  // Find overlapping skills
  const theyCanTeachYou = candidate.offers.filter((s) => user.needs.includes(s));
  const youCanTeachThem = user.offers.filter((s) => candidate.needs.includes(s));

  if (theyCanTeachYou.length > 0 && youCanTeachThem.length > 0) {
    score += WEIGHTS.DIRECT_SWAP * Math.min(theyCanTeachYou.length, youCanTeachThem.length);
    matchType = "direct_swap";
    reasons.push(`Direct swap: you trade ${youCanTeachThem.join(", ")} ↔ ${theyCanTeachYou.join(", ")}`);
  } else if (theyCanTeachYou.length > 0) {
    score += WEIGHTS.ONE_WAY * theyCanTeachYou.length;
    matchType = "one_way_they_teach";
    reasons.push(`They can teach you: ${theyCanTeachYou.join(", ")}`);
  } else if (youCanTeachThem.length > 0) {
    score += WEIGHTS.ONE_WAY * youCanTeachThem.length;
    matchType = "one_way_you_teach";
    reasons.push(`You can teach them: ${youCanTeachThem.join(", ")}`);
  }

  // Same university bonus
  if (user.university === candidate.university) {
    score += WEIGHTS.SAME_UNIVERSITY;
    reasons.push("Same university");
  }

  // Reputation bonus
  score += candidate.reputationScore * WEIGHTS.REPUTATION_MULTIPLIER;

  // Token affordability bonus (can they pay for sessions?)
  if (candidate.tokenBalance >= 10) {
    score += WEIGHTS.HAS_TOKENS_BONUS;
  }

  return {
    userId: candidate.userId,
    name: candidate.name,
    score: Math.round(score * 10) / 10,
    matchType,
    overlappingTeach: theyCanTeachYou,
    overlappingLearn: youCanTeachThem,
    reason: reasons.join(" • "),
  };
}

/**
 * Returns ranked recommendations for a given user.
 * @param currentUser - The user seeking matches
 * @param allUsers - All other users in the pool
 * @param filters - Optional filters for category, university, etc.
 */
export function getRecommendations(
  currentUser: UserSkillNode,
  allUsers: UserSkillNode[],
  filters?: {
    sameUniversity?: boolean;
    category?: string;
    minRating?: number;
  }
): MatchResult[] {
  let candidates = allUsers.filter((u) => u.userId !== currentUser.userId);

  // Apply filters
  if (filters?.sameUniversity) {
    candidates = candidates.filter((u) => u.university === currentUser.university);
  }
  if (filters?.minRating) {
    candidates = candidates.filter((u) => u.reputationScore >= filters.minRating!);
  }

  const results: MatchResult[] = [];

  for (const candidate of candidates) {
    const result = calculateScore(currentUser, candidate);
    if (result.score > 0) {
      results.push(result);
    }
  }

  // Sort by score descending, then by matchType priority
  return results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const typePriority = { direct_swap: 3, one_way_they_teach: 2, one_way_you_teach: 1, none: 0 };
    return typePriority[b.matchType] - typePriority[a.matchType];
  });
}

/**
 * Calculate tokens exchanged for a session
 */
export function calculateSessionCost(durationMin: number): number {
  if (durationMin <= 30) return 10;
  if (durationMin <= 60) return 15;
  return 20;
}

/**
 * Process a completed session: credit the teacher, debit the learner
 */
export function processSessionTokens(
  teacherBalance: number,
  learnerBalance: number,
  durationMin: number
): { teacherNewBalance: number; learnerNewBalance: number; tokensMoved: number } {
  const cost = calculateSessionCost(durationMin);
  return {
    teacherNewBalance: teacherBalance + cost,
    learnerNewBalance: learnerBalance - cost,
    tokensMoved: cost,
  };
}
