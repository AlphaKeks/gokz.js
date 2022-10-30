import { z } from "zod";

export function get_url(): string {
	return "https://health.global-api.com/api/v1/endpoints/_globalapi/statuses?page=1";
}

export const Params = {};
export type Params = typeof Params;

const ConditionResult = z.object({
	condition: z.string(),
	success: z.boolean()
});
type ConditionResult = z.infer<typeof ConditionResult>;

const StatusResult = z.object({
	status: z.number(),
	hostname: z.string(),
	duration: z.number(),
	conditionResults: z.array(z.object(ConditionResult.shape)),
	success: z.boolean(),
	timestamp: z.string()
});
type StatusResult = z.infer<typeof StatusResult>;

const StatusEvent = z.object({
	type: z.string(),
	timestamp: z.string()
});
type StatusEvent = z.infer<typeof StatusEvent>;

export const Response = z.object({
	name: z.string(),
	key: z.string(),
	results: z.array(z.object(StatusResult.shape)),
	events: z.array(z.object(StatusEvent.shape))
});
export type Response = z.infer<typeof Response>;

export const Fancy = z.object({
	successful_responses: z.number(),
	fast_responses: z.number()
});
export type Fancy = z.infer<typeof Fancy>;
