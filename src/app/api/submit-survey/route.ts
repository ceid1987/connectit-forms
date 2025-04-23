import { NextResponse } from 'next/server';

// In-memory storage for survey submissions (for development purposes)
// In a real application, you would use a database
const surveySubmissions: any[] = [];

export async function POST(request: Request) {
  try {
    // Parse the request body
    const data = await request.json();
    
    // Add a unique ID and submission time to the data
    const submission = {
      id: `submission_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      submittedAt: new Date().toISOString(),
      ...data
    };
    
    // Store the submission in our in-memory array
    surveySubmissions.push(submission);
    
    // Log the submission data
    console.log('Survey submission received:', submission);
    console.log(`Total submissions: ${surveySubmissions.length}`);
    
    // Return a success response with the received data
    return NextResponse.json({ 
      success: true, 
      message: 'Survey submitted successfully',
      receivedData: data,
      submissionId: submission.id
    });
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
    return NextResponse.json({ 
      success: true,
      count: surveySubmissions.length,
      submissions: surveySubmissions 
    });
  } catch (error) {
    console.error('Error retrieving survey submissions:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to retrieve survey submissions' 
      },
      { status: 500 }
    );
  }
}