import { ProjectSchema } from "@project/validation";

export interface Project {
  id: string;
  name: string;
  files: ProjectFile[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectFile {
  path: string;
  content: string;
  size: number;
}

export function createProject(name: string): Project {
  return {
    id: crypto.randomUUID(),
    name,
    files: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function validateProject(data: unknown): Project {
  return ProjectSchema.parse(data) as Project;
}
