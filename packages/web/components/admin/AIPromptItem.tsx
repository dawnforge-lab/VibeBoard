'use client';

import { useState } from 'react';
import {
  AIPrompt,
  activatePromptVersion,
  deletePrompt,
  estimatePromptCost,
} from '../../lib/admin/ai-prompts';
import EditPromptModal from './EditPromptModal';

export default function AIPromptItem({
  promptKey,
  versions,
  onUpdate,
}: {
  promptKey: string;
  versions: AIPrompt[];
  onUpdate: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<AIPrompt | null>(null);

  const activeVersion = versions.find((v) => v.is_active);
  const hasMultipleVersions = versions.length > 1;

  const handleActivateVersion = async (version: number) => {
    const success = await activatePromptVersion(promptKey, version);
    if (success) {
      onUpdate();
    } else {
      alert('Failed to activate prompt version');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prompt version?')) {
      return;
    }

    const success = await deletePrompt(id);
    if (success) {
      onUpdate();
    } else {
      alert('Failed to delete prompt');
    }
  };

  const estimatedCost = activeVersion
    ? estimatePromptCost(activeVersion.model, 500, activeVersion.max_tokens)
    : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {promptKey}
              </h3>
              {activeVersion && (
                <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  v{activeVersion.version} Active
                </span>
              )}
              {hasMultipleVersions && (
                <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                  {versions.length} versions
                </span>
              )}
            </div>
            {activeVersion && (
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{activeVersion.model}</span>
                <span>•</span>
                <span>temp: {activeVersion.temperature}</span>
                <span>•</span>
                <span>max tokens: {activeVersion.max_tokens}</span>
                <span>•</span>
                <span>~${estimatedCost.toFixed(4)}/request</span>
                {activeVersion.ab_test_percentage < 100 && (
                  <>
                    <span>•</span>
                    <span>A/B: {activeVersion.ab_test_percentage}%</span>
                  </>
                )}
              </div>
            )}
            {activeVersion && activeVersion.variables.length > 0 && (
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Variables:
                </span>
                {activeVersion.variables.map((variable) => (
                  <span
                    key={variable}
                    className="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                  >
                    {'{'}
                    {variable}
                    {'}'}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {hasMultipleVersions && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                {isExpanded ? 'Hide Versions' : 'Show Versions'}
              </button>
            )}
            {activeVersion && (
              <button
                onClick={() => setEditingPrompt(activeVersion)}
                className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Active Prompt Preview */}
        {activeVersion && !isExpanded && (
          <div className="mt-4">
            <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded overflow-x-auto text-gray-900 dark:text-white whitespace-pre-wrap">
              {activeVersion.prompt_text.substring(0, 200)}
              {activeVersion.prompt_text.length > 200 ? '...' : ''}
            </pre>
          </div>
        )}
      </div>

      {/* Versions List */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="p-6 space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              All Versions
            </h4>
            {versions.map((version) => (
              <div
                key={version.id}
                className={`p-4 rounded-lg border ${
                  version.is_active
                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      Version {version.version}
                    </span>
                    {version.is_active && (
                      <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {!version.is_active && (
                      <button
                        onClick={() => handleActivateVersion(version.version)}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Activate
                      </button>
                    )}
                    <button
                      onClick={() => setEditingPrompt(version)}
                      className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(version.id)}
                      className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <div>
                    Model: {version.model} • Temp: {version.temperature} • Max
                    tokens: {version.max_tokens}
                  </div>
                  <div>
                    Created: {new Date(version.created_at).toLocaleString()}
                  </div>
                </div>
                <pre className="text-xs bg-white dark:bg-gray-800 p-2 rounded mt-2 overflow-x-auto text-gray-900 dark:text-white whitespace-pre-wrap border border-gray-200 dark:border-gray-700">
                  {version.prompt_text}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingPrompt && (
        <EditPromptModal
          prompt={editingPrompt}
          onClose={() => setEditingPrompt(null)}
          onSuccess={() => {
            setEditingPrompt(null);
            onUpdate();
          }}
        />
      )}
    </div>
  );
}
