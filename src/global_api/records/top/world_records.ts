import { z } from "zod";

export function get_url(): string {
	return "records/top/world_records?";
}

export const Params = z.object({
	ids: z.number().optional(),
	map_ids: z.number().optional(),
	stages: z.number().optional(),
	mode_ids: z.number().optional(),
	tickrates: z.number().optional(),
	has_teleports: z.boolean().optional(),
	mapTag: z.string().optional(),
	offset: z.number().optional(),
	limit: z.number().optional()
});
export type Params = z.infer<typeof Params>;

export const Response = z.object({
	steamid64: z.string(),
	steam_id: z.string(),
	count: z.number(),
	player_name: z.string()
});
export type Response = z.infer<typeof Response>;
