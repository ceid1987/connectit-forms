// src/app/survey/[guid]/page.tsx
import SurveyForm from '@/components/surveyForm';
import { getSurveyData } from '@/services/surveyService';

export default async function SurveyPage({ params }: { params: { guid: string } }) {
  const { guid } = params;

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
}
