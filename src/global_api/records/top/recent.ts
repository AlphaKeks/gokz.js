import { z } from "zod";

export function get_url(): string {
	return "records/top/recent?";
}

export { Params } from "./main";

export const Response = z.object({
	id: z.number(),
	steamid64: z.string(),
	player_name: z.string(),
	steam_id: z.string(),
	server_id: z.number(),
	map_id: z.number(),
	stage: z.number(),
	mode: z.string(),
	tickrate: z.number(),
	time: z.number(),
	teleports: z.number(),
	created_on: z.string(),
	updated_on: z.string(),
	updated_by: z.number(),
	place: z.number(),
	top_100: z.number(),
	top_100_overall: z.number(),
	server_name: z.string(),
	map_name: z.string(),
	points: z.number(),
	record_filter_id: z.number(),
	replay_id: z.number()
});
export type Response = z.infer<typeof Response>;
