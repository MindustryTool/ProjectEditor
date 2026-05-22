import * as v from "valibot"

export const ProjectFileSchema = v.object({
  path: v.pipe(v.string(), v.minLength(1)),
  content: v.string(),
  size: v.pipe(v.number(), v.minValue(0)),
})

export const ProjectSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  name: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
  files: v.array(ProjectFileSchema),
  createdAt: v.pipe(v.unknown(), v.toDate()),
  updatedAt: v.pipe(v.unknown(), v.toDate()),
})

export const SettingsSchema = v.object({
  theme: v.picklist(["light", "dark", "system"]),
  fontSize: v.pipe(v.number(), v.minValue(8), v.maxValue(32)),
  tabSize: v.pipe(v.number(), v.minValue(1), v.maxValue(8)),
  autoSave: v.boolean(),
  autoSaveDelay: v.pipe(v.number(), v.minValue(500), v.maxValue(10000)),
})
