import { z } from 'zod';
export const _ToolSchema = z.object({
  name: z.string(),
  description: z.string(),
  inputSchema: z.any(),
});
export type ToolSchema = z.infer<typeof _ToolSchema>;
export abstract class Tool {
  constructor() {
    this.init();
  }
  toolSchema!: ToolSchema;
  abstract init(): void;
  abstract execute(input: any): Promise<any>;
}
