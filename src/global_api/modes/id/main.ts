import { Mode } from "src/prelude";

export function get_url(mode: Mode): string {
	return `modes/id/${mode.as_id()}`;
}

export { Params, Response } from "../main";
