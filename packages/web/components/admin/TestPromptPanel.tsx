'use client';

import { useState } from 'react';
import { AIModel, replaceVariables } from '../../lib/admin/ai-prompts';

export default function TestPromptPanel({
  promptText,
  model,
  temperature,
  maxTokens,
  variables,
}: {
  promptText: string;
  model: AIModel;
  temperature: number;
  maxTokens: number;
  variables: string[];
}) {
  const [variableValues, setVariableValues] = useState<Record<string, string>>(
    variables.reduce((acc, v) => ({ ...acc, [v]: '' }), {})
  );
  const [testResult, setTestResult] = useState<string>('');
  const [isTesting, setIsTesting] = useState(false);

  const handleVariableChange = (variable: string, value: string) => {
    setVariableValues((prev) => ({ ...prev, [variable]: value }));
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult('');

    try {
      const filledPrompt = replaceVariables(promptText, variableValues);

      // Simulate API call (in production, this would call the actual AI API)
      // For now, just show the filled prompt
      setTestResult(
        `[Test Mode - Actual AI call not implemented]\n\nFilled Prompt:\n${filledPrompt}\n\nModel: ${model}\nTemperature: ${temperature}\nMax Tokens: ${maxTokens}\n\n(In production, this would send the prompt to ${model} and display the response here)`
      );
    } catch (error) {
      console.error('Error testing prompt:', error);
      setTestResult('Error testing prompt');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        🧪 Test Prompt
      </h3>

      {/* Variable Inputs */}
      {variables.length > 0 && (
        <div className="space-y-3 mb-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Fill in test values:
          </p>
          {variables.map((variable) => (
            <div key={variable}>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                {'{'}
                {variable}
                {'}'}
              </label>
              <input
                type="text"
                value={variableValues[variable]}
                onChange={(e) => handleVariableChange(variable, e.target.value)}
                placeholder={`Enter ${variable}...`}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>
      )}

      {/* Test Button */}
      <button
        onClick={handleTest}
        disabled={
          isTesting ||
          variables.some(
            (v) => !variableValues[v] || variableValues[v].trim() === ''
          )
        }
        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
      >
        {isTesting ? 'Testing...' : '▶️ Run Test'}
      </button>

      {/* Preview of Filled Prompt */}
      {Object.values(variableValues).some((v) => v) && (
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
            Preview (with variables filled):
          </p>
          <pre className="text-xs bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto text-gray-900 dark:text-white whitespace-pre-wrap">
            {replaceVariables(promptText, variableValues)}
          </pre>
        </div>
      )}

      {/* Test Result */}
      {testResult && (
        <div>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
            Test Result:
          </p>
          <pre className="text-xs bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto text-gray-900 dark:text-white whitespace-pre-wrap max-h-96">
            {testResult}
          </pre>
        </div>
      )}

      {!testResult && !isTesting && (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Fill in the variables and click &quot;Run Test&quot; to preview the
            prompt
          </p>
        </div>
      )}
    </div>
  );
}
