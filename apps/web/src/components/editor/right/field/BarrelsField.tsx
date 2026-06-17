import { FieldControl, Field } from "#/components/editor/right/field/Field";
import { Input } from "#/components/ui/input";
import React, { useCallback } from "react";
import { FieldIssue } from "./FieldIssue";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import { handleNumber, type SchemaRendererProps } from "#/components/editor/right/field/types";
import { EMPTY_ARRAY } from "#/lib/utils";
import { FieldLabel } from "#/components/ui/field";
import { Button } from "#/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "#/components/ui/alert-dialog";

export const BarrelsField = React.memo(function BarrelsField({ name, value, onChange, jsonPath, path, metadata }: SchemaRendererProps) {
	const array = Array.isArray(value) ? value : EMPTY_ARRAY;
	const items = Math.trunc(array.length / 3);

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>, index: number) => {
			const newValue = [...array];
			const itemIndex = Math.trunc(index / 3);

			newValue[itemIndex * 3] = array[itemIndex * 3];
			newValue[itemIndex * 3 + 1] = array[itemIndex * 3 + 1];
			newValue[itemIndex * 3 + 2] = array[itemIndex * 3 + 2];

			newValue[index] = handleNumber(event);

			onChange(jsonPath, (parent, original, key) => parent.patchValue(original, key, newValue));
		},
		[array, jsonPath, onChange],
	);

	const handleAdd = useCallback(() => {
		const newValue = [...array];
		newValue.push(0);
		while (newValue.length % 3 !== 0) {
			newValue.push(0);
		}
		onChange(jsonPath, (parent, original, key) => parent.patchValue(original, key, newValue));
	}, [array, jsonPath, onChange]);

	const handleDelete = useCallback(
		(index: number) => {
			const newValue = array.filter((_, i) => Math.trunc(i / 3) !== index);
			onChange(jsonPath, (parent, original, key) => parent.patchValue(original, key, newValue));
		},
		[array, jsonPath, onChange],
	);

	return (
		<Field jsonPath={jsonPath} metadata={metadata}>
			<SchemaLabel name={name} metadata={metadata} />
			<FieldControl className="grid gap-2">
				{Array.from({ length: items }).map((_, index) => (
					<div className="flex flex-wrap gap-1 bg-muted rounded-md p-2 border" key={index}>
						<div className="space-y-1 flex-1">
							<FieldLabel>X</FieldLabel>
							<Input value={array[index * 3] ?? 0} onChange={(event) => handleChange(event, index * 3)} />
						</div>
						<div className="space-y-1 flex-1">
							<FieldLabel>Y</FieldLabel>
							<Input value={array[index * 3 + 1] ?? 0} onChange={(event) => handleChange(event, index * 3 + 1)} />
						</div>
						<div className="space-y-1 flex-1">
							<FieldLabel>Rotation</FieldLabel>
							<Input value={array[index * 3 + 2] ?? 0} onChange={(event) => handleChange(event, index * 3 + 2)} />
						</div>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button className="w-full" variant="destructive">
									<Trash2 />
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogTitle>Are you sure you want to delete this barrel?</AlertDialogTitle>
								<AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction asChild>
										<Button
											variant="destructive"
											onClick={() => {
												handleDelete(index);
											}}
										>
											Delete
										</Button>
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				))}
				<Button className="w-full" variant="outline" onClick={handleAdd}>
					<Plus />
				</Button>
			</FieldControl>
			<SchemaDescription metadata={metadata} />
			<FieldIssue path={path} jsonPath={jsonPath} />
		</Field>
	);
});
