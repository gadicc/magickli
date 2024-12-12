export interface StudyCardStats {
  correct: number;
  incorrect: number;
  time: number;
  dueDate: Date;
  supermemo: {
    interval: number;
    repetition: number;
    efactor: number;
  };
  repetition: {
    weight: number;
  };
}

export interface StudySetStats {
  [key: string]: unknown;
  _id?: string;
  userId?: string;
  setId: string;
  cards: Record<string, StudyCardStats>;
  correct: number;
  incorrect: number;
  time: number;
  dueDate: Date;
  __ObjectIDs?: string[];
  __updatedAt?: number;
}
