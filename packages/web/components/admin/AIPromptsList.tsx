'use client';

import { useState } from 'react';
import { AIPrompt } from '../../lib/admin/ai-prompts';
import AIPromptItem from './AIPromptItem';
import CreatePromptModal from './CreatePromptModal';

export default function AIPromptsList({
  initialPromptsByKey,
}: {
  initialPromptsByKey: Record<string, AIPrompt[]>;
}) {
  const [promptsByKey] = useState(initialPromptsByKey);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredPrompts = Object.entries(promptsByKey).filter(([key]) =>
    key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePromptCreated = () => {
    setIsCreateModalOpen(false);
    window.location.reload();
  };

  const handlePromptUpdate = () => {
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          ➕ Create Prompt
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <span className="text-xl">ℹ️</span>
          <div className="flex-1">
            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
              Prompt Variables
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              Use {'{variable_name}'} syntax in prompts. Variables will be
              automatically extracted and displayed.
            </p>
          </div>
        </div>
      </div>

      {/* Prompts List */}
      <div className="space-y-4">
        {filteredPrompts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No prompts found</p>
          </div>
        ) : (
          filteredPrompts.map(([key, versions]) => (
            <AIPromptItem
              key={key}
              promptKey={key}
              versions={versions}
              onUpdate={handlePromptUpdate}
            />
          ))
        )}
      </div>

      {/* Stats */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {Object.keys(promptsByKey).length} prompt key(s) •{' '}
        {Object.values(promptsByKey).reduce(
          (sum, versions) => sum + versions.length,
          0
        )}{' '}
        total version(s)
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <CreatePromptModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handlePromptCreated}
        />
      )}
    </div>
  );
}
