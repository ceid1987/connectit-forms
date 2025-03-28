// Form component to render the survey questions and handle form submission
'use client';

import React, { useState } from 'react';
import { QuestionOptions, SurveyData } from '@/types/survey';
import { submitSurveyResponse } from '@/services/surveyService';

interface SurveyFormProps {
  surveyData: SurveyData;
  questionOptions: QuestionOptions;
}

const SurveyForm: React.FC<SurveyFormProps> = ({ surveyData, questionOptions }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (questionIndex: number, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [`question_${questionIndex}`]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Submit the form data to the API
      await submitSurveyResponse(formData);
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('An error occurred while submitting the survey. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="bg-white border border-purple-200 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-purple-800 mb-4">Thank You!</h2>
        <p className="text-lg mb-6">Your survey response has been submitted successfully.</p>
        <p>We appreciate your feedback and will use it to improve our services.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-purple-200 rounded-lg">
      <div className="text-center p-6 border-b border-purple-100">
        <h1 className="text-2xl font-bold text-purple-800 mb-4">{surveyData.SurveyName}</h1>
        <h2 className="text-lg font-semibold mb-2">Welcome, {surveyData.Pointofcontact}!</h2>
        <p className="whitespace-pre-line text-gray-700">{surveyData.WelocomeNote}</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {questionOptions.questions.map((question, index) => (
          <div key={index} className="mb-8 pb-4 border-b border-gray-100">
            <label className="block mb-3 font-medium">
              {index + 1}. {question.questionText} {question.isRequired && <span className="text-red-500">*</span>}
            </label>

            {question.inputType === 'radio' && (
              <div className="space-y-2 ml-1">
                {question.answerOptions.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center my-2">
                    <input
                      type="radio"
                      id={`question_${index}_option_${optionIndex}`}
                      name={`question_${index}`}
                      value={option}
                      required={question.isRequired}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      className="mr-3 h-4 w-4"
                    />
                    <label 
                      htmlFor={`question_${index}_option_${optionIndex}`}
                      className="text-gray-800"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            )}

            {question.inputType === 'checkbox' && (
              <div className="space-y-2 ml-1">
                {question.answerOptions.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center my-2">
                    <input
                      type="checkbox"
                      id={`question_${index}_option_${optionIndex}`}
                      name={`question_${index}`}
                      value={option}
                      onChange={(e) => {
                        const currentValues = Array.isArray(formData[`question_${index}`])
                          ? [...formData[`question_${index}`]]
                          : [];
                        
                        if (e.target.checked) {
                          handleInputChange(index, [...currentValues, option]);
                        } else {
                          handleInputChange(
                            index,
                            currentValues.filter(v => v !== option)
                          );
                        }
                      }}
                      className="mr-3 h-4 w-4"
                    />
                    <label 
                      htmlFor={`question_${index}_option_${optionIndex}`}
                      className="text-gray-800"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            )}

            {question.inputType === 'text' && (
              <input
                type="text"
                id={`question_${index}`}
                name={`question_${index}`}
                required={question.isRequired}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Your Answer"
              />
            )}
          </div>
        ))}

        <div className="mb-8 pb-4 border-b border-gray-100">
          <label className="block mb-3 font-medium">
            {surveyData.RatingQuestion} <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            {[...Array(surveyData.ratingStar)].map((_, index) => (
              <button
                key={index}
                type="button"
                className={`text-2xl focus:outline-none ${
                  formData.rating && index < formData.rating
                    ? 'text-black'
                    : 'text-gray-300'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, rating: index + 1 }))}
                aria-label={`Rate ${index + 1} out of ${surveyData.ratingStar}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <label className="block mb-3 font-medium">
            Please enter your additional comments
          </label>
          <textarea
            id="comments"
            name="comments"
            rows={4}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
            placeholder="Enter your comments here..."
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {submitting ? 'Submitting...' : 'Submit Survey'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SurveyForm;