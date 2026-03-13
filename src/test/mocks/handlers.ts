import { http, HttpResponse } from 'msw';
import {
  mockUser,
  mockTokens,
  mockTopics,
  mockConcepts,
  mockCards,
  mockReviewResponse,
  mockStatsOverview,
  mockAccuracy,
  mockHeatmap,
  mockFragileCards,
} from './data';

export const handlers = [
  // Auth
  http.post('/api/auth/login', () => {
    return HttpResponse.json(mockTokens);
  }),

  http.post('/api/auth/register', () => {
    return HttpResponse.json(mockTokens);
  }),

  http.post('/api/auth/refresh', () => {
    return HttpResponse.json(mockTokens);
  }),

  http.post('/api/auth/logout', () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('/api/auth/me', () => {
    return HttpResponse.json(mockUser);
  }),

  // Topics
  http.get('/api/topics', () => {
    return HttpResponse.json(mockTopics);
  }),

  http.get('/api/topics/:id', ({ params }) => {
    const topic = mockTopics.find(t => t.id === params.id);
    if (!topic) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(topic);
  }),

  http.post('/api/topics', async ({ request }) => {
    const body = await request.json() as Record<string, string>;
    const newTopic = {
      id: 'topic-new',
      name: body.name,
      description: body.description ?? '',
      colorHex: body.colorHex ?? '#6366F1',
      sortOrder: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cardCount: 0,
    };
    return HttpResponse.json(newTopic, { status: 201 });
  }),

  http.put('/api/topics/:id', async ({ params, request }) => {
    const body = await request.json() as Record<string, string>;
    const topic = mockTopics.find(t => t.id === params.id);
    if (!topic) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ ...topic, ...body, updatedAt: new Date().toISOString() });
  }),

  http.put('/api/topics/reorder', async ({ request }) => {
    const body = await request.json() as { orderedIds: string[] };
    const map = new Map(mockTopics.map(t => [t.id, t]));
    const reordered = body.orderedIds
      .map((id, i) => {
        const topic = map.get(id);
        return topic ? { ...topic, sortOrder: i + 1 } : null;
      })
      .filter(Boolean);
    return HttpResponse.json(reordered);
  }),

  http.delete('/api/topics/:id', () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Concepts
  http.get('/api/concepts', ({ request }) => {
    const url = new URL(request.url);
    const topicId = url.searchParams.get('topicId');
    const filtered = topicId ? mockConcepts.filter(c => c.topicId === topicId) : mockConcepts;
    return HttpResponse.json(filtered);
  }),

  http.get('/api/concepts/:id', ({ params }) => {
    const concept = mockConcepts.find(c => c.id === params.id);
    if (!concept) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(concept);
  }),

  http.post('/api/concepts', async ({ request }) => {
    const body = await request.json() as Record<string, string>;
    const newConcept = {
      id: 'concept-new',
      topicId: body.topicId,
      title: body.title,
      notes: body.notes ?? null,
      referenceExplanation: null,
      status: 'LEARNING' as const,
      sortOrder: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(newConcept, { status: 201 });
  }),

  http.put('/api/concepts/:id', async ({ params, request }) => {
    const body = await request.json() as Record<string, string>;
    const concept = mockConcepts.find(c => c.id === params.id);
    if (!concept) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ ...concept, ...body, updatedAt: new Date().toISOString() });
  }),

  http.put('/api/concepts/reorder', async ({ request }) => {
    const body = await request.json() as { orderedIds: string[] };
    const map = new Map(mockConcepts.map(c => [c.id, c]));
    const reordered = body.orderedIds
      .map((id, i) => {
        const concept = map.get(id);
        return concept ? { ...concept, sortOrder: i + 1 } : null;
      })
      .filter(Boolean);
    return HttpResponse.json(reordered);
  }),

  http.delete('/api/concepts/:id', () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Cards
  http.get('/api/cards', ({ request }) => {
    const url = new URL(request.url);
    const conceptId = url.searchParams.get('conceptId');
    const filtered = conceptId ? mockCards.filter(c => c.conceptId === conceptId) : mockCards;
    return HttpResponse.json(filtered);
  }),

  http.get('/api/cards/:id', ({ params }) => {
    const card = mockCards.find(c => c.id === params.id);
    if (!card) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(card);
  }),

  http.post('/api/cards', async ({ request }) => {
    const body = await request.json() as Record<string, string>;
    const newCard = {
      ...mockCards[0],
      id: 'card-new',
      front: body.front,
      back: body.back,
      cardType: body.cardType ?? 'STANDARD',
      hint: body.hint ?? null,
      sourceUrl: body.sourceUrl ?? null,
      conceptId: body.conceptId,
    };
    return HttpResponse.json(newCard, { status: 201 });
  }),

  http.put('/api/cards/:id', async ({ params, request }) => {
    const body = await request.json() as Record<string, string>;
    const card = mockCards.find(c => c.id === params.id);
    if (!card) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ ...card, ...body, updatedAt: new Date().toISOString() });
  }),

  http.delete('/api/cards/:id', () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.put('/api/cards/:id/algorithm', ({ params, request }) => {
    const url = new URL(request.url);
    const algorithm = url.searchParams.get('algorithm');
    const card = mockCards.find(c => c.id === params.id);
    if (!card) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ ...card, schedulingAlgorithm: algorithm });
  }),

  // Reviews
  http.get('/api/reviews/today', () => {
    return HttpResponse.json(mockCards);
  }),

  http.get('/api/reviews/practice', () => {
    return HttpResponse.json(mockCards);
  }),

  http.post('/api/reviews/:cardId', () => {
    return HttpResponse.json(mockReviewResponse);
  }),

  // Stats
  http.get('/api/stats/overview', () => {
    return HttpResponse.json(mockStatsOverview);
  }),

  http.get('/api/stats/accuracy', () => {
    return HttpResponse.json(mockAccuracy);
  }),

  http.get('/api/stats/heatmap', () => {
    return HttpResponse.json(mockHeatmap);
  }),

  http.get('/api/stats/fragile', () => {
    return HttpResponse.json(mockFragileCards);
  }),

  // AI
  http.get('/api/ai/status', () => {
    return HttpResponse.json({ available: true });
  }),

  http.post('/api/ai/generate-cards', () => {
    return HttpResponse.json([
      { front: 'AI question', back: 'AI answer', cardType: 'STANDARD', hint: null },
    ]);
  }),

  http.post('/api/ai/evaluate-teach-back', () => {
    return HttpResponse.json({
      clarityScore: 4,
      accuracyScore: 3,
      completenessScore: 4,
      feedback: 'Good explanation',
      followUpQuestions: ['What about edge cases?'],
      detectedGaps: ['Missing error handling'],
      suggestedCards: [],
    });
  }),

  // Teach-Back
  http.get('/api/teach-back/pending', () => {
    return HttpResponse.json(mockConcepts);
  }),

  http.post('/api/teach-back', () => {
    return HttpResponse.json({
      id: 'tb-1',
      conceptId: 'concept-1',
      conceptTitle: 'Closures',
      userExplanation: 'My explanation',
      referenceExplanation: null,
      selfRating: 4,
      gapsFound: [],
      createdAt: new Date().toISOString(),
    });
  }),

  http.get('/api/teach-back/history', () => {
    return HttpResponse.json([]);
  }),
];
