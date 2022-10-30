import { Mode } from "src/prelude";

export function get_url(mode: Mode): string {
	return `modes/name/${mode.to_string()}`;
}

export { Params, Response } from "../main";
