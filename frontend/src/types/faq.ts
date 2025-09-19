export interface FaqItem {
  id: string;
  questionKey: string;
  answerKey: string;
}

export interface FaqCategory {
  id: string;
  categoryTitleKey: string;
  questions: FaqItem[];
}
