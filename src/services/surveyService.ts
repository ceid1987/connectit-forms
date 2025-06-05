// services/surveyService.ts

// Get survey data 
export async function getSurveyData(guid: string) {
  // Get URL
  const baseUrl = process.env.API_GET_SURVEY_URL;
  if (!baseUrl) {
    throw new Error('Missing API_GET_SURVEY_URL env var');
  }
  const url = `${baseUrl}?id=0&surveyGuidId=${encodeURIComponent(guid)}`

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);

  const json = await res.json();

  // If survey already submitted
  if (
    typeof json.message === 'string' &&
    json.message.startsWith('Survey already submitted')
  ) {
    throw new Error('ALREADY_SUBMITTED');
  }

  // If invalid survey 
  if (
    !json.data ||
    !Array.isArray(json.data) ||
    json.data.length === 0
  ) {
    throw new Error('INVALID_SURVEY');
  }

  // Normal response
  const { data } = await res.json();        // ApiResponse
  const surveyData = data[0];
  const questionOptions = JSON.parse(surveyData.QuestionOptionJson);

  return { surveyData, questionOptions };
}

// Submit
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
  const postUrl = process.env.API_SUBMIT_SURVEY_URL;
  if (!postUrl) {
    throw new Error('Missing API_SUBMIT_SURVEY_URL env var');
  }

  const res = await fetch(postUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Submission failed');
  return res.json();
}
