export interface TopicResponse {
  id: string;
  name: string;
  description: string;
  colorHex: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  cardCount: number;
}

export interface CreateTopicRequest {
  name: string;
  description?: string;
  colorHex?: string;
}

export interface UpdateTopicRequest {
  name: string;
  description?: string;
  colorHex?: string;
}
