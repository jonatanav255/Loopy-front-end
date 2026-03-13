export type ConceptStatus = 'LEARNING' | 'REVIEW' | 'MASTERED' | 'TEACH_BACK_REQUIRED';

export interface ConceptResponse {
  id: string;
  topicId: string;
  title: string;
  notes: string | null;
  referenceExplanation: string | null;
  status: ConceptStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConceptRequest {
  topicId: string;
  title: string;
  notes?: string;
}

export interface UpdateConceptRequest {
  title: string;
  notes?: string;
  referenceExplanation?: string;
}
