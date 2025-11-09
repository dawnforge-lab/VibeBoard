import { supabase } from '../supabase';
import { logAdminAction } from './auth';

export type TemplateCategory = 'ui' | 'email' | 'error' | 'notification';
export type Language = 'en' | 'es' | 'fr';

export interface ContentTemplate {
  id: string;
  key: string;
  category: TemplateCategory;
  content: Record<Language, string>;
  variables: string[];
  description: string | null;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

export async function getAllTemplates(): Promise<ContentTemplate[]> {
  const { data, error } = await supabase
    .from('content_templates')
    .select('*')
    .order('category', { ascending: true })
    .order('key', { ascending: true });

  if (error) {
    console.error('Error fetching content templates:', error);
    return [];
  }

  return data || [];
}

export async function getTemplate(
  key: string
): Promise<ContentTemplate | null> {
  const { data, error } = await supabase
    .from('content_templates')
    .select('*')
    .eq('key', key)
    .single();

  if (error) {
    console.error(`Error fetching template ${key}:`, error);
    return null;
  }

  return data;
}

export async function getTemplatesByCategory(
  category: TemplateCategory
): Promise<ContentTemplate[]> {
  const { data, error } = await supabase
    .from('content_templates')
    .select('*')
    .eq('category', category)
    .order('key', { ascending: true });

  if (error) {
    console.error(`Error fetching templates for category ${category}:`, error);
    return [];
  }

  return data || [];
}

export async function createTemplate(
  key: string,
  category: TemplateCategory,
  content: Record<Language, string>,
  options?: {
    variables?: string[];
    description?: string;
  }
): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('content_templates')
    .insert({
      key,
      category,
      content,
      variables: options?.variables ?? [],
      description: options?.description ?? null,
      updated_by: user?.id,
    })
    .select('id')
    .single();

  if (error) {
    console.error(`Error creating template ${key}:`, error);
    return null;
  }

  await logAdminAction('create', 'content_templates', key, null, {
    key,
    category,
  });

  return data.id;
}

export async function updateTemplate(
  id: string,
  updates: Partial<
    Pick<ContentTemplate, 'content' | 'variables' | 'description' | 'category'>
  >
): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: oldTemplate } = await supabase
    .from('content_templates')
    .select('*')
    .eq('id', id)
    .single();

  const { error } = await supabase
    .from('content_templates')
    .update({
      ...updates,
      updated_by: user?.id,
    })
    .eq('id', id);

  if (error) {
    console.error(`Error updating template ${id}:`, error);
    return false;
  }

  await logAdminAction('update', 'content_templates', id, oldTemplate, {
    ...oldTemplate,
    ...updates,
  });

  return true;
}

export async function deleteTemplate(id: string): Promise<boolean> {
  const { data: oldTemplate } = await supabase
    .from('content_templates')
    .select('*')
    .eq('id', id)
    .single();

  const { error } = await supabase
    .from('content_templates')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting template ${id}:`, error);
    return false;
  }

  await logAdminAction('delete', 'content_templates', id, oldTemplate, null);

  return true;
}

// Client-side template fetching
export async function getTemplateContent(
  key: string,
  lang: Language = 'en'
): Promise<string | null> {
  const template = await getTemplate(key);

  if (!template) {
    console.warn(`Template ${key} not found`);
    return null;
  }

  return template.content[lang] || template.content.en || null;
}

// Extract variables from template content
export function extractTemplateVariables(content: string): string[] {
  const regex = /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g;
  const variables: string[] = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    const variable = match[1];
    if (variable && !variables.includes(variable)) {
      variables.push(variable);
    }
  }

  return variables;
}

// Replace variables in template
export function replaceTemplateVariables(
  content: string,
  variables: Record<string, string>
): string {
  let result = content;

  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }

  return result;
}

// Export templates as JSON
export function exportTemplatesAsJSON(templates: ContentTemplate[]): string {
  return JSON.stringify(templates, null, 2);
}

// Import templates from JSON
export async function importTemplatesFromJSON(
  jsonContent: string
): Promise<{ success: number; failed: number }> {
  try {
    const templates = JSON.parse(jsonContent) as ContentTemplate[];
    let success = 0;
    let failed = 0;

    for (const template of templates) {
      const existing = await getTemplate(template.key);

      if (existing) {
        // Update existing template
        const updated = await updateTemplate(existing.id, {
          content: template.content,
          variables: template.variables,
          description: template.description ?? undefined,
          category: template.category,
        });
        if (updated) {
          success++;
        } else {
          failed++;
        }
      } else {
        // Create new template
        const id = await createTemplate(
          template.key,
          template.category,
          template.content,
          {
            variables: template.variables,
            description: template.description ?? undefined,
          }
        );
        if (id) {
          success++;
        } else {
          failed++;
        }
      }
    }

    return { success, failed };
  } catch (error) {
    console.error('Error importing templates:', error);
    return { success: 0, failed: 0 };
  }
}
