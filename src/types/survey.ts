// src/types/survey.ts

export interface Question {
  questionText: string;
  inputType: 'radio' | 'checkbox' | 'text';
  isRequired: boolean;
  answerOptions: string[];
}

export interface QuestionOptions {
  questions: Question[];
}

export interface SurveyData {
  TransactionGuidId: string;
  Pointofcontact: string;
  SurveyId: number;
  WelocomeNote: string;
  QuestionOptionJson: string;
  SurveyName: string;
  RatingQuestion: string;
  ratingStar: number;
  total_records: number;
}

export interface ApiResponse {
  data: SurveyData[];
}

export interface QuestionResponse {
  answerOptions: string[];
  inputType: 'radio' | 'checkbox' | 'text';
  isRequired: boolean;
  questionText: string;
  userResponse: string;
}

export interface SubmitPayload {
  comments: string;
  endTime: string;               // "YYYY-MM-DD HH:MM:SS"
  questions: QuestionResponse[];
  ratingQuestion: string;
  startTime: string;             // captured on the client
  transactionguidid: string;
  userRating: number;
}

// if your API returns exactly that same shape:
export type SubmitResponse = SubmitPayload;
