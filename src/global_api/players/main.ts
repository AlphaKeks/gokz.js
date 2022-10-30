import { z } from "zod";

export function get_url(): string {
	return "players?";
}

export const Params = z.object({
	name: z.string().optional(),
	steam_id: z.string().optional(),
	is_banned: z.boolean().optional(),
	total_records: z.number().optional(),
	ip: z.string().optional(),
	steamid64_list: z.string().optional(),
	offset: z.number().optional(),
	limit: z.number().optional()
});
export type Params = z.infer<typeof Params>;

export const Response = z.object({
	steamid64: z.string(),
	steam_id: z.string(),
	is_banned: z.boolean(),
	total_records: z.number(),
	name: z.string()
});
export type Response = z.infer<typeof Response>;
