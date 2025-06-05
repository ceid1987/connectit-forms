// src/app/not-found.tsx

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          404: Page Not Found
        </h1>
        <p className="text-gray-700">
          The page you’re looking for doesn’t exist.
        </p>
      </div>
    </div>
  );
}
