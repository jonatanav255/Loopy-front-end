export const en = {
  // App
  appName: 'Loopy',

  // Nav
  nav: {
    dashboard: 'Dashboard',
    topics: 'Topics',
    review: 'Review',
    teachBack: 'Teach-Back',
    ai: 'AI',
    signOut: 'Sign out',
  },

  // Auth
  auth: {
    signIn: 'Sign in to your account',
    signingIn: 'Signing in...',
    signInBtn: 'Sign in',
    createAccount: 'Create your account',
    creatingAccount: 'Creating account...',
    createAccountBtn: 'Create account',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    rememberMe: 'Remember me',
    noAccount: "Don't have an account?",
    register: 'Register',
    hasAccount: 'Already have an account?',
    loginFailed: 'Login failed',
    registrationFailed: 'Registration failed',
    passwordMismatch: 'Passwords do not match',
    passwordMinLength: 'Password must be at least 8 characters',
  },

  // Dashboard
  dashboard: {
    title: 'Dashboard',
    reviewCards: 'Review {count} cards',
    reviewed: 'Reviewed',
    passed: 'Passed',
    accuracy: 'Accuracy',
  },

  // Topics
  topics: {
    title: 'Topics',
    newTopic: 'New Topic',
    editTopic: 'Edit Topic',
    noTopics: 'No topics yet',
    noTopicsDesc: 'Create your first topic to start organizing your learning.',
    deleteTopic: 'Delete topic?',
    deleteTopicMsg: 'This will permanently delete "{name}" and all its concepts and cards.',
    topicCreated: 'Topic created',
    topicUpdated: 'Topic updated',
    topicDeleted: 'Topic deleted',
    name: 'Name',
    description: 'Description',
    color: 'Color',
    cards: 'cards',
  },

  // Concepts
  concepts: {
    newConcept: 'New Concept',
    editConcept: 'Edit Concept',
    noConcepts: 'No concepts yet',
    noConceptsDesc: 'Add concepts to this topic to start creating flashcards.',
    deleteConcept: 'Delete concept?',
    deleteConceptMsg: 'This will permanently delete "{name}" and all its cards.',
    conceptCreated: 'Concept created',
    conceptUpdated: 'Concept updated',
    conceptDeleted: 'Concept deleted',
    title: 'Title',
    notes: 'Notes',
    referenceExplanation: 'Reference Explanation',
  },

  // Cards
  cards: {
    newCard: 'New Card',
    editCard: 'Edit Card',
    noCards: 'No cards yet',
    noCardsDesc: 'Create flashcards to start reviewing this concept.',
    deleteCard: 'Delete card?',
    deleteCardMsg: 'This will permanently delete this card and its review history.',
    cardCreated: 'Card created',
    cardUpdated: 'Card updated',
    cardDeleted: 'Card deleted',
    front: 'Front',
    back: 'Back',
    hint: 'Hint',
    sourceUrl: 'Source URL',
    cardType: 'Card Type',
    switchedTo: 'Switched to {algorithm}',
  },

  // Review
  review: {
    title: 'Review Session',
    configure: 'Configure your review session.',
    topicsLabel: 'Topics',
    loadingTopics: 'Loading topics...',
    noTopicsFound: 'No topics found. Create a topic first.',
    allTopics: 'All Topics',
    startReview: 'Start Review',
    endSession: 'End Session',
    practiceMode: 'Practice Mode',
    showAnswer: 'Show Answer (Space)',
    rateRecall: 'Rate your recall (1-6)',
    confidence: 'How confident are you? (1-3)',
    allCaughtUp: 'All caught up!',
    noCardsDue: 'No cards due for review today.',
    practiceAll: 'Practice All Cards',
    backToDashboard: 'Back to Dashboard',
    sessionComplete: 'Session Complete',
    practiceAgain: 'Practice Again',
    again: 'Again',
    hard: 'Hard',
    difficult: 'Difficult',
    ok: 'OK',
    good: 'Good',
    easy: 'Easy',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  },

  // Teach-Back
  teachBack: {
    title: 'Teach-Back',
    description: 'Concepts flagged for teach-back — explain them in your own words to deepen understanding.',
    noPending: 'No teach-backs pending',
    noPendingDesc: 'Concepts requiring teach-back will appear here after reviews.',
    explain: 'Explain this concept in your own words, as if teaching someone else.',
    placeholder: 'Write your explanation here...',
    continueToEval: 'Continue to Self-Eval',
    yourExplanation: 'Your Explanation',
    referenceExplanation: 'Reference Explanation',
    howWell: 'How well did you explain it?',
    gapsLabel: 'Knowledge gaps found (one per line, optional)',
    gapsPlaceholder: 'e.g., I forgot how the base case works...',
    submit: 'Submit Teach-Back',
    submitted: 'Teach-back submitted',
    submitFailed: 'Failed to submit teach-back',
    complete: 'Teach-Back Complete',
    selfRating: 'Self Rating',
    gapsFound: 'Gaps Found',
    knowledgeGaps: 'Knowledge Gaps',
    done: 'Done',
    back: '← Back',
    cancel: 'Cancel',
    rating1: 'Very confused — could not explain at all',
    rating2: 'Shaky — missed major parts',
    rating3: 'Partial — got the gist but gaps remain',
    rating4: 'Good — mostly accurate, minor gaps',
    rating5: 'Confident — clear and complete',
  },

  // AI
  ai: {
    title: 'AI Features',
    notConfigured: 'AI not configured',
    notConfiguredDesc: 'The Claude API key has not been configured on the server. AI features are unavailable.',
    generateTitle: 'Generate Cards with AI',
    topic: 'Topic',
    selectTopic: 'Select topic...',
    concept: 'Concept',
    selectConcept: 'Select concept...',
    contentLabel: 'Content / Notes',
    contentPlaceholder: 'Paste study material, notes, or text to generate flashcards from...',
    numCards: 'Number of Cards',
    generate: 'Generate Cards',
    generating: 'Generating...',
    generated: 'Generated {count} cards',
    generatedTitle: 'Generated Cards ({count})',
    saveAll: 'Save All',
    save: 'Save',
    saving: 'Saving...',
    saved: 'Saved',
    cardSaved: 'Card saved',
    saveFailed: 'Failed to save card',
    generateFailed: 'Failed to generate cards',
  },

  // Common
  common: {
    cancel: 'Cancel',
    delete: 'Delete',
    create: 'Create',
    update: 'Update',
    loading: 'Loading...',
    back: '← Back',
  },

  // Keyboard shortcuts
  shortcuts: {
    title: 'Keyboard Shortcuts',
    navigation: 'Navigation',
    actions: 'Actions',
    review: 'Review',
    goToDashboard: 'Go to Dashboard',
    goToTopics: 'Go to Topics',
    goToReview: 'Go to Review',
    goToTeachBack: 'Go to Teach-Back',
    goToAI: 'Go to AI',
    newItem: 'New item',
    closeCancel: 'Close / Cancel',
    showShortcuts: 'Show shortcuts',
    revealAnswer: 'Reveal answer',
    rateCard: 'Rate card',
    confidenceLevel: 'Confidence level',
  },

  // Stats
  stats: {
    totalCards: 'Total Cards',
    dueToday: 'Due Today',
    reviewsToday: 'Reviews Today',
    avgAccuracy: 'Avg Accuracy',
    fragileCards: 'Fragile Cards',
    fragileDesc: 'Cards with lowest retention — focus your reviews here.',
    noFragile: 'No fragile cards yet',
    noFragileDesc: 'Cards that need extra attention will appear here.',
    activity: 'Activity',
    reviews: 'reviews',
  },

  // Language
  language: {
    en: 'EN',
    es: 'ES',
  },
};

/** Recursively maps all leaf values to string for i18n compatibility. */
type DeepString<T> = {
  [K in keyof T]: T[K] extends object ? DeepString<T[K]> : string;
};

export type Translations = DeepString<typeof en>;
