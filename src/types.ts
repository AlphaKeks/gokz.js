import { z } from "zod";

export const Ban = z.object({
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
export type Ban = z.infer<typeof Ban>;

export const Jumpstat = z.object({
	id: z.number(),
	server_id: z.number(),
	steamid64: z.string(),
	player_name: z.string(),
	steam_id: z.string(),
	jump_type: z.number(),
	distance: z.number(),
	tickrate: z.number(),
	msl_count: z.number(),
	strafe_count: z.number(),
	is_crouch_bind: z.number(),
	is_forward_bind: z.number(),
	is_crouch_boost: z.number(),
	updated_by_id: z.number(),
	created_on: z.string(),
	updated_on: z.string()
});
export type Jumpstat = z.infer<typeof Jumpstat>;

export const Map = z.object({
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
export type Map = z.infer<typeof Map>;

export const Mode = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string(),
	latest_version: z.number(),
	latest_version_description: z.string(),
	website: z.string(),
	repo: z.string(),
	contact_steamid64: z.string(),
	// i don't think this is intended, i guess they're supposed to be number[] but they're all `null` lol
	supported_tickrates: z.null(),
	created_on: z.string(),
	updated_on: z.string(),
	updated_by_id: z.string()
});
export type Mode = z.infer<typeof Mode>;

export const PlayerRank = z.object({
	points: z.number(),
	average: z.number(),
	rating: z.number(),
	finishes: z.number(),
	steamid64: z.string(),
	steamid: z.string(),
	player_name: z.string()
});
export type PlayerRank = z.infer<typeof PlayerRank>;

export const Player = z.object({
	steamid64: z.string(),
	steam_id: z.string(),
	is_banned: z.boolean(),
	total_records: z.number(),
	name: z.string()
});
export type Player = z.infer<typeof Player>;

export const RecordFilter = z.object({
	id: z.number(),
	map_id: z.number(),
	stage: z.number(),
	mode_id: z.number(),
	tickrate: z.number(),
	has_teleports: z.boolean(),
	created_on: z.string(),
	updated_on: z.string(),
	updated_by_id: z.string()
});
export type RecordFilter = z.infer<typeof RecordFilter>;

export const RecordFilterDistribution = z.object({
	record_filter_id: z.number(),
	c: z.number(),
	d: z.number(),
	loc: z.number(),
	scale: z.number(),
	top_scale: z.number(),
	created_on: z.string(),
	updated_on: z.string(),
	updated_by_id: z.string()
});
export type RecordFilterDistribution = z.infer<typeof RecordFilterDistribution>;

export const Record = z.object({
	id: z.number(),
	steamid64: z.string(),
	player_name: z.string(),
	steam_id: z.string(),
	server_id: z.number(),
	map_id: z.number(),
	stage: z.number(),
	mode: z.string(),
	tickrate: z.number(),
	time: z.number(),
	teleports: z.number(),
	created_on: z.string(),
	updated_on: z.string(),
	updated_by: z.number(),
	record_filter_id: z.number(),
	server_name: z.string(),
	map_name: z.string(),
	points: z.number(),
	replay_id: z.number()
});
export type Record = z.infer<typeof Record>;

export const Server = z.object({
	id: z.number(),
	port: z.number(),
	ip: z.string(),
	name: z.string(),
	owner_steamid64: z.string()
});
export type Server = z.infer<typeof Server>;

export const KZGOMap = z.object({
	name: z.string(),
	id: z.number(),
	tier: z.number(),
	workshopId: z.string(),
	bonuses: z.number(),
	sp: z.boolean(),
	vp: z.boolean(),
	mapperNames: z.array(z.string()),
	mapperIds: z.array(z.string()),
	date: z.string()
});
export type KZGOMap = z.infer<typeof KZGOMap>;
