import { cosmiconfig } from 'cosmiconfig';
import { configSchema, type LintPrepushConfig } from './schema.ts';

export async function loadConfig(): Promise<LintPrepushConfig> {
  const explorer = cosmiconfig('lint-prepush');
  const result = await explorer.search();

  if (!result?.config) {
    throw new Error(
      'No lint-prepush configuration found.\n' +
      'Add a "lint-prepush" key to package.json or create a .lint-prepushrc file.'
    );
  }

  const parsed = configSchema.safeParse(result.config);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map(i => `  ${i.path.join('.') || 'root'}: ${i.message}`)
      .join('\n');
    throw new Error(`Invalid lint-prepush configuration:\n${issues}`);
  }

  return parsed.data;
}
