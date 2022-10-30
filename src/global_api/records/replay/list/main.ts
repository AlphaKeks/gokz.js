import { z } from "zod";

export function get_url(): string {
	return "records/replay/list";
}

export const Params = z.object({
	offset: z.number().optional(),
	limit: z.number().optional()
});
export type Params = z.infer<typeof Params>;

export const Response = z.object({
	id: z.number(),
	steamid64: z.string(),
	server_id: z.number(),
	record_filter_id: z.number(),
	time: z.number(),
	teleports: z.number(),
	created_on: z.string(),
	updated_on: z.string(),
	updated_by: z.union([z.number(), z.bigint()]),
	points: z.number(),
	replay_id: z.number()
});
export type Response = z.infer<typeof Response>;
