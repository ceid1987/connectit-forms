// src/app/survey/[guid]/page.tsx
import { redirect } from 'next/navigation';

export default async function SurveyPage(props: { params: Promise<{ guid: string }> }) {
  const params = await props.params;
  const { guid } = params;

  // Redirect to the new URL format expected by the platform
  redirect(`/survey/${guid}/prv/0`);
}