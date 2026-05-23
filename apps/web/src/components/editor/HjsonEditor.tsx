export function HjsonEditor({ value, onChange }: { value: string | null; onChange: (value: string) => void }) {
	return <textarea className="resize-none w-full h-full" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
}
