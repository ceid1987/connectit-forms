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
  guid: string;
  surveyData: any;
  questionOptions: any;
  surveyResponses: Record<string, any>;
  startTime: string;
}) {
  const res = await fetch('http://cit-app-db-server/SharpDialAPI/api/admin/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Submission failed');
  return res.json();
}
