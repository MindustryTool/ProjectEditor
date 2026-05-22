import { ProjectSchema } from "@project/validation"
import * as v from "valibot"

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
  return v.parse(ProjectSchema, data) as Project;
}
