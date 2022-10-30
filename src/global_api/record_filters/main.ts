import { z } from "zod";

export function get_url(): string {
	return "record_filters?";
}

export const Params = z.object({
	ids: z.number().optional(),
	map_ids: z.number().optional(),
	stages: z.number().optional(),
	mode_ids: z.number().optional(),
	tickrates: z.number().optional(),
	has_teleports: z.boolean().optional(),
	offset: z.number().optional(),
	limit: z.number().optional()
});
export type Params = z.infer<typeof Params>;

export const Response = z.object({
	id: z.number(),
	map_id: z.number(),
	stage: z.number(),
	mode_id: z.number(),
	tickrate: z.number(),
	has_teleports: z.boolean(),
	created_on: z.string(),
	updated_by_id: z.string()
});
export type Response = z.infer<typeof Response>;
