import { NextResponse } from 'next/server';

// This simulates the API response as shown in the .docx file
const apiRespSimulation = {
  "data": [
    {
      "TransactionGuidId": "119D63FA-16C8-4611-805D-06C45C3DDBC2",
      "Pointofcontact": "Carl",
      "SurveyId": 3042,
      "WelocomeNote": "Dear valuable Customer,\nPlease fill this survey to know how satisfied you are with our support and to improve ourselves to support you in more efficient way.",
      "QuestionOptionJson": JSON.stringify({
        "questions": [
          {
            "questionText": "How long has your organization been a customer of our company?",
            "inputType": "radio",
            "isRequired": true,
            "answerOptions": [
              "Less than a year",
              "1-3 years",
              "3-5 years",
              "More than 5 years"
            ]
          },
          {
            "questionText": "How well do our products meet your needs?",
            "inputType": "radio",
            "isRequired": true,
            "answerOptions": [
              "Extremely well",
              "Very well",
              "Somewhat well",
              "Not so well",
              "Not at all well"
            ]
          },
          {
            "questionText": "How responsive have we been to your questions, concerns or issues?",
            "inputType": "radio",
            "isRequired": true,
            "answerOptions": [
              "Extremely responsive",
              "Very responsive",
              "Somewhat responsive",
              "Not so responsive",
              "Not at all responsive"
            ]
          },
          {
            "questionText": "How well do you trust our engineers to answer or resolve your questions/issues?",
            "inputType": "radio",
            "isRequired": true,
            "answerOptions": [
              "Extremely well",
              "Very well",
              "Somewhat well",
              "Not so well",
              "Not at all well"
            ]
          },
          {
            "questionText": "How would you rate the quality of our services?",
            "inputType": "radio",
            "isRequired": true,
            "answerOptions": [
              "Excellent",
              "Above average",
              "Average",
              "Below average",
              "Poor"
            ]
          },
          {
            "questionText": "How would you rate the value for money of our services?",
            "inputType": "radio",
            "isRequired": true,
            "answerOptions": [
              "Excellent",
              "Above average",
              "Average",
              "Below average",
              "Poor"
            ]
          },
          {
            "questionText": "Overall, how satisfied are you with our services and company?",
            "inputType": "radio",
            "isRequired": true,
            "answerOptions": [
              "Extremely satisfied",
              "Very satisfied",
              "Neither satisfied nor dissatisfied",
              "Not so satisfied",
              "Not at all satisfied"
            ]
          },
          {
            "questionText": "How likely are you to continue doing business with us in the future?",
            "inputType": "radio",
            "isRequired": true,
            "answerOptions": [
              "Extremely likely",
              "Very likely",
              "Somewhat likely",
              "Not so likely",
              "Not at all likely"
            ]
          },
          {
            "questionText": "Which device do you use for our service",
            "inputType": "checkbox",
            "isRequired": false,
            "answerOptions": [
              "Mobile",
              "Tablet",
              "Desktop"
            ]
          },
          {
            "questionText": "Please enter your location",
            "inputType": "text",
            "isRequired": false,
            "answerOptions": []
          },
          {
            "questionText": "Do you require any improvement in our survey app?",
            "inputType": "radio",
            "isRequired": true,
            "answerOptions": [
              "Yes",
              "No"
            ]
          }
        ]
      }),
      "SurveyName": "Survey for Carl Internship",
      "RatingQuestion": "How likely are you to recommend our company to a friend or colleague?",
      "ratingStar": 10,
      "total_records": 1
    }
  ]
};

/**
 * Method to get survey questions
 * This simulates the API endpoint described in the .docx file
 */
const GetSurveyQuestion = () => {
  console.log('Getting survey questions');
  
  // Return the simulated response
  return apiRespSimulation;
};

export async function GET() {
  try {
    // Get the survey data using the function that would call the API
    const surveyData = GetSurveyQuestion();
    
    // Return the response
    return NextResponse.json(surveyData);
  } catch (error) {
    console.error('Error fetching survey data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch survey data' },
      { status: 500 }
    );
  }
}