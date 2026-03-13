// Dependencies: useState, useEffect, useCallback — see DEPENDENCY_GUIDE.md
import { useState, useEffect, useCallback } from 'react';
import { topicsApi } from '../api/topics';
import type { TopicResponse, CreateTopicRequest, UpdateTopicRequest } from '../types/topic';

export function useTopics() {
  const [topics, setTopics] = useState<TopicResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopics = useCallback(async () => {
    try {
      setLoading(true);
      const res = await topicsApi.list();
      setTopics(res.data);
      setError(null);
    } catch {
      setError('Failed to load topics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTopics(); }, [fetchTopics]);

  const createTopic = async (data: CreateTopicRequest) => {
    const res = await topicsApi.create(data);
    setTopics(prev => [...prev, res.data]);
    return res.data;
  };

  const updateTopic = async (id: string, data: UpdateTopicRequest) => {
    const res = await topicsApi.update(id, data);
    setTopics(prev => prev.map(t => t.id === id ? res.data : t));
    return res.data;
  };

  const deleteTopic = async (id: string) => {
    await topicsApi.delete(id);
    setTopics(prev => prev.filter(t => t.id !== id));
  };

  return { topics, loading, error, createTopic, updateTopic, deleteTopic, refetch: fetchTopics };
}
