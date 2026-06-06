import React from "react";
import { useTranslation } from "react-i18next";

export const FieldCategory = React.memo(function FieldCategory({ category }: { category: string }) {
	const { t } = useTranslation();
	const _t = t as (key: string) => string;

	return (
		<div className="text-foreground col-span-full mb-4 text-sm font-bold tracking-widest uppercase first:mt-0">
			{_t(category)}
		</div>
	);
});
