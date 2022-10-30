export enum ErrorKind {
	GlobalAPI,
	KZGO,
	Parsing,
	Input,
	NoData,
	Other
}

export interface Error {
	kind: ErrorKind;
	origin: string;
	tldr: string;
	raw: any;
}

export type Result<T, E = Error> =
	| {
			ok: true;
			value: T;
	  }
	| {
			ok: false;
			value: E;
	  };

export class SteamID {
	public value: string;

	constructor(value: string) {
		this.value = value;
	}

	public test(input: string): boolean {
		const regex = /STEAM_[0-1]:[0-1]:[0-9]+/;
		return regex.test(input);
	}
}

export enum ModeKind {
	KZTimer,
	SimpleKZ,
	Vanilla
}

export class Mode {
	public kind: ModeKind;

	constructor(kind: ModeKind) {
		this.kind = kind;
	}

	public static from_id(id: number): Result<ModeKind, Error> {
		if (id === 200) {
			return {
				ok: true,
				value: ModeKind.KZTimer
			};
		} else if (id === 201) {
			return {
				ok: true,
				value: ModeKind.SimpleKZ
			};
		} else if (id === 202) {
			return {
				ok: true,
				value: ModeKind.Vanilla
			};
		} else {
			return {
				ok: false,
				value: {
					kind: ErrorKind.Input,
					origin: "Mode.from_id()",
					tldr: `Failed to convert from ID to Mode. ${id} is not a valid ID.`,
					raw: null
				}
			};
		}
	}

	public as_id(): number {
		if (this.kind === ModeKind.KZTimer) {
			return 200;
		} else if (this.kind === ModeKind.SimpleKZ) {
			return 201;
		} else if (this.kind === ModeKind.Vanilla) {
			return 202;
		} else {
			return 200;
		}
	}

	public fancy(): string {
		if (this.kind === ModeKind.KZTimer) {
			return "KZTimer";
		} else if (this.kind === ModeKind.SimpleKZ) {
			return "SimpleKZ";
		} else if (this.kind === ModeKind.Vanilla) {
			return "Vanilla";
		} else {
			return "KZTimer";
		}
	}

	public fancy_short(): string {
		if (this.kind === ModeKind.KZTimer) {
			return "KZT";
		} else if (this.kind === ModeKind.SimpleKZ) {
			return "SKZ";
		} else if (this.kind === ModeKind.Vanilla) {
			return "VNL";
		} else {
			return "KZT";
		}
	}

	public to_string(): string {
		if (this.kind === ModeKind.KZTimer) {
			return "kz_timer";
		} else if (this.kind === ModeKind.SimpleKZ) {
			return "kz_simple";
		} else if (this.kind === ModeKind.Vanilla) {
			return "kz_vanilla";
		} else {
			return "kz_timer";
		}
	}

	public static from_string(s: string): Result<Mode, Error> {
		switch (s.toLowerCase()) {
			case "kz_timer" || "kztimer" || "kzt": {
				return {
					ok: true,
					value: new Mode(ModeKind.KZTimer)
				};
			}

			case "kz_simple" || "simplekz" || "skz": {
				return {
					ok: true,
					value: new Mode(ModeKind.SimpleKZ)
				};
			}

			case "kz_vanilla" || "vanilla" || "vnl": {
				return {
					ok: true,
					value: new Mode(ModeKind.Vanilla)
				};
			}

			default: {
				return {
					ok: false,
					value: {
						kind: ErrorKind.Input,
						origin: "Mode.from_string()",
						tldr: `Failed to convert from string to Mode. ${s} is not a valid identifier.`,
						raw: null
					}
				};
			}
		}
	}
}

export type MapIdentifier =
	| {
			kind: "name";
			value: string;
	  }
	| {
			kind: "id";
			value: number;
	  };

export type PlayerIdentifier =
	| {
			kind: "name";
			value: string;
	  }
	| {
			kind: "steam_id";
			value: SteamID;
	  };

enum RankName {
	Legend,
	Master,
	Pro,
	Semipro,
	ExpertPlus,
	Expert,
	ExpertMinus,
	SkilledPlus,
	Skilled,
	SkilledMinus,
	RegularPlus,
	Regular,
	RegularMinus,
	CasualPlus,
	Casual,
	CasualMinus,
	AmateurPlus,
	Amateur,
	AmateurMinus,
	BeginnerPlus,
	Beginner,
	BeginnerMinus,
	New
}

export class Rank {
	public kind: RankName;

	constructor(kind: RankName) {
		this.kind = kind;
	}

	public static from_points(points: number, mode: ModeKind): Rank {
		switch (mode) {
			case ModeKind.KZTimer: {
				if (points > 1_000_000) {
					return new Rank(RankName.Legend);
				} else if (points > 800_000) {
					return new Rank(RankName.Master);
				} else if (points > 600_000) {
					return new Rank(RankName.Pro);
				} else if (points > 400_000) {
					return new Rank(RankName.Semipro);
				} else if (points > 250_000) {
					return new Rank(RankName.ExpertPlus);
				} else if (points > 230_000) {
					return new Rank(RankName.Expert);
				} else if (points > 200_000) {
					return new Rank(RankName.ExpertMinus);
				} else if (points > 150_000) {
					return new Rank(RankName.SkilledPlus);
				} else if (points > 120_000) {
					return new Rank(RankName.Skilled);
				} else if (points > 100_000) {
					return new Rank(RankName.SkilledMinus);
				} else if (points > 80_000) {
					return new Rank(RankName.RegularPlus);
				} else if (points > 70_000) {
					return new Rank(RankName.Regular);
				} else if (points > 60_000) {
					return new Rank(RankName.RegularMinus);
				} else if (points > 40_000) {
					return new Rank(RankName.CasualPlus);
				} else if (points > 30_000) {
					return new Rank(RankName.Casual);
				} else if (points > 20_000) {
					return new Rank(RankName.CasualMinus);
				} else if (points > 10_000) {
					return new Rank(RankName.AmateurPlus);
				} else if (points > 5_000) {
					return new Rank(RankName.Amateur);
				} else if (points > 2_000) {
					return new Rank(RankName.AmateurMinus);
				} else if (points > 1_000) {
					return new Rank(RankName.BeginnerPlus);
				} else if (points > 500) {
					return new Rank(RankName.Beginner);
				} else if (points > 0) {
					return new Rank(RankName.BeginnerMinus);
				} else {
					return new Rank(RankName.New);
				}
			}

			case ModeKind.SimpleKZ: {
				if (points > 800_000) {
					return new Rank(RankName.Legend);
				} else if (points > 500_000) {
					return new Rank(RankName.Master);
				} else if (points > 400_000) {
					return new Rank(RankName.Pro);
				} else if (points > 300_000) {
					return new Rank(RankName.Semipro);
				} else if (points > 250_000) {
					return new Rank(RankName.ExpertPlus);
				} else if (points > 230_000) {
					return new Rank(RankName.Expert);
				} else if (points > 200_000) {
					return new Rank(RankName.ExpertMinus);
				} else if (points > 150_000) {
					return new Rank(RankName.SkilledPlus);
				} else if (points > 120_000) {
					return new Rank(RankName.Skilled);
				} else if (points > 100_000) {
					return new Rank(RankName.SkilledMinus);
				} else if (points > 80_000) {
					return new Rank(RankName.RegularPlus);
				} else if (points > 70_000) {
					return new Rank(RankName.Regular);
				} else if (points > 60_000) {
					return new Rank(RankName.RegularMinus);
				} else if (points > 40_000) {
					return new Rank(RankName.CasualPlus);
				} else if (points > 30_000) {
					return new Rank(RankName.Casual);
				} else if (points > 20_000) {
					return new Rank(RankName.CasualMinus);
				} else if (points > 10_000) {
					return new Rank(RankName.AmateurPlus);
				} else if (points > 5_000) {
					return new Rank(RankName.Amateur);
				} else if (points > 2_000) {
					return new Rank(RankName.AmateurMinus);
				} else if (points > 1_000) {
					return new Rank(RankName.BeginnerPlus);
				} else if (points > 500) {
					return new Rank(RankName.Beginner);
				} else if (points > 0) {
					return new Rank(RankName.BeginnerMinus);
				} else {
					return new Rank(RankName.New);
				}
			}

			case ModeKind.Vanilla: {
				if (points > 600_000) {
					return new Rank(RankName.Legend);
				} else if (points > 400_000) {
					return new Rank(RankName.Master);
				} else if (points > 300_000) {
					return new Rank(RankName.Pro);
				} else if (points > 250_000) {
					return new Rank(RankName.Semipro);
				} else if (points > 200_000) {
					return new Rank(RankName.ExpertPlus);
				} else if (points > 180_000) {
					return new Rank(RankName.Expert);
				} else if (points > 160_000) {
					return new Rank(RankName.ExpertMinus);
				} else if (points > 140_000) {
					return new Rank(RankName.SkilledPlus);
				} else if (points > 120_000) {
					return new Rank(RankName.Skilled);
				} else if (points > 100_000) {
					return new Rank(RankName.SkilledMinus);
				} else if (points > 80_000) {
					return new Rank(RankName.RegularPlus);
				} else if (points > 70_000) {
					return new Rank(RankName.Regular);
				} else if (points > 60_000) {
					return new Rank(RankName.RegularMinus);
				} else if (points > 40_000) {
					return new Rank(RankName.CasualPlus);
				} else if (points > 30_000) {
					return new Rank(RankName.Casual);
				} else if (points > 20_000) {
					return new Rank(RankName.CasualMinus);
				} else if (points > 10_000) {
					return new Rank(RankName.AmateurPlus);
				} else if (points > 5_000) {
					return new Rank(RankName.Amateur);
				} else if (points > 2_000) {
					return new Rank(RankName.AmateurMinus);
				} else if (points > 1_000) {
					return new Rank(RankName.BeginnerPlus);
				} else if (points > 500) {
					return new Rank(RankName.Beginner);
				} else if (points > 0) {
					return new Rank(RankName.BeginnerMinus);
				} else {
					return new Rank(RankName.New);
				}
			}
		}
	}

	public to_string(): string {
		switch (this.kind) {
			case RankName.Legend:
				return "Legend";
			case RankName.Master:
				return "Master";
			case RankName.Pro:
				return "Pro";
			case RankName.Semipro:
				return "Semipro";
			case RankName.ExpertPlus:
				return "Expert+";
			case RankName.Expert:
				return "Expert";
			case RankName.ExpertMinus:
				return "Expert-";
			case RankName.SkilledPlus:
				return "Skilled+";
			case RankName.Skilled:
				return "Skilled";
			case RankName.SkilledMinus:
				return "Skilled-";
			case RankName.RegularPlus:
				return "Regular+";
			case RankName.Regular:
				return "Regular";
			case RankName.RegularMinus:
				return "Regular-";
			case RankName.CasualPlus:
				return "Casual+";
			case RankName.Casual:
				return "Casual";
			case RankName.CasualMinus:
				return "Casual-";
			case RankName.AmateurPlus:
				return "Amateur+";
			case RankName.Amateur:
				return "Amateur";
			case RankName.AmateurMinus:
				return "Amateur-";
			case RankName.BeginnerPlus:
				return "Beginner+";
			case RankName.Beginner:
				return "Beginner";
			case RankName.BeginnerMinus:
				return "Beginner-";
			case RankName.New:
				return "New";
		}
	}
}
