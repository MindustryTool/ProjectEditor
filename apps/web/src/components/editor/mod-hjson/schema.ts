import * as v from "valibot"

export const ModHjsonSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, "Name is required")),
  displayName: v.string(),
  author: v.string(),
  description: v.string(),
  version: v.pipe(
    v.string(),
    v.regex(/^\d+\.\d+\.\d+$/, "Must be a valid semver (e.g., '1.0.0')")
  ),
  minGameVersion: v.pipe(
    v.string(),
    v.regex(/^\d+(\.\d+)?$/, "Must be a valid version (e.g., '145' or '7.0')")
  ),
  dependencies: v.array(v.string()),
})

export type ModHjsonData = v.InferOutput<typeof ModHjsonSchema>

export const defaultModHjson: ModHjsonData = {
  name: "",
  displayName: "",
  author: "",
  description: "",
  version: "1.0.0",
  minGameVersion: "145",
  dependencies: [],
}
