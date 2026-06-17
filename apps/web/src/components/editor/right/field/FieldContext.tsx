import React, { createContext, useContext, useMemo } from "react";

interface FieldContextValue {
	name: string;
}

const FieldContext = createContext<FieldContextValue | null>(null);

export function FieldProvider({ name, children }: { name: string; children: React.ReactNode }) {
	const value = useMemo(() => ({ name }), [name]);
	return <FieldContext.Provider value={value}>{children}</FieldContext.Provider>;
}

export function useFieldContext(): FieldContextValue {
	const ctx = useContext(FieldContext);
	if (!ctx) {
		throw new Error("useFieldContext must be used within a FieldProvider");
	}
	return ctx;
}
