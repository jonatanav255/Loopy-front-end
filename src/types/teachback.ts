export interface SubmitTeachBackRequest {
  conceptId: string;
  userExplanation: string;
  selfRating: number;
  gapsFound?: string[];
}

export interface TeachBackResponse {
  id: string;
  conceptId: string;
  conceptTitle: string;
  userExplanation: string;
  referenceExplanation: string | null;
  selfRating: number;
  gapsFound: string[];
  createdAt: string;
}
