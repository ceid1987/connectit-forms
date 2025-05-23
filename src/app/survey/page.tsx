// Survey page
// Loads data from the survey service and renders the survey form
/* Remove comment for testing
import { getSurveyData } from '@/services/surveyService';
import SurveyForm from '@/components/surveyForm';

export default async function SurveyPage() {
  try {
    // Get survey data with default parameters
    const { surveyData, questionOptions } = await getSurveyData();

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 text-sm text-gray-500 flex justify-between">
          </div>
          
          <SurveyForm 
            surveyData={surveyData} 
            questionOptions={questionOptions} 
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading survey:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error loading survey. Please try again later.</p>
      </div>
    );
  }
}
*/