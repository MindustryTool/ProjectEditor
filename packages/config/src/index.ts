export const APP_NAME = "ProjectEditor";

export const SUPPORTED_FILE_EXTENSIONS = [".json", ".zip", ".hjson"] as const;

export const DEFAULT_SETTINGS = {
  theme: "system" as const,
  fontSize: 14,
  tabSize: 2,
  autoSave: true,
  autoSaveDelay: 1000,
};
