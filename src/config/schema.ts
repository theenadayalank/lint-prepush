import { z } from 'zod';

const commandListSchema = z.union([
  z.array(z.string().min(1)).min(1),
  z.object({ concurrent: z.array(z.string().min(1)).min(1) }),
]);

export const configSchema = z.object({
  base: z.string().optional(),
  tasks: z.record(z.string(), commandListSchema),
  verbose: z.boolean().default(false),
});

export type LintPrepushConfig = z.infer<typeof configSchema>;
export type CommandList = z.infer<typeof commandListSchema>;
