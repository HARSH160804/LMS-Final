/**
 * ⚠️ TEMPORARY DEBUG PAGE - FOR DIAGNOSTIC PURPOSES ONLY
 * 
 * This page provides a UI to test raw fetch calls bypassing all API wrappers.
 * Access at: /debug-fetch
 * 
 * DO NOT USE IN PRODUCTION - DELETE AFTER DEBUGGING
 */

import { useState } from "react";
import debugFetch from "../debug-fetch-test";

const DebugFetch = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("test");

  const runTest = async (testName, testFn) => {
    setLoading(true);
    console.log(`\n🔍 Running: ${testName}`);
    const result = await testFn();
    setResults((prev) => ({
      ...prev,
      [testName]: result,
    }));
    setLoading(false);
    return result;
  };

  const runAllTests = async () => {
    setLoading(true);
    setResults({});
    console.clear();
    console.log("🚀 STARTING ALL DIAGNOSTIC TESTS");
    const allResults = await debugFetch.runAllTests();
    setResults(allResults);
    setLoading(false);
  };

  const clearResults = () => {
    setResults(null);
    console.clear();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                ⚠️ TEMPORARY DEBUG PAGE
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                This page bypasses all API wrappers to test raw fetch calls.
                For diagnostic purposes only. DELETE AFTER DEBUGGING.
              </p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            🔧 Raw Fetch Diagnostic Tool
          </h1>
          <p className="text-gray-600 mb-6">
            Test backend connectivity using raw fetch (no axios, no interceptors, no wrappers)
          </p>

          {/* Test Credentials Input */}
          <div className="mb-6 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-3">Test Credentials</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="test@test.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="password"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={runAllTests}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
            >
              {loading ? "Running Tests..." : "🚀 Run All Tests"}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => runTest("health", debugFetch.testHealthCheck)}
                disabled={loading}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
              >
                Test Health
              </button>
              <button
                onClick={() => runTest("apiHealth", debugFetch.testApiHealthCheck)}
                disabled={loading}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
              >
                Test API Health
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() =>
                  runTest("signinNoCredentials", () =>
                    debugFetch.testRawSignin(email, password)
                  )
                }
                disabled={loading}
                className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400"
              >
                Signin (No Credentials)
              </button>
              <button
                onClick={() =>
                  runTest("signinWithCredentials", () =>
                    debugFetch.testSigninWithCredentials(email, password)
                  )
                }
                disabled={loading}
                className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400"
              >
                Signin (With Credentials)
              </button>
            </div>

            <button
              onClick={() => runTest("options", debugFetch.testOptionsPreflight)}
              disabled={loading}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 disabled:bg-gray-400"
            >
              Test OPTIONS Preflight
            </button>

            <button
              onClick={clearResults}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Clear Results
            </button>
          </div>

          {/* Results Display */}
          {results && (
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">📊 Test Results</h2>
              <div className="space-y-4">
                {Object.entries(results).map(([testName, result]) => (
                  <div
                    key={testName}
                    className={`p-4 rounded-lg border-2 ${
                      result.success
                        ? "bg-green-50 border-green-500"
                        : "bg-red-50 border-red-500"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">
                        {result.success ? "✅" : "❌"} {testName}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          result.success
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {result.success ? "PASS" : "FAIL"}
                      </span>
                    </div>
                    <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded">
            <h3 className="font-semibold text-blue-900 mb-2">
              📝 How to Use
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Click "Run All Tests" to execute all diagnostic tests</li>
              <li>Or click individual test buttons to run specific tests</li>
              <li>Check browser console for detailed logs</li>
              <li>Results will appear below the buttons</li>
              <li>
                Also available in console: <code>window.debugFetch.runAllTests()</code>
              </li>
            </ol>
          </div>

          {/* Expected Outcomes */}
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold text-gray-900 mb-2">
              🎯 Expected Outcomes
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>
                <strong>If health + signin work:</strong> Existing API wrapper/interceptor is broken
              </li>
              <li>
                <strong>If health works but signin fails:</strong> Signin controller logic issue
              </li>
              <li>
                <strong>If both fail:</strong> Frontend build / browser networking issue
              </li>
              <li>
                <strong>If OPTIONS fails:</strong> CORS preflight issue
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugFetch;
