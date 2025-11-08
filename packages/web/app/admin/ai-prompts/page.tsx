import { getAllPrompts } from '../../../lib/admin/ai-prompts';
import AIPromptsList from '../../../components/admin/AIPromptsList';

export default async function AdminAIPromptsPage() {
  const prompts = await getAllPrompts();

  // Group prompts by key
  const promptsByKey = prompts.reduce(
    (acc, prompt) => {
      if (!acc[prompt.key]) {
        acc[prompt.key] = [];
      }
      acc[prompt.key].push(prompt);
      return acc;
    },
    {} as Record<string, typeof prompts>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          AI Prompts
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage AI prompts with version control and A/B testing
        </p>
      </div>

      <AIPromptsList initialPromptsByKey={promptsByKey} />
    </div>
  );
}
