import { API_BASE_URL } from "@project/config";
import { memo, type ComponentProps } from "react";

export const ContentApiImage = memo(function ContentApiImage({ type, name, ...props }: ComponentProps<"img"> & { type: string; name: string }) {
	return <img src={API_BASE_URL + type + "/" + name + ".png"} alt={name} loading="lazy" {...props} />;
});
