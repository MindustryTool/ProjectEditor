import { API_BASE_URL } from "@project/config";
import type { ComponentProps } from "react";

export function AssetImage({ type, name, ...props }: ComponentProps<"img"> & { type: string; name: string }) {
	return <img src={API_BASE_URL + type + "/" + name + ".png"} alt={name} {...props} />;
}
