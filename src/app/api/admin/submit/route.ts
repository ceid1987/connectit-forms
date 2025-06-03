// src/app/api/admin/submit/route.ts
/**
  survey submission processing,
  stores submissions in-memory for development,
  formats the response payload,
  provides a GET endpoint to retrieve formatted submissions
*/

import { NextResponse } from 'next/server';
import {
  SurveyData,
  QuestionOptions,
  Question,
  QuestionResponse,
  SubmitResponse,
} from '@/types/survey';

// Raw response shape
interface SurveyResponses {
  [key: string]: string | string[] | number | undefined;
  comments?: string;
  rating?: number;
}

// Stored submission shape
interface StoredSubmission {
  id: string;
  submittedAt: string;          // ISO timestamp when we stored it
  surveyData: SurveyData;
  questionOptions: QuestionOptions;
  surveyResponses: SurveyResponses;
  startTime: string;            // from the client
}

// In-memory array of stored submissions
const surveySubmissions: StoredSubmission[] = [];

// POST: Handle incoming survey submissions
export async function POST(request: Request) {
  try {
    // Parse and type‐cast the incoming body
    const data = (await request.json()) as {
      surveyData: SurveyData;
      questionOptions: QuestionOptions;
      surveyResponses: SurveyResponses;
      startTime: string;
    };
    const { surveyData, questionOptions, surveyResponses, startTime } = data;

    // Generate a unique ID and timestamp for this submission
    const id = `submission_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    const submittedAt = new Date().toISOString();

    // Build our StoredSubmission object
    const submission: StoredSubmission = {
      id,
      submittedAt,
      surveyData,
      questionOptions,
      surveyResponses,
      startTime,
    };

    // Save it in-memory
    surveySubmissions.push(submission);

    console.log('Survey submission received:', submission);
    console.log(`Total submissions: ${surveySubmissions.length}`);

    // Build the formatted response payload
    const endTime = formatDate(new Date(submittedAt));

    const questions: QuestionResponse[] = questionOptions.questions.map(
      (q: Question, idx: number) => ({
        answerOptions: q.answerOptions,
        inputType: q.inputType,
        isRequired: q.isRequired,
        questionText: q.questionText,
        userResponse: Array.isArray(surveyResponses[`question_${idx}`])
          ? (surveyResponses[`question_${idx}`] as string[]).join(', ')
          : (surveyResponses[`question_${idx}`] as string) || '',
      })
    );

    const payload: SubmitResponse = {
      comments: surveyResponses.comments || '',
      endTime,
      questions,
      ratingQuestion: surveyData.RatingQuestion,
      startTime,
      transactionguidid: id,
      userRating: surveyResponses.rating || 0,
    };

    console.log('Formatted response payload:', payload);
    return NextResponse.json(payload);
  } catch (error) {
    console.error('Error processing survey submission:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process survey submission',
      },
      { status: 500 }
    );
  }
}

// GET: Return all formatted submissions (for testing/dev)
export async function GET() {
  try {
    // Map each stored submission into the same formatted shape
    const processed: SubmitResponse[] = surveySubmissions.map((s) => {
      const { surveyData, questionOptions, surveyResponses, startTime, id, submittedAt } = s;
      const endTime = formatDate(new Date(submittedAt));

      const questions: QuestionResponse[] = questionOptions.questions.map(
        (q: Question, i: number) => ({
          answerOptions: q.answerOptions,
          inputType: q.inputType,
          isRequired: q.isRequired,
          questionText: q.questionText,
          userResponse: Array.isArray(surveyResponses[`question_${i}`])
            ? (surveyResponses[`question_${i}`] as string[]).join(', ')
            : (surveyResponses[`question_${i}`] as string) || '',
        })
      );

      return {
        comments: surveyResponses.comments || '',
        endTime,
        questions,
        ratingQuestion: surveyData.RatingQuestion,
        startTime,
        transactionguidid: id,
        userRating: surveyResponses.rating || 0,
      };
    });

    return NextResponse.json(processed);
  } catch (error) {
    console.error('Error retrieving survey submissions:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve survey submissions' },
      { status: 500 }
    );
  }
}

// Helper to format dates as “YYYY-MM-DD HH:MM:SS”
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
