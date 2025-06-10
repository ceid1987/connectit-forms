'use client';

import React, { useState, useMemo } from 'react';
import {
  QuestionOptions,
  SurveyData,
  SubmitResponse,
  SubmitPayload,
} from '@/types/survey';
import { submitSurveyResponse } from '@/services/surveyService';
import styles from './surveyForm.module.css';

type FormData = Record<string, string | string[] | number>;

interface SurveyFormProps {
  surveyData: SurveyData;
  questionOptions: QuestionOptions;
  guid: string;
}

export default function SurveyForm({
  surveyData,
  questionOptions,
}: SurveyFormProps) {
  const [formData, setFormData] = useState<FormData>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmitResponse | null>(null);

  // Capture startTime once
  const startTime = useMemo(() => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return (
      `${now.getFullYear()}-` +
      `${pad(now.getMonth() + 1)}-` +
      `${pad(now.getDate())} ` +
      `${pad(now.getHours())}:` +
      `${pad(now.getMinutes())}:` +
      `${pad(now.getSeconds())}`
    );
  }, []);

  // Helper to format endTime
  const formatDate = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return (
      `${date.getFullYear()}-` +
      `${pad(date.getMonth() + 1)}-` +
      `${pad(date.getDate())} ` +
      `${pad(date.getHours())}:` +
      `${pad(date.getMinutes())}:` +
      `${pad(date.getSeconds())}`
    );
  };

  const ratingIsValid =
    typeof formData.rating === 'number' && (formData.rating as number) >= 1;

  const handleInputChange = (
    questionIndex: number,
    value: string | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [`question_${questionIndex}`]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ratingIsValid) {
      alert('Please choose a rating (minimum 1 star) before submitting.');
      return;
    }

    setSubmitting(true);

    try {
      const endTime = formatDate(new Date());
      const transactionguidid = surveyData.TransactionGuidId;
      const questions = questionOptions.questions.map((q, i) => ({
        answerOptions: q.answerOptions,
        inputType: q.inputType,
        isRequired: q.isRequired,
        questionText: q.questionText,
        userResponse: Array.isArray(formData[`question_${i}`])
          ? (formData[`question_${i}`] as string[]).join(', ')
          : (formData[`question_${i}`] as string) || '',
      }));

      const payload: SubmitPayload = {
        comments: (formData.comments as string) || '',
        endTime,
        questions,
        ratingQuestion: surveyData.RatingQuestion,
        startTime,
        transactionguidid,
        userRating: (formData.rating as number) || 0,
      };

      console.log('Submitting payload:', payload);
      const result = await submitSurveyResponse(payload);

      setSubmissionResult(result);
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert(
        'An error occurred while submitting the survey. Please try again later.'
      );    } finally {
      setSubmitting(false);
    }
  };

  if (submitSuccess && submissionResult) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="bg-white border border-green-500/40 rounded-lg p-8 max-w-md w-full">
          <div className="flex justify-center mb-4">
            <span className={`text-3xl ${styles.thumbsUpAnimation}`}>
              👍
            </span>
          </div>
          <h2 className="text-2xl font-bold text-green-600 text-center mb-4">
            Thank You!
          </h2>
          <p className="text-lg mb-6 text-center">
            Your survey response has been submitted successfully.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white border border-[#551132]/20 rounded-lg">
      <div className="text-left p-6 border-b border-[#551132]/10">
        <h1 className="text-center text-2xl font-bold text-[#551132] mb-4">
          {surveyData.SurveyName}
        </h1>
        <h2 className="text-lg font-semibold mb-2">
          Welcome, {surveyData.Pointofcontact}!
        </h2>
        <p className="whitespace-pre-line text-gray-700">
          {surveyData.WelocomeNote}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {questionOptions.questions.map((question, index) => (
          <div
            key={index}
            className="mb-8 pb-4 border-b border-gray-100"
          >
            <label className="block mb-3 font-bold">
              {index + 1}. {question.questionText}{' '}
              {question.isRequired && (
                <span className="text-red-500">*</span>
              )}
            </label>

            {question.inputType === 'radio' && (
              <div className="space-y-2 ml-1">
                {question.answerOptions.map((option, optIdx) => (
                  <div
                    key={optIdx}
                    className="flex items-center my-2"
                  >                    <input
                      type="radio"
                      id={`question_${index}_option_${optIdx}`}
                      name={`question_${index}`}
                      value={option}
                      required={question.isRequired}
                      onChange={(e) =>
                        handleInputChange(index, e.target.value)
                      }
                      className={`mr-3 ${styles.customRadio}`}
                    />
                    <label
                      htmlFor={`question_${index}_option_${optIdx}`}
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
                {question.answerOptions.map((option, optIdx) => (
                  <div
                    key={optIdx}
                    className="flex items-center my-2"
                  >                    <input
                      type="checkbox"
                      id={`question_${index}_option_${optIdx}`}
                      name={`question_${index}`}
                      value={option}
                      onChange={(e) => {
                        const current = Array.isArray(
                          formData[`question_${index}`]
                        )
                          ? [...(formData[
                              `question_${index}`
                            ] as string[])]
                          : [];
                        if (e.target.checked) {
                          handleInputChange(index, [...current, option]);
                        } else {
                          handleInputChange(
                            index,
                            current.filter((v) => v !== option)
                          );
                        }
                      }}
                      className={`mr-3 ${styles.customCheckbox}`}
                    />
                    <label
                      htmlFor={`question_${index}_option_${optIdx}`}
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
                required={question.isRequired}                onChange={(e) =>
                  handleInputChange(index, e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#551132]"
                placeholder="Your Answer"
              />
            )}
          </div>
        ))}

        <div className="mb-8 pb-4 border-b border-gray-100">
          <label className="block mb-3 font-bold">
            {surveyData.RatingQuestion}{' '}
            <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            {[...Array(surveyData.ratingStar)].map((_, i) => (
              <button
                key={i}
                type="button"
                className={`text-2xl focus:outline-none ${
                  formData.rating && i < (formData.rating as number)
                    ? 'text-black'
                    : 'text-gray-300'
                }`}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    rating: i + 1,
                  }))
                }
                aria-label={`Rate ${i + 1}`}
              >
                ★
              </button>
            ))}
          </div>
          {!ratingIsValid && (
            <p className="mt-2 text-sm text-red-600">
              Please select a rating before submitting.
            </p>
          )}
        </div>

        <div className="mb-8">
          <label className="block mb-3 font-bold">
            Please enter your additional comments
          </label>
          <textarea
            id="comments"
            name="comments"            rows={4}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#551132]"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                comments: e.target.value,
              }))
            }
            placeholder="Enter your comments here..."
          />
        </div>        <div className="flex justify-center">
          <button
            type="submit"
            disabled={submitting || !ratingIsValid}
            className="px-6 py-3 bg-[#951e4e] text-white rounded-lg hover:bg-[#951e4e]/90 transition-colors w-full max-w-md focus:outline-none focus:ring-2 focus:ring-[#951e4e] focus:ring-offset-2 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Survey'}
          </button>
        </div>
      </form>
    </div>
  );
}
