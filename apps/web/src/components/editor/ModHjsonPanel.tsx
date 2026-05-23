import { useForm } from "@tanstack/react-form"
import * as v from "valibot"
import { useTranslation } from "react-i18next"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Button } from "~/components/ui/button"
import {
  FormField,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "~/components/ui/form"
import { ModHjsonSchema, ModNameSchema, defaultModHjson, type ModHjsonData } from "@project/validation"

interface ModHjsonEditorProps {
  initialData?: Partial<ModHjsonData>
}

export function ModHjsonPanel({ initialData }: ModHjsonEditorProps) {
  const { t } = useTranslation()
  const form = useForm({
    defaultValues: { ...defaultModHjson, ...initialData },
    onSubmit: async ({ value }) => {
      const result = v.safeParse(ModHjsonSchema, value)
      if (!result.success) {
        return
      }
    },
  })

  const fields: {
    name: keyof ModHjsonData
    label: string
    description: string
    placeholder?: string
  }[] = [
    {
      name: "name",
      label: t("editor.modHjson.name"),
      description: t("editor.modHjson.nameDescription"),
      placeholder: "example-mod",
    },
    {
      name: "displayName",
      label: t("editor.modHjson.displayName"),
      description: t("editor.modHjson.displayNameDescription"),
      placeholder: "Example Mod",
    },
    {
      name: "author",
      label: t("editor.modHjson.author"),
      description: t("editor.modHjson.authorDescription"),
      placeholder: "Author Name",
    },
    {
      name: "description",
      label: t("editor.modHjson.description"),
      description: t("editor.modHjson.descriptionDescription"),
      placeholder: "A brief description...",
    },
    {
      name: "version",
      label: t("editor.modHjson.version"),
      description: t("editor.modHjson.versionDescription"),
      placeholder: "1.0.0",
    },
    {
      name: "minGameVersion",
      label: t("editor.modHjson.minGameVersion"),
      description: t("editor.modHjson.minGameVersionDescription"),
      placeholder: "146",
    },
  ]

  return (
    <div className="flex h-full flex-col overflow-auto px-4 py-4">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="flex flex-col gap-4"
      >
        {fields.map((field) => (
          <form.Field
            key={field.name}
            name={field.name}
            validators={{
              onChange: ({ value }) => {
                const result = v.safeParse(
                  v.pick(ModHjsonSchema, [field.name]),
                  { [field.name]: value } as ModHjsonData
                )
                if (!result.success) {
                  const issue = result.issues[0]
                  return issue ? issue.message : "Invalid"
                }
                return undefined
              },
            }}
          >
            {(fieldApi) => (
              <FormField>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  {field.name === "description" ? (
                    <Textarea
                      name={fieldApi.name}
                      value={fieldApi.state.value ?? ""}
                      onChange={(e) => fieldApi.handleChange(e.target.value as any)}
                      onBlur={fieldApi.handleBlur}
                      placeholder={field.placeholder}
                      aria-invalid={fieldApi.state.meta.errors.length > 0}
                    />
                  ) : (
                    <Input
                      name={fieldApi.name}
                      value={fieldApi.state.value ?? ""}
                      onChange={(e) => fieldApi.handleChange(e.target.value as any)}
                      onBlur={fieldApi.handleBlur}
                      placeholder={field.placeholder}
                      aria-invalid={fieldApi.state.meta.errors.length > 0}
                    />
                  )}
                </FormControl>
                <FormDescription>{field.description}</FormDescription>
                {fieldApi.state.meta.errors.length > 0 && (
                  <FormMessage>
                    {fieldApi.state.meta.errors.join(", ")}
                  </FormMessage>
                )}
              </FormField>
            )}
          </form.Field>
        ))}

        <form.Field
          name="dependencies"
          validators={{
            onChange: ({ value }) => {
              const result = v.safeParse(v.array(ModNameSchema), value)
              if (!result.success) {
                return result.issues[0]?.message ?? "Invalid"
              }
              return undefined
            },
          }}
        >
          {(fieldApi) => {
            const deps = (Array.isArray(fieldApi.state.value) ? fieldApi.state.value : [""]) as string[]

            const updateDep = (index: number, val: string) => {
              const newDeps = [...deps]
              newDeps[index] = val
              fieldApi.handleChange(newDeps as any)
            }

            const addDep = () => {
              fieldApi.handleChange([...deps, ""] as any)
            }

            const removeDep = (index: number) => {
              fieldApi.handleChange(deps.filter((_, i) => i !== index) as any)
            }

            return (
              <FormField>
                <FormLabel>{t("editor.modHjson.dependencies")}</FormLabel>
                <FormDescription>
                  {t("editor.modHjson.dependenciesDescription")}
                </FormDescription>
                <FormControl>
                  <div className="flex flex-col gap-2">
                    {deps.map((dep, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={dep}
                          onChange={(e) => updateDep(index, e.target.value)}
                          placeholder="mod-name"
                          aria-invalid={index < (fieldApi.state.meta.errors.length ? fieldApi.state.value?.length ?? 0 : 0)}
                          className="flex-1"
                        />
                        <Button
                          className="size-9"
                          type="button"
                          variant="outline"
                          onClick={() => removeDep(index)}
                        >
                          X
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addDep}
                    >
                      Add
                    </Button>
                  </div>
                </FormControl>
                {fieldApi.state.meta.errors.length > 0 && (
                  <FormMessage>
                    {fieldApi.state.meta.errors.join(", ")}
                  </FormMessage>
                )}
              </FormField>
            )
          }}
        </form.Field>
      </form>
    </div>
  )
}
