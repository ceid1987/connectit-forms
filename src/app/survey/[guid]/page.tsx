// src/app/survey/[guid]/page.tsx
import SurveyForm from '@/components/surveyForm';
import { getSurveyData } from '@/services/surveyService';

export default async function SurveyPage(props: { params: Promise<{ guid: string }> }) {
  const params = await props.params;
  const { guid } = params;

  try {
    // fetch questions/template for this GUID
    const { surveyData, questionOptions } = await getSurveyData(guid);

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto">
          <SurveyForm
            surveyData={surveyData}
            questionOptions={questionOptions}
            guid={guid}
          />
        </div>
      </div>
    );
  }  catch (err: unknown) {
    // Survey already submitted
    if (err instanceof Error && err.message === 'ALREADY_SUBMITTED') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white border border-red-200 rounded-lg p-8 max-w-md text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              This survey has already been submitted
            </h1>
            <p className="text-gray-700">
              You have already completed this survey. Thank you!
            </p>
          </div>
        </div> 
      );
    }

    // Any other error
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white border border-red-200 rounded-lg p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error: This survey link is no longer valid
          </h1>
          <p className="text-gray-700">
            Please check your link or contact support for assistance.
          </p>
        </div>
      </div>
    );
  }
}