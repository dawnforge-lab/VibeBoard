import { getAllTemplates } from '../../../lib/admin/content-templates';
import TemplatesList from '../../../components/admin/TemplatesList';

export default async function AdminTemplatesPage() {
  const templates = await getAllTemplates();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Content Templates
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage UI text, error messages, and email templates with
          multi-language support
        </p>
      </div>

      <TemplatesList initialTemplates={templates} />
    </div>
  );
}
