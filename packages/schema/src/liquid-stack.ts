import * as v from "valibot";
import type { ProjectContents } from "@project/types";
import { LiquidFieldSchema } from "./liquid";
import { ContentNameSchema } from "./content";
import { cached, metadata } from "./utils";

export const LiquidStackSchema = cached((context: ProjectContents) =>
	v.pipe(
		v.lazy((input) => {
			if (typeof input === "string") {
				return v.pipe(
					v.string(),
					v.check((value) => {
						if (!value.includes("/")) {
							return false;
						}

						const parts = value.split("/");
						if (parts.length !== 2) {
							return false;
						}

						const [itemName, number] = parts;

						if (!itemName || !number) {
							return false;
						}

						if (!v.safeParse(ContentNameSchema, itemName).success) {
							return false;
						}

						if (!v.safeParse(v.pipe(v.string(), v.toNumber(), v.minValue(0)), number).success) {
							return false;
						}

						return true;
					}, "Invalid item requirement, must be in the format 'liquid/number'"),
				);
			}
			return v.pipe(
				v.object({
					liquid: LiquidFieldSchema(context),
					amount: v.pipe(v.number(), v.integer(), v.minValue(0)),
				}),
				metadata({ name: "liquid-stack" }),
			);
		}),
		metadata({
			type: "variant",
			options: [
				v.pipe(
					v.object({
						liquid: LiquidFieldSchema(context),
						amount: v.pipe(v.number(), v.integer(), v.minValue(0)),
					}),
					metadata({ name: "liquid-stack" }),
				),
				v.pipe(
					v.string(),
					v.check((value) => {
						if (!value.includes("/")) {
							return false;
						}

						const parts = value.split("/");
						if (parts.length !== 2) {
							return false;
						}

						const [itemName, number] = parts;

						if (!itemName || !number) {
							return false;
						}

						if (!v.safeParse(ContentNameSchema, itemName).success) {
							return false;
						}

						if (!v.safeParse(v.pipe(v.string(), v.toNumber(), v.minValue(0)), number).success) {
							return false;
						}

						return true;
					}, "Invalid item requirement, must be in the format 'liquid/number'"),
				),
			],
		}),
	),
);
