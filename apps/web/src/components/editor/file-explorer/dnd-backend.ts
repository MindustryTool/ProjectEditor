import { TouchTransition, type MultiBackendOptions } from "react-dnd-multi-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

export const dndOptions: MultiBackendOptions = {
	backends: [
		{
			id: "html5",
			backend: HTML5Backend,
		},
		{
			id: "touch",
			backend: TouchBackend,
			options: { delayTouchStart: 150, enableMouseEvents: false },
			preview: true,
			transition: TouchTransition,
		},
	],
};
