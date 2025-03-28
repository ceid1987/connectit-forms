// Survey service to fetch survey data and submit responses
import { ApiResponse, QuestionOptions } from '@/types/survey';

/**
 * Fetches survey data from the API
 */
export async function getSurveyData() {
  try {
    // When using server components, we need to use the absolute URL
    // Get base URL from environment or use a default for local development
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    // Make the API request with the full URL
    const response = await fetch(`${baseUrl}/api/form-data`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Ensures fresh data is fetched each time
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Parse the response
    const responseData: ApiResponse = await response.json();
    
    // Get the first survey data (assuming we only have one)
    const surveyData = responseData.data[0];
    
    // Parse the JSON string to get the questions
    const questionOptions: QuestionOptions = JSON.parse(surveyData.QuestionOptionJson);
    
    return {
      surveyData,
      questionOptions
    };
  } catch (error) {
    console.error('Error fetching survey data:', error);
    throw error;
  }
}

/**
 * Submits survey responses to the API
 * This is currently a placeholder function as submission is not implemented yet
 */
export async function submitSurveyResponse(responses: Record<string, any>) {
  try {
    console.log('Submitting survey responses:', responses);
    
    // For now, just simulate a successful submission
    return { success: true, message: 'Survey submitted successfully' };
  } catch (error) {
    console.error('Error submitting survey:', error);
    throw error;
  }
}