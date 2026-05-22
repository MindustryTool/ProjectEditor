import { useForm } from "@tanstack/react-form"
import * as v from "valibot"
import { useTranslation } from "react-i18next"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import {
  FormField,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "~/components/ui/form"
import { ModHjsonSchema, defaultModHjson, type ModHjsonData } from "./schema"

interface ModHjsonEditorProps {
  initialData?: Partial<ModHjsonData>
}

export function ModHjsonEditor({ initialData }: ModHjsonEditorProps) {
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
      placeholder: "145",
    },
  ]

  return (
    <div className="flex h-full flex-col overflow-auto px-4 py-4">
      <h2 className="mb-4 text-sm font-semibold">mod.hjson</h2>
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
                  <Input
                    name={fieldApi.name}
                    value={fieldApi.state.value ?? ""}
                    onChange={(e) => fieldApi.handleChange(e.target.value as any)}
                    onBlur={fieldApi.handleBlur}
                    placeholder={field.placeholder}
                    aria-invalid={fieldApi.state.meta.errors.length > 0}
                  />
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

        <form.Field name="dependencies">
          {(fieldApi) => (
            <FormField>
              <FormLabel>{t("editor.modHjson.dependencies")}</FormLabel>
              <FormDescription>
                {t("editor.modHjson.dependenciesDescription")}
              </FormDescription>
              <FormControl>
                <Input
                  name={fieldApi.name}
                  value={Array.isArray(fieldApi.state.value) ? fieldApi.state.value.join(", ") : ""}
                  onChange={(e) =>
                    fieldApi.handleChange(
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean) as any
                    )
                  }
                  onBlur={fieldApi.handleBlur}
                  placeholder="mod-a, mod-b"
                  aria-invalid={fieldApi.state.meta.errors.length > 0}
                />
              </FormControl>
              {fieldApi.state.meta.errors.length > 0 && (
                <FormMessage>
                  {fieldApi.state.meta.errors.join(", ")}
                </FormMessage>
              )}
            </FormField>
          )}
        </form.Field>

        <div className="flex gap-2 pt-2">
          <Button type="submit" size="sm">Save</Button>
          <Button type="button" variant="outline" size="sm">Reset</Button>
        </div>
      </form>
    </div>
  )
}
