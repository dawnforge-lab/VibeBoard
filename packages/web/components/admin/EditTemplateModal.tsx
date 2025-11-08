'use client';

import { useState } from 'react';
import {
  updateTemplate,
  ContentTemplate,
  TemplateCategory,
  Language,
  extractTemplateVariables,
  replaceTemplateVariables,
} from '../../lib/admin/content-templates';

export default function EditTemplateModal({
  template,
  onClose,
  onSuccess,
}: {
  template: ContentTemplate;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [category, setCategory] = useState<TemplateCategory>(template.category);
  const [description, setDescription] = useState(template.description || '');
  const [contentEn, setContentEn] = useState(template.content.en);
  const [contentEs, setContentEs] = useState(template.content.es || '');
  const [contentFr, setContentFr] = useState(template.content.fr || '');
  const [selectedLang, setSelectedLang] = useState<Language>('en');
  const [isUpdating, setIsUpdating] = useState(false);

  // Test variables
  const [testVariables, setTestVariables] = useState<Record<string, string>>(
    {}
  );

  const categories: TemplateCategory[] = [
    'ui',
    'email',
    'error',
    'notification',
  ];
  const languages: Array<{ code: Language; label: string; flag: string }> = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'es', label: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', label: 'French', flag: '🇫🇷' },
  ];

  const variables = extractTemplateVariables(contentEn);

  const currentContent =
    selectedLang === 'en'
      ? contentEn
      : selectedLang === 'es'
        ? contentEs
        : contentFr;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const content: Record<Language, string> = {
        en: contentEn,
        es: contentEs || contentEn,
        fr: contentFr || contentEn,
      };

      const success = await updateTemplate(template.id, {
        category,
        content,
        variables,
        description: description || undefined,
      });

      if (success) {
        onSuccess();
      } else {
        alert('Failed to update template');
      }
    } catch (error) {
      console.error('Error updating template:', error);
      alert('Failed to update template');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleContentChange = (value: string) => {
    if (selectedLang === 'en') {
      setContentEn(value);
    } else if (selectedLang === 'es') {
      setContentEs(value);
    } else {
      setContentFr(value);
    }
  };

  const handleTestVariableChange = (variable: string, value: string) => {
    setTestVariables((prev) => ({ ...prev, [variable]: value }));
  };

  const previewContent =
    variables.length > 0 && Object.keys(testVariables).length > 0
      ? replaceTemplateVariables(currentContent, testVariables)
      : currentContent;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto my-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Template
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {template.key}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Left: Editor */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as TemplateCategory)
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Language Tabs */}
            <div>
              <div className="flex space-x-2 mb-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setSelectedLang(lang.code)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedLang === lang.code
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {lang.flag} {lang.label}
                  </button>
                ))}
              </div>

              <textarea
                value={currentContent}
                onChange={(e) => handleContentChange(e.target.value)}
                rows={12}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Variables */}
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

          {/* Right: Preview */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              👁️ Preview
            </h3>

            {variables.length > 0 && (
              <div className="space-y-3 mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Test with sample values:
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
                      value={testVariables[variable] || ''}
                      onChange={(e) =>
                        handleTestVariableChange(variable, e.target.value)
                      }
                      placeholder={`Enter ${variable}...`}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                {previewContent || 'No content to preview'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
