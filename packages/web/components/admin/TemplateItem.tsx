'use client';

import { useState } from 'react';
import {
  ContentTemplate,
  deleteTemplate,
} from '../../lib/admin/content-templates';
import EditTemplateModal from './EditTemplateModal';

export default function TemplateItem({
  template,
  onUpdate,
}: {
  template: ContentTemplate;
  onUpdate: () => void;
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return;
    }

    const success = await deleteTemplate(template.id);
    if (success) {
      onUpdate();
    } else {
      alert('Failed to delete template');
    }
  };

  const categoryColors: Record<string, string> = {
    ui: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    email:
      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    notification:
      'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  };

  const categoryColor =
    categoryColors[template.category] ||
    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {template.key}
              </h3>
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${categoryColor}`}
              >
                {template.category}
              </span>
            </div>

            {template.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {template.description}
              </p>
            )}

            {/* Language Previews */}
            <div className="mt-4 space-y-3">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    🇬🇧 English
                  </span>
                </div>
                <div className="text-sm bg-gray-50 dark:bg-gray-900 p-3 rounded text-gray-900 dark:text-white">
                  {template.content.en.substring(0, 150)}
                  {template.content.en.length > 150 ? '...' : ''}
                </div>
              </div>

              {template.content.es && (
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      🇪🇸 Spanish
                    </span>
                  </div>
                  <div className="text-sm bg-gray-50 dark:bg-gray-900 p-3 rounded text-gray-900 dark:text-white">
                    {template.content.es.substring(0, 150)}
                    {template.content.es.length > 150 ? '...' : ''}
                  </div>
                </div>
              )}

              {template.content.fr && (
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      🇫🇷 French
                    </span>
                  </div>
                  <div className="text-sm bg-gray-50 dark:bg-gray-900 p-3 rounded text-gray-900 dark:text-white">
                    {template.content.fr.substring(0, 150)}
                    {template.content.fr.length > 150 ? '...' : ''}
                  </div>
                </div>
              )}
            </div>

            {/* Variables */}
            {template.variables.length > 0 && (
              <div className="flex items-center space-x-2 mt-4">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Variables:
                </span>
                {template.variables.map((variable) => (
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

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              Last updated: {new Date(template.updated_at).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditTemplateModal
          template={template}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            setIsEditModalOpen(false);
            onUpdate();
          }}
        />
      )}
    </>
  );
}
