'use client';

import { useState } from 'react';
import {
  ContentTemplate,
  TemplateCategory,
  exportTemplatesAsJSON,
  importTemplatesFromJSON,
} from '../../lib/admin/content-templates';
import TemplateItem from './TemplateItem';
import CreateTemplateModal from './CreateTemplateModal';

export default function TemplatesList({
  initialTemplates,
}: {
  initialTemplates: ContentTemplate[];
}) {
  const [templates] = useState<ContentTemplate[]>(initialTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    TemplateCategory | 'all'
  >('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const categories: Array<TemplateCategory | 'all'> = [
    'all',
    'ui',
    'email',
    'error',
    'notification',
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory =
      selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      template.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleTemplateCreated = () => {
    setIsCreateModalOpen(false);
    window.location.reload();
  };

  const handleTemplateUpdate = () => {
    window.location.reload();
  };

  const handleExport = () => {
    const jsonContent = exportTemplatesAsJSON(templates);
    const blob = new Blob([jsonContent], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `templates-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const content = await file.text();
      const result = await importTemplatesFromJSON(content);

      alert(
        `Import complete: ${result.success} succeeded, ${result.failed} failed`
      );
      window.location.reload();
    } catch (error) {
      console.error('Error importing templates:', error);
      alert('Failed to import templates');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            📥 Export JSON
          </button>
          <label className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer">
            📤 Import JSON
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={isImporting}
              className="hidden"
            />
          </label>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ➕ Create Template
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedCategory === category
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <span className="text-xl">ℹ️</span>
          <div className="flex-1">
            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
              Template Variables
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              Use {'{variable_name}'} syntax in templates. Common variables:
              {'{username}'}, {'{app_name}'}, {'{email}'}, {'{date}'}
            </p>
          </div>
        </div>
      </div>

      {/* Templates List */}
      <div className="space-y-4">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No templates found
            </p>
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <TemplateItem
              key={template.id}
              template={template}
              onUpdate={handleTemplateUpdate}
            />
          ))
        )}
      </div>

      {/* Stats */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Showing {filteredTemplates.length} of {templates.length} templates
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <CreateTemplateModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleTemplateCreated}
        />
      )}
    </div>
  );
}
