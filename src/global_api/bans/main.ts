import { z } from "zod";

export function get_url(): string {
	return "bans?";
}

export const Params = z.object({
	ban_types: z.string().optional(),
	ban_types_list: z.string().optional(),
	is_expired: z.boolean().optional(),
	ip: z.string().optional(),
	steamid64: z.string().optional(),
	steam_id: z.string().optional(),
	notes_contains: z.string().optional(),
	stats_contains: z.string().optional(),
	server_id: z.number().optional(),
	created_since: z.string().optional(),
	updated_since: z.string().optional(),
	offset: z.number().optional(),
	limit: z.number().optional()
});
export type Params = z.infer<typeof Params>;

export const Response = z.object({
	id: z.number(),
	ban_type: z.string(),
	expires_on: z.string(),
	steamid64: z.string(),
	player_name: z.string(),
	steam_id: z.string(),
	notes: z.string(),
	stats: z.string(),
	server_id: z.number(),
	updated_by_id: z.string(),
	created_on: z.string(),
	updated_on: z.string()
});
export type Response = z.infer<typeof Response>;
