import { supabase } from '../supabase';
import { logAdminAction } from './auth';

export type AIModel =
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'claude-3-5-sonnet-20241022'
  | 'claude-3-5-haiku-20241022';

export interface AIPrompt {
  id: string;
  key: string;
  prompt_text: string;
  model: AIModel;
  temperature: number;
  max_tokens: number;
  variables: string[];
  version: number;
  is_active: boolean;
  ab_test_percentage: number;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

export async function getAllPrompts(): Promise<AIPrompt[]> {
  const { data, error } = await supabase
    .from('ai_prompts')
    .select('*')
    .order('key', { ascending: true })
    .order('version', { ascending: false });

  if (error) {
    console.error('Error fetching AI prompts:', error);
    return [];
  }

  return data || [];
}

export async function getPrompt(key: string): Promise<AIPrompt | null> {
  const { data, error } = await supabase
    .from('ai_prompts')
    .select('*')
    .eq('key', key)
    .eq('is_active', true)
    .order('version', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error(`Error fetching AI prompt ${key}:`, error);
    return null;
  }

  return data;
}

export async function getPromptVersions(key: string): Promise<AIPrompt[]> {
  const { data, error } = await supabase
    .from('ai_prompts')
    .select('*')
    .eq('key', key)
    .order('version', { ascending: false });

  if (error) {
    console.error(`Error fetching prompt versions for ${key}:`, error);
    return [];
  }

  return data || [];
}

export async function createPrompt(
  key: string,
  promptText: string,
  model: AIModel,
  options?: {
    temperature?: number;
    maxTokens?: number;
    variables?: string[];
    isActive?: boolean;
    abTestPercentage?: number;
  }
): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get the latest version for this key
  const existingVersions = await getPromptVersions(key);
  const latestVersion =
    existingVersions.length > 0 ? (existingVersions[0]?.version ?? 0) : 0;
  const newVersion = latestVersion + 1;

  const { data, error } = await supabase
    .from('ai_prompts')
    .insert({
      key,
      prompt_text: promptText,
      model,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1000,
      variables: options?.variables ?? [],
      version: newVersion,
      is_active: options?.isActive ?? false,
      ab_test_percentage: options?.abTestPercentage ?? 100,
      updated_by: user?.id,
    })
    .select('id')
    .single();

  if (error) {
    console.error(`Error creating AI prompt ${key}:`, error);
    return null;
  }

  await logAdminAction('create', 'ai_prompts', key, null, {
    key,
    version: newVersion,
    model,
  });

  return data.id;
}

export async function updatePrompt(
  id: string,
  updates: Partial<
    Pick<
      AIPrompt,
      | 'prompt_text'
      | 'model'
      | 'temperature'
      | 'max_tokens'
      | 'variables'
      | 'is_active'
      | 'ab_test_percentage'
    >
  >
): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: oldPrompt } = await supabase
    .from('ai_prompts')
    .select('*')
    .eq('id', id)
    .single();

  const { error } = await supabase
    .from('ai_prompts')
    .update({
      ...updates,
      updated_by: user?.id,
    })
    .eq('id', id);

  if (error) {
    console.error(`Error updating AI prompt ${id}:`, error);
    return false;
  }

  await logAdminAction('update', 'ai_prompts', id, oldPrompt, {
    ...oldPrompt,
    ...updates,
  });

  return true;
}

export async function activatePromptVersion(
  key: string,
  version: number
): Promise<boolean> {
  // Deactivate all versions of this key first
  await supabase.from('ai_prompts').update({ is_active: false }).eq('key', key);

  // Activate the specified version
  const { error } = await supabase
    .from('ai_prompts')
    .update({ is_active: true })
    .eq('key', key)
    .eq('version', version);

  if (error) {
    console.error(`Error activating prompt version ${key} v${version}:`, error);
    return false;
  }

  await logAdminAction(
    'activate',
    'ai_prompts',
    key,
    { version: 'previous' },
    { version }
  );

  return true;
}

export async function deletePrompt(id: string): Promise<boolean> {
  const { data: oldPrompt } = await supabase
    .from('ai_prompts')
    .select('*')
    .eq('id', id)
    .single();

  const { error } = await supabase.from('ai_prompts').delete().eq('id', id);

  if (error) {
    console.error(`Error deleting AI prompt ${id}:`, error);
    return false;
  }

  await logAdminAction('delete', 'ai_prompts', id, oldPrompt, null);

  return true;
}

// Client-side prompt fetching with A/B testing
export async function getActivePrompt(key: string): Promise<AIPrompt | null> {
  // Get all active prompts for this key
  const { data, error } = await supabase
    .from('ai_prompts')
    .select('*')
    .eq('key', key)
    .eq('is_active', true)
    .order('ab_test_percentage', { ascending: false });

  if (error || !data || data.length === 0) {
    console.error(`Error fetching active prompt ${key}:`, error);
    return null;
  }

  // If only one active prompt, return it
  if (data.length === 1) {
    return data[0];
  }

  // A/B testing: select prompt based on percentage
  const random = Math.random() * 100;
  let cumulative = 0;

  for (const prompt of data) {
    cumulative += prompt.ab_test_percentage;
    if (random <= cumulative) {
      return prompt;
    }
  }

  // Fallback to first prompt
  return data[0];
}

// Cost estimation (approximate)
export function estimatePromptCost(
  model: AIModel,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing: Record<AIModel, { input: number; output: number }> = {
    'gpt-4o': { input: 2.5 / 1_000_000, output: 10 / 1_000_000 }, // $2.50 per 1M input, $10 per 1M output
    'gpt-4o-mini': { input: 0.15 / 1_000_000, output: 0.6 / 1_000_000 },
    'claude-3-5-sonnet-20241022': {
      input: 3 / 1_000_000,
      output: 15 / 1_000_000,
    },
    'claude-3-5-haiku-20241022': {
      input: 0.8 / 1_000_000,
      output: 4 / 1_000_000,
    },
  };

  const cost = pricing[model];
  return inputTokens * cost.input + outputTokens * cost.output;
}

// Extract variables from prompt text
export function extractVariables(promptText: string): string[] {
  const regex = /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g;
  const variables: string[] = [];
  let match;

  while ((match = regex.exec(promptText)) !== null) {
    const variable = match[1];
    if (variable && !variables.includes(variable)) {
      variables.push(variable);
    }
  }

  return variables;
}

// Replace variables in prompt
export function replaceVariables(
  promptText: string,
  variables: Record<string, string>
): string {
  let result = promptText;

  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }

  return result;
}
