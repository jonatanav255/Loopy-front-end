export interface ExportCardData {
  front: string;
  back: string;
  cardType: string;
  hint: string | null;
  sourceUrl: string | null;
}

export interface ExportConceptData {
  title: string;
  notes: string | null;
  referenceExplanation: string | null;
  cards: ExportCardData[];
}

export interface ExportTopicData {
  name: string;
  description: string;
  colorHex: string;
  concepts: ExportConceptData[];
}

export interface ExportResponse {
  exportVersion: string;
  exportedAt: string;
  topicCount: number;
  conceptCount: number;
  cardCount: number;
  topics: ExportTopicData[];
}

export interface ImportCardData {
  front: string;
  back: string;
  cardType?: string;
  hint?: string;
  sourceUrl?: string;
}

export interface ImportConceptData {
  title: string;
  notes?: string;
  referenceExplanation?: string;
  cards?: ImportCardData[];
}

export interface ImportTopicData {
  name: string;
  description?: string;
  colorHex?: string;
  concepts?: ImportConceptData[];
}

export interface ImportRequest {
  exportVersion: string;
  topics: ImportTopicData[];
}

export interface ImportResponse {
  topicsCreated: number;
  conceptsCreated: number;
  cardsCreated: number;
}
