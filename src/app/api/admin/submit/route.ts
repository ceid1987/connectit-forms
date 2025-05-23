import { NextResponse } from 'next/server';

// In-memory storage for survey submissions (for development purposes)
// In a real application, you would use a database
const surveySubmissions: any[] = [];

// ——— NEW: helper to format dates as "YYYY-MM-DD HH:MM:SS" ———
function formatDate(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return (
    `${date.getFullYear()}-` +
    `${pad(date.getMonth() + 1)}-` +
    `${pad(date.getDate())} ` +
    `${pad(date.getHours())}:` +
    `${pad(date.getMinutes())}:` +
    `${pad(date.getSeconds())}`
  );
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const data = await request.json();

    // ——— DESTRUCTURE the incoming pieces you need ———
    const { surveyData, questionOptions, surveyResponses, startTime } = data;

    // Add a unique ID and submission time (for storage/logging)
    const submission = {
      id: `submission_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      submittedAt: new Date().toISOString(),
      ...data
    };

    // Store it
    surveySubmissions.push(submission);

    console.log('Survey submission received:', submission);
    console.log(`Total submissions: ${surveySubmissions.length}`);

    // ——— BUILD your new response format ———
    const endTime = formatDate(new Date());
    const questions = questionOptions.questions.map((q: any, idx: number) => ({
      answerOptions: q.answerOptions,
      inputType: q.inputType,
      isRequired: q.isRequired,
      questionText: q.questionText,
      userResponse: Array.isArray(surveyResponses[`question_${idx}`])
        ? surveyResponses[`question_${idx}`].join(', ')
        : surveyResponses[`question_${idx}`] || ''
    }));

    const payload = {
      comments: surveyResponses.comments || '',
      endTime,
      questions,
      ratingQuestion: surveyData.RatingQuestion,
      startTime,
      transactionguidid: submission.id,
      userRating: surveyResponses.rating || 0
    };

    // ——— RETURN exactly the shape you wanted ———
    console.log('Formatted response payload:', payload);
    return NextResponse.json(payload);
  } catch (error) {
    console.error('Error processing survey submission:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process survey submission'
      },
      { status: 500 }
    );
  }
}

// Endpoint to get all submissions (for Postman testing)
export async function GET() {
  try {
    // map each raw submission into your “pretty” payload
    const processed = surveySubmissions.map((s) => {
      const { surveyData, questionOptions, surveyResponses, startTime, id } = s;
      const endTime = formatDate(new Date(s.submittedAt));

      const questions = questionOptions.questions.map((q: any, i: number) => ({
        answerOptions: q.answerOptions,
        inputType:     q.inputType,
        isRequired:    q.isRequired,
        questionText:  q.questionText,
        userResponse: Array.isArray(surveyResponses[`question_${i}`])
          ? surveyResponses[`question_${i}`].join(', ')
          : surveyResponses[`question_${i}`] || ''
      }));

      return {
        comments:          surveyResponses.comments || '',
        endTime,
        questions,
        ratingQuestion:    surveyData.RatingQuestion,
        startTime,         
        transactionguidid: id,
        userRating:        surveyResponses.rating || 0
      };
    });

    return NextResponse.json(processed);
  } catch (error) {
    console.error('Error retrieving submissions:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve survey submissions' },
      { status: 500 }
    );
  }
}