// services/surveyService.ts

import { ApiResponse, SubmitPayload, SubmitResponse } from "@/types/survey";

// Get survey data 
export async function getSurveyData(guid: string) {
  // Get URL
  const baseUrl = process.env.API_GET_SURVEY_URL;
  if (!baseUrl) {
    throw new Error('Missing API_GET_SURVEY_URL env var');
  }
  let url = `${baseUrl}?id=0&surveyGuidId=${encodeURIComponent(guid)}`

  if (process.env.NODE_ENV === 'development') {
    url = baseUrl;
  }

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);

  const json = (await res.json()) as 
    | { message: string }
    | ApiResponse;
  
  // If survey already submitted
  if (
    typeof (json as {message: string}).message === 'string' &&
    (json as {message: string}).message.startsWith('Survey already submitted')
  ) {
    throw new Error('ALREADY_SUBMITTED');
  }

  // If invalid survey 
  if (
    !(json as ApiResponse).data ||
    !Array.isArray((json as ApiResponse).data) ||
    (json as ApiResponse).data.length === 0
  ) {
    throw new Error('INVALID_SURVEY');
  }

  // Normal response
  const { data } = json as ApiResponse;        // ApiResponse
  const surveyData = data[0];
  const questionOptions = JSON.parse(surveyData.QuestionOptionJson);
  return { surveyData, questionOptions };
}

// Submit
export async function submitSurveyResponse(
  payload: SubmitPayload
): Promise<SubmitResponse> {
  const res = await fetch('/api/SubmitSurvey', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Submission failed: ${res.status}`);
  }
  return res.json();
}