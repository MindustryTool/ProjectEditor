import { z } from "zod";

export const ProjectFileSchema = z.object({
  path: z.string().min(1),
  content: z.string(),
  size: z.number().nonnegative(),
});

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  files: z.array(ProjectFileSchema),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const SettingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  fontSize: z.number().min(8).max(32),
  tabSize: z.number().min(1).max(8),
  autoSave: z.boolean(),
  autoSaveDelay: z.number().min(500).max(10000),
});
