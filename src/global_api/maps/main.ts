import { z } from "zod";

export function get_url(): string {
	return "maps?";
}

export const Params = z.object({
	id: z.number().optional(),
	name: z.string().optional(),
	larger_than_filesize: z.number().optional(),
	smaller_than_filesize: z.number().optional(),
	is_validated: z.boolean().optional(),
	difficulty: z.number().optional(),
	created_since: z.string().optional(),
	updated_since: z.string().optional(),
	offset: z.number().optional(),
	limit: z.number().optional()
});
export type Params = z.infer<typeof Params>;

export const Response = z.object({
	id: z.number(),
	name: z.string(),
	filesize: z.union([z.number(), z.bigint()]),
	validated: z.boolean(),
	difficulty: z.number(),
	created_on: z.string(),
	updated_on: z.string(),
	approved_by_steamid64: z.string(),
	workshop_url: z.string(),
	download_url: z.string().nullable()
});
export type Response = z.infer<typeof Response>;
