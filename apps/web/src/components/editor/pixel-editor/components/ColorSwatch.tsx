import { Popover, PopoverContent, PopoverTrigger } from "#/components/ui/popover";
import { ColorEditor } from "./ColorEditor";

interface ColorSwatchProps {
  color: string;
  onChange: (c: string) => void;
  label: string;
}

export function ColorSwatch({ color, onChange, label }: ColorSwatchProps) {
  return (
    <Popover>
      <PopoverTrigger className="rounded border border-border cursor-pointer overflow-hidden shrink-0 hover:ring-1 hover:ring-ring transition-shadow" style={{ width: 22, height: 22, backgroundColor: color }} title={label} />
      <PopoverContent className="w-72 p-3" side="bottom" align="start">
        <ColorEditor value={color} onChange={onChange} />
      </PopoverContent>
    </Popover>
  );
}
