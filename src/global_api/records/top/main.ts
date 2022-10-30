import { z } from "zod";

export function get_url(): string {
	return "records/top?";
}

export const Params = z.object({
	steam_id: z.string().optional(),
	server_id: z.number().optional(),
	steamid64: z.number().optional(),
	map_id: z.number().optional(),
	map_name: z.string().optional(),
	tickrate: z.number().optional(),
	overall: z.boolean().optional(),
	stage: z.number().optional(),
	modes_list_string: z.string().optional(),
	modes_list: z.string().optional(),
	has_teleports: z.boolean().optional(),
	player_name: z.string().optional(),
	offset: z.number().optional(),
	limit: z.number().optional()
});
export type Params = z.infer<typeof Params>;

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
	record_filter_id: z.number(),
	server_name: z.string(),
	map_name: z.string(),
	points: z.number(),
	replay_id: z.number()
});
export type Response = z.infer<typeof Response>;

export * as Recent from "./recent";
export * as WorldRecords from "./world_records";
