import { z } from "zod";

export function get_url(): string {
	return "modes?";
}

export const Params = {};
export type Params = typeof Params;

export const Response = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string(),
	latest_version: z.number(),
	latest_version_description: z.string(),
	website: z.string(),
	repo: z.string(),
	contact_steamid64: z.string(),
	supported_tickrates: z.number().nullable(),
	created_on: z.string(),
	updated_on: z.string(),
	updated_by_id: z.string()
});
export type Response = z.infer<typeof Response>;

export * as ID from "./id/main";
export * as Name from "./name/main";
