import * as v from "valibot"

export const ModNameSchema = v.pipe(
  v.string(),
  v.regex(/^[a-z][a-z0-9-]*$/, "Must be lowercase letters, digits, and hyphens only")
)

export const ModHjsonSchema = v.object({
  name: ModNameSchema,
  displayName: v.pipe(v.string(), v.minLength(2), v.maxLength(127)),
  author: v.pipe(v.string(), v.minLength(2), v.maxLength(127)),
  description: v.pipe(v.string(), v.maxLength(9999)),
  version: v.pipe(v.string(), v.maxLength(127)),
  minGameVersion: v.pipe(
    v.string(),
    v.check((val) => {
      const num = Number(val)
      return !isNaN(num) && num > 145
    }, "Must be a number greater than 145")
  ),
  dependencies: v.array(ModNameSchema),
  hidden: v.optional(v.boolean()),
})

export type ModHjsonData = v.InferOutput<typeof ModHjsonSchema>

export const defaultModHjson: ModHjsonData = {
  name: "my-hjson-mod",
  displayName: "Cool mod",
  author: "Me",
  description: "",
  version: "1.0.0",
  minGameVersion: "146",
  dependencies: [""],
  hidden: false,
}
