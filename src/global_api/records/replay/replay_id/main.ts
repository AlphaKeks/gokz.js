import { z } from "zod";

export function get_url(replay_id: number): string {
	return `records/replay/${replay_id}`;
}

export const Params = {};
export type Params = typeof Params;

export const Response = z.string();
export type Response = z.infer<typeof Response>;
