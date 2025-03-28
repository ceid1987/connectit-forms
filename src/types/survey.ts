// survey types
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