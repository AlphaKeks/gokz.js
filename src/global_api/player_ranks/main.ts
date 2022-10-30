import { z } from "zod";

export function get_url(): string {
	return "player_ranks?";
}

export const Params = z.object({
	points_greater_than: z.number().optional(),
	average_greater_than: z.number().optional(),
	rating_greater_than: z.number().optional(),
	finishes_greater_than: z.number().optional(),
	steamid64s: z.union([z.number(), z.bigint()]).optional(),
	record_filter_ids: z.number().optional(),
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
	points: z.number(),
	average: z.number(),
	rating: z.number(),
	finishes: z.number(),
	steamid64: z.string(),
	steamid: z.string(),
	player_name: z.string()
});
export type Response = z.infer<typeof Response>;
