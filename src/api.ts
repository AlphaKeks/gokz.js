import axios, { AxiosRequestConfig } from "axios";
import { z, ZodSchema } from "zod";
import * as G from "./types";

class APIResponse<D> {
	success: boolean;
	data?: D;
	error?: string;

	constructor() {
		this.success = false;
	}
}

function isSteamID(input: string): boolean {
	return /STEAM_[0-1]:[0-1]:[0-9]+/.test(input);
}
async function APIRequest(
	path: string,
	config: AxiosRequestConfig,
	expectation: ZodSchema
): Promise<APIResponse<any>> {
	const res = new APIResponse();
	await axios
		.get(`https://kztimerglobal.com/api/v2.0/${path}`, config)
		.then((response) => {
			if (
				expectation.safeParse(response.data[0]).success ||
				expectation.safeParse(response.data).success
			) {
				res.success = true;
				if (response.data[0])
					res.data = response.data.length > 1 ? response.data : response.data[0];
				else res.data = response.data;
			} else res.error = "API Error.";
		})
		.catch((e: any) => {
			console.log(e);
			res.error = e.toString();
		});

	return res;
}

export async function APIStatus(): Promise<{
	status: string;
	frontEnd: string;
	backEnd: string;
}> {
	const status = await axios
		.get("https://status.global-api.com/api/v2/summary.json")
		.then((response) => {
			return {
				status: response.data.status.description,
				frontEnd: response.data.components[0].status,
				backEnd: response.data.components[1].status
			};
		})
		.catch(() => {
			return {
				status: "N/A",
				frontEnd: "N/A",
				backEnd: "N/A"
			};
		});
	return status;
}

export async function getMaps(): Promise<APIResponse<G.Map[]>> {
	const res = await APIRequest(
		"maps?",
		{
			params: {
				is_validated: true,
				limit: 999
			}
		},
		G.Map
	);
	return res;
}

export async function getMap(mapIdentifier: number | string): Promise<APIResponse<G.Map>> {
	const params: any = {
		is_validated: true,
		limit: 9999
	};
	if (typeof mapIdentifier === "number") params.id = mapIdentifier;
	else params.name = mapIdentifier;
	const res = await APIRequest("maps?", { params: params }, G.Map);
	return res;
}

export async function getMapsKZGO(): Promise<APIResponse<G.KZGOMap[]>> {
	const res = new APIResponse<G.KZGOMap[]>();
	await axios
		.get("https://kzgo.eu/api/maps")
		.then((response) => {
			if (G.KZGOMap.safeParse(response.data[0]).success) {
				res.success = true;
				res.data = response.data;
			} else res.error = "KZ:GO Error.";
		})
		.catch((e: any) => (res.error = e));
	return res;
}

export async function getMapKZGO(mapName: string): Promise<APIResponse<G.KZGOMap>> {
	const res = new APIResponse<G.KZGOMap>();
	await axios
		.get(`https://kzgo.eu/api/maps/${mapName}`)
		.then((response) => {
			if (G.KZGOMap.safeParse(response.data).success) {
				res.success = true;
				res.data = response.data;
			} else res.error = "KZ:GO Error.";
		})
		.catch((e: any) => (res.error = e));
	return res;
}

export async function getMapcycle(): Promise<APIResponse<string[]>> {
	const res = new APIResponse<string[]>();
	await axios
		.get("https://maps.cawkz.net/mapcycles/gokz.txt")
		.then((response) => {
			res.success = true;
			res.data = response.data.split("\r\n");
		})
		.catch((e: any) => (res.error = e));

	return res;
}

export async function validateMap(mapName: string, mapList: G.Map[]): Promise<APIResponse<G.Map>> {
	const res = new APIResponse<G.Map>();
	mapList.forEach((map) => {
		if (map.name.includes(mapName.toLowerCase())) {
			res.success = true;
			res.data = map;
		}
	});
	if (!res.success) res.error = "That map is not global.";
	return res;
}

export function getTier(mapName: string, mapList: G.Map[]): APIResponse<number> {
	const res = new APIResponse<number>();
	for (let i = 0; i < mapList.length; i++) {
		if (mapList[i].name.toLowerCase().includes(mapName)) {
			res.success = true;
			res.data = mapList[i].difficulty;
		}
	}
	if (!res.success) res.error = "That map is not global.";

	return res;
}

export async function getFilters(
	mapID: number,
	course: number
): Promise<
	APIResponse<{
		KZT: {
			mode: string;
			displayMode: string;
			abbrMode: string;
			modeID: number;
			icon: "❌" | "✅";
		};
		SKZ: {
			mode: string;
			displayMode: string;
			abbrMode: string;
			modeID: number;
			icon: "❌" | "✅";
		};
		VNL: {
			mode: string;
			displayMode: string;
			abbrMode: string;
			modeID: number;
			icon: "❌" | "✅";
		};
	}>
> {
	const res = await APIRequest(
		"record_filters?",
		{
			params: {
				map_ids: mapID,
				stages: course,
				tickrates: 128,
				has_teleports: false,
				limit: 9999
			}
		},
		G.RecordFilter
	);

	if (!res.success) {
		res.error = "This map does not have any filters.";
		return res;
	} else {
		const filters: any = {
			KZT: {
				mode: "kz_timer",
				displayMode: "KZTimer",
				abbrMode: "KZT",
				modeID: 200,
				icon: "❌"
			},
			SKZ: {
				mode: "kz_simple",
				displayMode: "SimpleKZ",
				abbrMode: "SKZ",
				modeID: 201,
				icon: "❌"
			},
			VNL: {
				mode: "kz_vanilla",
				displayMode: "Vanilla",
				abbrMode: "VNL",
				modeID: 202,
				icon: "❌"
			}
		};

		res.data.forEach((i: G.RecordFilter) => {
			switch (i.mode_id) {
				case 200:
					filters.KZT.icon = "✅";
					break;
				case 201:
					filters.SKZ.icon = "✅";
					break;
				case 202:
					filters.VNL.icon = "✅";
					break;
			}
		});

		res.data = filters;
		return res;
	}
}

export async function getFilterDist(
	modeID: number,
	runtype: boolean
): Promise<APIResponse<G.RecordFilter[]>> {
	const res = await APIRequest(
		"record_filters?",
		{
			params: {
				stages: 0,
				mode_ids: modeID,
				tickrates: 128,
				has_teleports: runtype,
				limit: 9999
			}
		},
		G.RecordFilter
	);
	return res;
}

export async function getModes(): Promise<APIResponse<G.Mode[]>> {
	const res = await APIRequest("modes?", { params: {} }, G.Mode);
	return res;
}

export async function getMode(modeIdentifier: string | number): Promise<APIResponse<G.Mode>> {
	const path =
		typeof modeIdentifier === "string" ? `name/${modeIdentifier}` : `id/${modeIdentifier}`;
	const res = await APIRequest(`modes/${path}`, { params: {} }, G.Mode);
	return res;
}

const modeMap = new Map();
modeMap.set("kz_timer", "KZT");
modeMap.set("kz_simple", "SKZ");
modeMap.set("kz_vanilla", "VNL");
modeMap.set("KZT", "kz_timer");
modeMap.set("SKZ", "kz_simple");
modeMap.set("VNL", "kz_vanilla");
export default modeMap;

export async function getPlayer(identifier: string): Promise<APIResponse<G.Player>> {
	const params: any = { limit: 1 };
	if (isSteamID(identifier)) params.steam_id = identifier;
	else params.name = identifier;
	const res = await APIRequest("players?", { params: params }, G.Player);
	return res;
}

export async function getWR(
	mapIdentifier: string | number,
	course: number,
	mode: string,
	runtype: boolean
): Promise<APIResponse<G.Record>> {
	const params: any = {
		tickrate: 128,
		stage: course,
		modes_list_string: mode,
		has_teleports: runtype,
		limit: 1
	};

	if (typeof mapIdentifier === "number") params.map_id = mapIdentifier;
	else params.map_name = mapIdentifier;

	const res = await APIRequest("records/top?", { params: params }, G.Record);
	return res;
}

export async function getMaptop(
	mapName: string,
	mode: string,
	course: number,
	runtype: boolean
): Promise<APIResponse<G.Record[]>> {
	const res = await APIRequest(
		"records/top?",
		{
			params: {
				map_name: mapName,
				tickrate: 128,
				stage: course,
				modes_list_string: mode,
				has_teleports: runtype,
				limit: 100
			}
		},
		G.Record
	);
	return res;
}

export async function getTop(
	mode: string | number,
	stages: number[],
	runtype: boolean
): Promise<
	APIResponse<{
		steamid64: string;
		steam_id: string;
		count: number;
		player_name: string;
	}>
> {
	const params: any = {
		tickrates: 128,
		has_teleports: runtype,
		limit: 100
	};

	if (typeof mode === "string") {
		if (mode === "kz_timer") params.mode_ids = 200;
		else if (mode === "kz_simple") params.mode_ids = 201;
		else params.mode_ids = 202;
	}

	let path = "records/top/world_records?";
	stages.forEach((h) => (path += `stages=${h}&`));

	const res = await APIRequest(
		path,
		{ params: params },
		z.object({
			steamid64: z.string(),
			steam_id: z.string(),
			count: z.number(),
			player_name: z.string()
		})
	);
	return res;
}

export async function getPB(
	playerIdentifier: string,
	mapIdentifier: string | number,
	course: number,
	mode: string,
	runtype: boolean
): Promise<APIResponse<G.Record>> {
	const params: any = {
		tickrate: 128,
		stage: course,
		modes_list_string: mode,
		has_teleports: runtype,
		limit: 1
	};

	if (isSteamID(playerIdentifier)) params.steam_id = playerIdentifier;
	else params.player_name = playerIdentifier;

	if (typeof mapIdentifier === "number") params.map_id = mapIdentifier;
	else params.map_name = mapIdentifier;

	const res = await APIRequest("records/top?", { params: params }, G.Record);
	return res;
}

export async function getTimes(
	playerIdentifier: string,
	mode: string,
	runtype: boolean
): Promise<APIResponse<G.Record[]>> {
	const params: any = {
		tickrate: 128,
		stage: 0,
		modes_list_string: mode,
		has_teleports: runtype,
		limit: 9999
	};

	if (isSteamID(playerIdentifier)) params.steam_id = playerIdentifier;
	else params.player_name = playerIdentifier;

	const res = await APIRequest("records/top?", { params: params }, G.Record);
	return res;
}

export async function getRecent(playerIdentifier: string): Promise<APIResponse<G.Record>> {
	const res = new APIResponse<G.Record>();

	const [KZT, SKZ, VNL] = [
		await Promise.all([
			await getTimes(playerIdentifier, "kz_timer", true),
			await getTimes(playerIdentifier, "kz_timer", false)
		]),
		await Promise.all([
			await getTimes(playerIdentifier, "kz_simple", true),
			await getTimes(playerIdentifier, "kz_simple", false)
		]),
		await Promise.all([
			await getTimes(playerIdentifier, "kz_vanilla", true),
			await getTimes(playerIdentifier, "kz_vanilla", false)
		])
	];

	const data: G.Record[] = [];

	// xd
	[KZT, SKZ, VNL].forEach((i) => {
		i.forEach((j) => {
			if (j.success) {
				for (let k = 0; k < j.data!.length; k++) {
					data.push(j.data![k]);
				}
			}
		});
	});

	if (data.length < 1) res.error = "This player has no recent times.";
	else {
		res.success = true;

		const recentMaps = new Map();
		for (let i = 0; i < data.length; i++) {
			data[i].created_on = Date.parse(data[i].created_on) as unknown as string;
			recentMaps.set(data[i].created_on, data[i]);
		}
		const recentMap = Math.max(...recentMaps.keys());

		res.data = recentMaps.get(recentMap);
	}

	return res;
}

export async function getPlace(run: G.Record): Promise<APIResponse<number>> {
	const res = await APIRequest(`records/place/${run.id}`, { params: {} }, z.number());
	return res;
}

export async function validateCourse(map: G.KZGOMap, course: number): Promise<boolean> {
	if (map.bonuses >= course) return true;
	else return false;
}

export async function custom(
	path: string,
	config: AxiosRequestConfig,
	expectation: ZodSchema
): Promise<APIResponse<any>> {
	const res = await APIRequest(path, config, expectation);
	return res;
}
