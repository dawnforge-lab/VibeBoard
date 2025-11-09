'use client';

import { useState } from 'react';
import {
  updatePrompt,
  AIPrompt,
  AIModel,
  extractVariables,
  estimatePromptCost,
} from '../../lib/admin/ai-prompts';
import TestPromptPanel from './TestPromptPanel';

export default function EditPromptModal({
  prompt,
  onClose,
  onSuccess,
}: {
  prompt: AIPrompt;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [promptText, setPromptText] = useState(prompt.prompt_text);
  const [model, setModel] = useState<AIModel>(prompt.model);
  const [temperature, setTemperature] = useState(prompt.temperature);
  const [maxTokens, setMaxTokens] = useState(prompt.max_tokens);
  const [isActive, setIsActive] = useState(prompt.is_active);
  const [abTestPercentage, setAbTestPercentage] = useState(
    prompt.ab_test_percentage
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [showTestPanel, setShowTestPanel] = useState(false);

  const models: AIModel[] = [
    'gpt-4o',
    'gpt-4o-mini',
    'claude-3-5-sonnet-20241022',
    'claude-3-5-haiku-20241022',
  ];

  const variables = extractVariables(promptText);
  const estimatedCost = estimatePromptCost(model, 500, maxTokens);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const success = await updatePrompt(prompt.id, {
        prompt_text: promptText,
        model,
        temperature,
        max_tokens: maxTokens,
        variables,
        is_active: isActive,
        ab_test_percentage: abTestPercentage,
      });

      if (success) {
        onSuccess();
      } else {
        alert('Failed to update prompt');
      }
    } catch (error) {
      console.error('Error updating prompt:', error);
      alert('Failed to update prompt');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto my-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit AI Prompt
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {prompt.key} • Version {prompt.version}
              </p>
            </div>
            <button
              onClick={() => setShowTestPanel(!showTestPanel)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {showTestPanel ? 'Hide Test Panel' : '🧪 Test Prompt'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Left: Editor */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Prompt Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prompt Text *
              </label>
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                required
                rows={12}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Use {'{variable_name}'} syntax for dynamic values
              </p>
            </div>

            {/* Variables Preview */}
            {variables.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Detected Variables:
                </p>
                <div className="flex flex-wrap gap-2">
                  {variables.map((variable) => (
                    <span
                      key={variable}
                      className="px-2 py-1 text-xs font-mono bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded"
                    >
                      {'{'}
                      {variable}
                      {'}'}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Model */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value as AIModel)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Temperature and Max Tokens */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Temperature: {temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Tokens
                </label>
                <input
                  type="number"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(Number(e.target.value))}
                  min="100"
                  max="4000"
                  step="100"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Cost Estimate */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                💰 Estimated cost: ~${estimatedCost.toFixed(4)}/request (500
                input + {maxTokens} output tokens)
              </p>
            </div>

            {/* A/B Test Percentage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                A/B Test Percentage: {abTestPercentage}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={abTestPercentage}
                onChange={(e) => setAbTestPercentage(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Active Toggle */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isActive ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={isUpdating}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isUpdating}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Right: Test Panel */}
          {showTestPanel && (
            <div>
              <TestPromptPanel
                promptText={promptText}
                model={model}
                temperature={temperature}
                maxTokens={maxTokens}
                variables={variables}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
