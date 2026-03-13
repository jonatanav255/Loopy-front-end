export interface TopicSearchResult {
  id: string;
  name: string;
  description: string;
  colorHex: string;
}

export interface ConceptSearchResult {
  id: string;
  title: string;
  notes: string | null;
  status: string;
  topicId: string;
  topicName: string;
}

export interface CardSearchResult {
  id: string;
  front: string;
  back: string;
  hint: string | null;
  cardType: string;
  conceptId: string;
  conceptTitle: string;
  topicId: string;
  topicName: string;
}

export interface SearchResponse {
  topics: TopicSearchResult[];
  concepts: ConceptSearchResult[];
  cards: CardSearchResult[];
}
