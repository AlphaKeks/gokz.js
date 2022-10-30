import axios from "axios";
import { ZodSchema } from "zod";
import {
	Error,
	ErrorKind,
	MapIdentifier,
	Mode,
	ModeKind,
	PlayerIdentifier,
	Result,
	SteamID
} from "../prelude";
import * as Bans from "./bans/main";
import * as Health from "./health/main";
import * as Maps from "./maps/main";
import * as Modes from "./modes/main";
import * as PlayerRanks from "./player_ranks/main";
import * as Players from "./players/main";
import * as RecordFilters from "./record_filters/main";
import * as Records from "./records/main";

function get_url(): string {
	return "https://kztimerglobal.com/api/v2/";
}

async function api_request<T, P>(
	route: string,
	params: P,
	expectation: ZodSchema
): Promise<Result<T, Error>> {
	const url = get_url() + route;
	const config = {
		params: params
	};

	const response: Result<T, Error> = await axios
		.get(url, config)
		.then(async (res) => {
			const check = [
				expectation.safeParse(res.data).success,
				expectation.safeParse(res.data[0]).success
			];

			if (check[0] || check[1]) {
				return {
					ok: true,
					value: res.data
				};
			} else if (res?.data?.length === 0) {
				return {
					ok: false,
					value: {
						kind: ErrorKind.NoData,
						origin: "api_request",
						tldr: "No data found.",
						raw: null
					}
				};
			} else {
				return {
					ok: false,
					value: {
						kind: ErrorKind.Parsing,
						origin: "api_request",
						tldr: "Failed to parse GlobalAPI response.",
						raw: res.data
					}
				};
			}
		})
		.catch((why) => {
			return {
				ok: false,
				value: {
					kind: ErrorKind.GlobalAPI,
					origin: "api_request",
					tldr: "GlobalAPI request failed.",
					raw: why.toString()
				}
			};
		});

	return response;
}

export async function get_bans(steam_id: SteamID): Promise<Result<Bans.Response[], Error>> {
	const params: Bans.Params = {
		steam_id: steam_id.value
	};

	const response = await api_request<Bans.Response[], Bans.Params>(
		Bans.get_url(),
		params,
		Bans.Response
	);

	if (!response.ok) {
		return {
			ok: false,
			value: {
				...response.value,
				origin: response.value.origin + " > get_bans"
			}
		};
	}

	if (response.value.length < 1) {
		return {
			ok: false,
			value: {
				kind: ErrorKind.NoData,
				origin: "get_bans",
				tldr: "No bans found.",
				raw: null
			}
		};
	}

	return response;
}

export async function get_maps(): Promise<Result<Maps.Response[], Error>> {
	const params: Maps.Params = {
		is_validated: true,
		limit: 9999
	};

	const response = await api_request<Maps.Response[], Maps.Params>(
		Maps.get_url(),
		params,
		Maps.Response
	);

	if (!response.ok) {
		return {
			ok: false,
			value: {
				...response.value,
				origin: response.value.origin + " > get_maps"
			}
		};
	}

	if (response.value.length < 1) {
		return {
			ok: false,
			value: {
				kind: ErrorKind.NoData,
				origin: "get_maps",
				tldr: "No maps found.",
				raw: null
			}
		};
	}

	return response;
}

export async function get_map(
	map_identifier: MapIdentifier
): Promise<Result<Maps.Response, Error>> {
	const params: Maps.Params = {
		is_validated: true,
		limit: 1
	};

	switch (map_identifier.kind) {
		case "name": {
			params.name = map_identifier.value;
			break;
		}

		case "id": {
			params.id = map_identifier.value as number;
			break;
		}
	}

	const response = await api_request<Maps.Response[], Maps.Params>(
		Maps.get_url(),
		params,
		Maps.Response
	);

	if (!response.ok) {
		return {
			ok: false,
			value: {
				...response.value,
				origin: response.value.origin + " > get_map"
			}
		};
	}

	if (response.value.length < 1) {
		return {
			ok: false,
			value: {
				kind: ErrorKind.NoData,
				origin: "get_map",
				tldr: "No map found.",
				raw: null
			}
		};
	}

	return {
		ok: true,
		value: response.value[0]
	};
}

export async function get_modes(): Promise<Result<Modes.Response[], Error>> {
	const response = await api_request<Modes.Response[], Modes.Params>(
		Modes.get_url(),
		{},
		Modes.Response
	);

	if (!response.ok) {
		return {
			ok: false,
			value: {
				...response.value,
				origin: response.value.origin + " > get_modes"
			}
		};
	}

	if (response.value.length < 1) {
		return {
			ok: false,
			value: {
				kind: ErrorKind.NoData,
				origin: "get_modes",
				tldr: "No modes found.",
				raw: null
			}
		};
	}

	return response;
}

export async function get_mode(mode: Mode): Promise<Result<Modes.Response, Error>> {
	const response = await api_request<Modes.Response, Modes.Params>(
		Modes.ID.get_url(mode),
		{},
		Modes.Response
	);

	return response;
}

export async function get_player(
	player_identifier: PlayerIdentifier
): Promise<Result<Players.Response, Error>> {
	const params: Players.Params = {};

	switch (player_identifier.kind) {
		case "name": {
			params.name = player_identifier.value;
			break;
		}

		case "steam_id": {
			params.steam_id = player_identifier.value.value;
			break;
		}
	}

	const response = await api_request<Players.Response[], Players.Params>(
		Players.get_url(),
		params,
		Players.Response
	);

	if (!response.ok) {
		return {
			ok: false,
			value: {
				...response.value,
				origin: response.value.origin + " > get_player"
			}
		};
	}

	if (response.value.length < 1) {
		return {
			ok: false,
			value: {
				kind: ErrorKind.NoData,
				origin: "get_player",
				tldr: "No player found.",
				raw: null
			}
		};
	}

	return {
		ok: true,
		value: response.value[0]
	};
}

export async function get_filters(
	map_identifier: MapIdentifier
): Promise<Result<RecordFilters.Response[], Error>> {
	const params: RecordFilters.Params = {};

	switch (map_identifier.kind) {
		case "name": {
			return {
				ok: false,
				value: {
					kind: ErrorKind.Input,
					origin: "get_filters",
					tldr: "You can only use an ID for this function.",
					raw: null
				}
			};
		}

		case "id": {
			params.map_ids = map_identifier.value;
			break;
		}
	}

	const response = await api_request<RecordFilters.Response[], RecordFilters.Params>(
		RecordFilters.get_url(),
		params,
		RecordFilters.Response
	);

	if (!response.ok) {
		return {
			ok: false,
			value: {
				...response.value,
				origin: response.value.origin + " > get_filters"
			}
		};
	}

	if (response.value.length < 1) {
		return {
			ok: false,
			value: {
				kind: ErrorKind.NoData,
				origin: "get_filters",
				tldr: "No filters found.",
				raw: null
			}
		};
	}

	return response;
}

export async function get_filter_dist(
	mode: Mode,
	runtype: boolean
): Promise<Result<RecordFilters.Response[], Error>> {
	const params: RecordFilters.Params = {
		mode_ids: mode.as_id(),
		has_teleports: runtype,
		stages: 0,
		limit: 9999
	};

	const response = await api_request<RecordFilters.Response[], RecordFilters.Params>(
		RecordFilters.get_url(),
		params,
		RecordFilters.Response
	);

	if (!response.ok) {
		return {
			ok: false,
			value: {
				...response.value,
				origin: response.value.origin + " > get_filter_dist"
			}
		};
	}

	if (response.value.length < 1) {
		return {
			ok: false,
			value: {
				kind: ErrorKind.NoData,
				origin: "get_filters",
				tldr: "No filters found.",
				raw: null
			}
		};
	}

	return response;
}

export async function get_times(
	player_identifier: PlayerIdentifier,
	mode: Mode,
	runtype: boolean,
	course: number
): Promise<Result<Records.Top.Response[], Error>> {
	const params: Records.Top.Params = {
		modes_list_string: mode.to_string(),
		has_teleports: runtype,
		stage: course,
		limit: 9999
	};

	switch (player_identifier.kind) {
		case "name": {
			params.player_name = player_identifier.value;
			break;
		}

		case "steam_id": {
			params.steam_id = player_identifier.value.value;
			break;
		}
	}

	const response = await api_request<Records.Top.Response[], Records.Top.Params>(
		Records.Top.get_url(),
		params,
		Records.Top.Response
	);

	if (!response.ok) {
		return {
			ok: false,
			value: {
				...response.value,
				origin: response.value.origin + " > get_times"
			}
		};
	}

	if (response.value.length < 1) {
		return {
			ok: false,
			value: {
				kind: ErrorKind.NoData,
				origin: "get_times",
				tldr: "No records found.",
				raw: null
			}
		};
	}

	return response;
}

export async function get_unfinished(
	player_identifier: PlayerIdentifier,
	mode: Mode,
	runtype: boolean,
	tier: number | null
): Promise<Result<string[], Error>> {
	const doable = await get_filter_dist(mode, runtype);
	if (!doable.ok) {
		return doable;
	}

	const completed_req = await get_times(player_identifier, mode, runtype, 0);
	if (!completed_req.ok) {
		return completed_req;
	}

	const completed: number[] = [];
	for (let i = 0; i < completed_req.value.length; ++i) {
		completed.push(completed_req.value[i].map_id);
	}

	const uncompleted_ids: number[] = [];
	for (let i = 0; i < doable.value.length; ++i) {
		if (!completed.includes(doable.value[i].map_id)) {
			uncompleted_ids.push(doable.value[i].map_id);
		}
	}

	const global_maps = await get_maps();
	if (!global_maps.ok) {
		return global_maps;
	}

	const uncompleted_names: string[] = [];
	for (let i = 0; i < global_maps.value.length; ++i) {
		if (
			uncompleted_ids.includes(global_maps.value[i].id) &&
			(tier ? global_maps.value[i].difficulty === tier : true) &&
			(runtype ? !global_maps.value[i].name.startsWith("kzpro_") : true)
		) {
			uncompleted_names.push(global_maps.value[i].name);
		}
	}

	return {
		ok: true,
		value: uncompleted_names
	};
}

export async function get_wr(
	map_identifier: MapIdentifier,
	mode: Mode,
	runtype: boolean,
	course: number
): Promise<Result<Records.Top.Response, Error>> {
	const params: Records.Top.Params = {
		modes_list_string: mode.to_string(),
		has_teleports: runtype,
		stage: course
	};

	switch (map_identifier.kind) {
		case "name": {
			params.map_name = map_identifier.value;
			break;
		}

		case "id": {
			params.map_id = map_identifier.value as number;
			break;
		}
	}

	const response = await api_request<Records.Top.Response[], Records.Top.Params>(
		Records.Top.get_url(),
		params,
		Records.Top.Response
	);

	if (!response.ok) {
		return {
			ok: false,
			value: {
				...response.value,
				origin: response.value.origin + " > get_wr"
			}
		};
	}

	if (response.value.length < 1) {
		return {
			ok: false,
			value: {
				kind: ErrorKind.NoData,
				origin: "get_wr",
				tldr: "No WR found.",
				raw: null
			}
		};
	}

	return {
		ok: true,
		value: response.value[0]
	};
}

export async function get_pb(
	player_identifier: PlayerIdentifier,
	map_identifier: MapIdentifier,
	mode: Mode,
	runtype: boolean,
	course: number
): Promise<Result<Records.Top.Response, Error>> {
	const params: Records.Top.Params = {
		modes_list_string: mode.to_string(),
		has_teleports: runtype,
		stage: course
	};

	switch (player_identifier.kind) {
		case "name": {
			params.player_name = player_identifier.value;
			break;
		}

		case "steam_id": {
			params.steam_id = player_identifier.value.value;
			break;
		}
	}

	switch (map_identifier.kind) {
		case "name": {
			params.map_name = map_identifier.value;
			break;
		}

		case "id": {
			params.map_id = map_identifier.value as number;
			break;
		}
	}

	const response = await api_request<Records.Top.Response[], Records.Top.Params>(
		Records.Top.get_url(),
		params,
		Records.Top.Response
	);

	if (!response.ok) {
		return {
			ok: false,
			value: {
				...response.value,
				origin: response.value.origin + " > get_pb"
			}
		};
	}

	if (response.value.length < 1) {
		return {
			ok: false,
			value: {
				kind: ErrorKind.NoData,
				origin: "get_pb",
				tldr: "No PB found.",
				raw: null
			}
		};
	}

	return {
		ok: true,
		value: response.value[0]
	};
}

export async function get_maptop(
	map_identifier: MapIdentifier,
	mode: Mode,
	runtype: boolean,
	course: number
): Promise<Result<Records.Top.Response[], Error>> {
	const params: Records.Top.Params = {
		modes_list_string: mode.to_string(),
		has_teleports: runtype,
		stage: course,
		limit: 100
	};

	switch (map_identifier.kind) {
		case "name": {
			params.map_name = map_identifier.value;
			break;
		}

		case "id": {
			params.map_id = map_identifier.value as number;
			break;
		}
	}

	const response = await api_request<Records.Top.Response[], Records.Top.Params>(
		Records.Top.get_url(),
		params,
		Records.Top.Response
	);

	if (!response.ok) {
		return {
			ok: false,
			value: {
				...response.value,
				origin: response.value.origin + " > get_maptop"
			}
		};
	}

	if (response.value.length < 1) {
		return {
			ok: false,
			value: {
				kind: ErrorKind.NoData,
				origin: "get_maptop",
				tldr: "Map has 0 completions.",
				raw: null
			}
		};
	}

	return response;
}

export async function get_recent(
	player_identifier: PlayerIdentifier
): Promise<Result<Records.Top.Response, Error>> {
	const modes = [
		new Mode(ModeKind.KZTimer),
		new Mode(ModeKind.SimpleKZ),
		new Mode(ModeKind.Vanilla)
	];

	const records: Records.Top.Response[] = [];
	[
		...(await Promise.all([
			get_times(player_identifier, modes[0], true, 0),
			get_times(player_identifier, modes[0], false, 0),
			get_times(player_identifier, modes[1], true, 0)
		])),
		...(await Promise.all([
			get_times(player_identifier, modes[1], false, 0),
			get_times(player_identifier, modes[2], true, 0),
			get_times(player_identifier, modes[2], false, 0)
		]))
	].forEach((request) => {
		if (request.ok) {
			for (let i = 0; i < request.value.length; ++i) {
				records.push(request.value[i]);
			}
		}
	});

	if (records.length < 1) {
		return {
			ok: false,
			value: {
				kind: ErrorKind.NoData,
				origin: "get_recent",
				tldr: "No recent record found.",
				raw: null
			}
		};
	}

	let recent = [0, 0];
	for (let i = 0; i < records.length; ++i) {
		const date = Date.parse(records[i].created_on);

		if (date > recent[1]) {
			recent = [date, i];
		}
	}

	return {
		ok: true,
		value: records[recent[1]]
	};
}

export async function get_place(record_id: number): Promise<Result<Records.Place.Response, Error>> {
	const response = await api_request<Records.Place.Response, Records.Place.Params>(
		Records.Place.get_url(record_id),
		{},
		Records.Place.Response
	);

	return response;
}

export async function health_check(): Promise<Result<Health.Fancy, Error>> {
	const response = await api_request<Health.Response, Health.Params>(
		Health.get_url(),
		{},
		Health.Response
	);

	if (!response.ok) {
		return {
			ok: false,
			value: {
				...response.value,
				origin: response.value.origin + " > health_check"
			}
		};
	}

	const result: Health.Fancy = {
		successful_responses: 0,
		fast_responses: 0
	};

	for (let i = 0; i < 10; ++i) {
		if (response.value.results[i].conditionResults[0].success) {
			result.successful_responses++;
		}

		if (response.value.results[i].conditionResults[1].success) {
			result.fast_responses++;
		}
	}

	return {
		ok: true,
		value: result
	};
}

export async function is_global(
	map_identifier: MapIdentifier,
	map_list: Maps.Response[]
): Promise<Result<Maps.Response, Error>> {
	switch (map_identifier.kind) {
		case "name": {
			for (let i = 0; i < map_list.length; ++i) {
				if (map_list[i].name.includes(map_identifier.value.toLowerCase())) {
					return {
						ok: true,
						value: map_list[i]
					};
				}
			}
			break;
		}

		case "id": {
			for (let i = 0; i < map_list.length; ++i) {
				if (map_list[i].id === map_identifier.value) {
					return {
						ok: true,
						value: map_list[i]
					};
				}
			}
			break;
		}
	}

	return {
		ok: false,
		value: {
			kind: ErrorKind.NoData,
			origin: "is_global",
			tldr: "This map is not global.",
			raw: null
		}
	};
}
