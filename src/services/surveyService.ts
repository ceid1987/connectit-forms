// services/surveyService.ts

// 1) Accept guid
export async function getSurveyData(guid: string) {
  const url = `http://cit-app-db-server/SharpDialAPI/api/admin/GetSurveyQuestion?id=0&surveyGuidId=${guid}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);

  const { data } = await res.json();        // ApiResponse
  const surveyData = data[0];
  const questionOptions = JSON.parse(surveyData.QuestionOptionJson);

  return { surveyData, questionOptions };
}

// 2) Also accept guid in your submit call
export async function submitSurveyResponse(payload: {
  comments: string;
  endTime: string;
  questions: Array<{
    answerOptions: string[];
    inputType: 'radio' | 'checkbox' | 'text';
    isRequired: boolean;
    questionText: string;
    userResponse: string;
  }>;
  ratingQuestion: string;
  startTime: string;
  transactionguidid: string;
  userRating: number;
}) {
  const res = await fetch('http://cit-app-db-server/SharpDialAPI/api/admin/SubmitSurvey', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Submission failed');
  return res.json();
}
