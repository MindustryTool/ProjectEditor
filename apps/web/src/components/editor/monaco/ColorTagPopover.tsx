import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerSelection,
} from "~/components/ui/color-picker";
import { COLOR_NAMES, MINDUSTRY_COLORS } from "~/lib/monaco/colorTags";
import type { ActiveColorTagState } from "./useColorTagPicker";

interface ColorTagPopoverProps {
  activeColorTag: ActiveColorTagState;
  onNamedColorPick: (name: keyof typeof MINDUSTRY_COLORS) => void;
  onCustomColorPick: (color: string) => void;
}

export function ColorTagPopover({ activeColorTag, onNamedColorPick, onCustomColorPick }: ColorTagPopoverProps) {
  return (
    <div
      className="absolute z-20 w-64 rounded-md border border-border bg-background p-3 shadow-lg"
      style={{
        top: activeColorTag.top,
        left: Math.max(8, activeColorTag.left),
      }}
    >
      <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
        <span>{activeColorTag.text}</span>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="h-7 w-9 cursor-pointer rounded border border-border bg-transparent p-0"
              style={{ backgroundColor: activeColorTag.pickerColor }}
            />
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" side="bottom" align="start">
            <ColorPicker value={activeColorTag.pickerColor} onChange={(val) => onCustomColorPick(val)}>
              <ColorPickerSelection className="h-40 rounded-lg" />
              <ColorPickerHue />
              <ColorPickerAlpha />
              <ColorPickerFormat />
            </ColorPicker>
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {COLOR_NAMES.map((name) => (
          <button
            key={name}
            type="button"
            className="h-8 rounded border border-border"
            style={{ backgroundColor: MINDUSTRY_COLORS[name] }}
            title={name}
            onClick={() => onNamedColorPick(name)}
          />
        ))}
      </div>
    </div>
  );
}
