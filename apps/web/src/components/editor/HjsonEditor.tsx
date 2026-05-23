export function HjsonEditor({ value, onChange }: { value: string | null; onChange: (value: string) => void }) {
	return (
		<textarea className="resize-none w-full h-full p-1" spellCheck={false} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
	);
}
