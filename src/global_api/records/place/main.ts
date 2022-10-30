import { z } from "zod";

export function get_url(record_id: number): string {
	return `records/place/${record_id}`;
}

export const Params = {};
export type Params = typeof Params;

export const Response = z.number();
export type Response = z.infer<typeof Response>;
