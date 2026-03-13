export interface AIStatusResponse {
  available: boolean;
}

export interface GenerateCardsRequest {
  conceptId: string;
  content: string;
  numCards: number;
}

export interface GeneratedCard {
  front: string;
  back: string;
  cardType: string;
  hint: string | null;
}

export interface EvaluateTeachBackRequest {
  conceptId: string;
  userExplanation: string;
}

export interface TeachBackEvaluation {
  clarityScore: number;
  accuracyScore: number;
  completenessScore: number;
  feedback: string;
  followUpQuestions: string[];
  detectedGaps: string[];
  suggestedCards: GeneratedCard[];
}
