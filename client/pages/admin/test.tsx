import React, { useState, useEffect } from "react";

export default function AdminTestPage() {
  const [testResult, setTestResult] = useState<string>("");

  const testAuthEndpoint = async () => {
    try {
      const response = await fetch("/api/auth/test");
      const data = await response.json();
      setTestResult(`Auth endpoint test: ${data.message}`);
    } catch (error) {
      setTestResult(`Auth endpoint test failed: ${error}`);
    }
  };

  useEffect(() => {
    testAuthEndpoint();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 w-full">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Test Page</h1>
        <div className="mb-4">
          <p className="text-sm text-gray-600">This page tests if the admin routes are accessible.</p>
        </div>
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <p className="text-sm">{testResult || "Testing..."}</p>
        </div>
        <button
          onClick={testAuthEndpoint}
          className="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-opacity-90 transition"
        >
          Test Again
        </button>
        <div className="mt-4 text-xs text-gray-500">
          <p>Current URL: {window.location.href}</p>
          <p>Admin login should be at: /admin</p>
        </div>
      </div>
    </div>
  );
} 