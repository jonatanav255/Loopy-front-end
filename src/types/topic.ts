export interface TopicResponse {
  id: string;
  name: string;
  description: string;
  colorHex: string;
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
