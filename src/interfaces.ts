import database from './database';

export enum tribe {
	roman = '1',
	teuton = '2',
	gaul = '3'
}

export interface Ifeature_params extends Ifeature, Ioptions {
	description?: string
}

export interface Ioptions {
	run: boolean
	error: boolean
}

export interface Ifeature {
	ident: string
	name: string
}

export interface Irequest {
	action: string
	feature: Ifeature_params
}

export abstract class feature {
	running: boolean = false;

	params: Ifeature;

	abstract set_default_options(): void;
	abstract set_params(): void;
	abstract set_options(options: Ioptions): void;

	abstract get_options(): Ioptions;
	abstract get_description(): string;

	abstract update(options: Ioptions): void;
	abstract start(): void;

	constructor() {
		this.set_params();

		const options: Ioptions = database.get(`${this.params.ident}.options`).value();

		if(!options) this.set_default_options();
		else this.set_options({ ...options });
	}

	get_feature_params(): Ifeature_params {
		return { ...this.params, description: this.get_description(), ...this.get_options() };
	}

	start_for_server(): void {
		if(this.get_options().run) this.run();
	}

	stop(): void {
		this.set_options({ ...this.get_options(), run: false });
		database.set(`${this.params.ident}.options`, this.get_options()).write();
	}

	run(): void {
		this.set_options({ ...this.get_options(), run: true });
		database.set(`${this.params.ident}.options`, this.get_options()).write();
		this.start();
	}

	handle_request(payload: Irequest): any {
		const { action } = payload;

		if(action == 'start') {
			this.set_options({ ...this.get_options(), run: true });
			if(!this.running) this.run();
			return 'online';
		}

		if(action == 'stop') {
			this.stop();
			return 'offline';
		}

		if(action == 'update') {
			this.update({ ...payload.feature });
			database.set(`${this.params.ident}.options`, this.get_options()).write();

			return 'success';
		}

		return 'error';
	}
}

export interface Ifarmlist {
	listId: number;
	listName: string;
	lastSent: Date;
	lastChanged: Date;
	units: Ifarmlist_units;
	orderNr: number;
	villageIds: number[];
	entryIds: number[];
	isDefault: boolean;
	maxEntriesCount: number;
}

export interface Ifarmlist_entry {
	entryId: number;
	villageId: number;
	villageName: string;
	units: Ifarmlist_units;
	targetOwnerId: number;
	belongsToKing: number;
	population: number;
	coords: Icoordinates;
	isOasis: boolean;
	lastReport: {
		time: Date;
		notificationType: number;
		raidedResSum: number;
		capacity: number;
		reportId: string;
	};
}

export interface Ifarmlist_units {
	[index: number]: number
	1: number;
	2: number;
	3: number;
	4: number;
	5: number;
	6: number;
}

export interface Iunits {
	[index: number]: number
	1: number;
	2: number;
	3: number;
	4: number;
	5: number;
	6: number;
	7: number;
	8: number;
	9: number;
	10: number;
	11: number;
}

export interface Icoordinates {
	[index: string]: number
	x: number;
	y: number;
}

export interface Ivillage {
	villageId: number;
	playerId: number;
	name: string;
	tribeId: number;
	belongsToKing: number;
	belongsToKingdom: number;
	type: number;
	population: number;
	coordinates: Icoordinates;
	isMainVillage: boolean;
	isTown: boolean;
	treasuresUseable: number;
	treasures: number;
	allowTributeCollection: number;
	protectionGranted: number;
	tributeCollectorPlayerId: number;
	realTributePercent: number;
	supplyBuildings: number;
	supplyTroops: number;
	production: Iresources;
	storage: Iresources;
	treasury: Iresources;
	storageCapacity: Iresources;
	usedControlPoints: number;
	availableControlPoints: number;
	culturePoints: number;
	celebrationType: number;
	celebrationEnd: number;
	culturePointProduction: number;
	treasureResourceBonus: number;
	acceptance: number;
	acceptanceProduction: number;
	tributes: Iresources;
	tributesCapacity: number;
	tributeTreasures: number;
	tributeProduction: number;
	tributeProductionDetail: number;
	tributeTime: number;
	tributesRequiredToFetch: number;
	estimatedWarehouseLevel: number;
}

export interface Ibuilding_collection {
	name: string
	data: Ibuilding
}

export interface Ibuilding {
	buildingType: number
	villageId: number
	locationId: number
	lvl: number
	lvlNext: number
	isMaxLvl: boolean
	lvlMax: number
	upgradeCosts: Iresources
	nextUpgradeCosts: { [index: number]: Iresources }
	upgradeTime: number
	nextUpgradeTimes: { [index: number]: number }
	upgradeSupplyUsage: number
	upgradeSupplyUsageSums: { [index: number]: number }
	category: number
	sortOrder: number
	rubble: [] // TODO implement
	rubbleDismantleTime: [] // TODO implement
	effect: number[]
}

export interface Ibuilding_queue {
	villageId: number
	tribeId: number
	freeSlots: {
		[index: number]: number
		1: number // buildings
		2: number // resources
		4: number
	}
	queues: {
		[index: number]: any[]
		1: any[] // buildings
		2: any[] // resources
		4: any[]
		5: any[]
	}
	canUseInstantConstruction: boolean
	canUseInstantConstructionOnlyInVillage: boolean

}

export interface Iresources {
	[index: number]: number
	1: number
	2: number
	3: number
	4: number
}

export interface Ihero {
	playerId: number;
	villageId: number;
	destVillageId: number;
	destVillageName: string;
	destPlayerName: string;
	destPlayerId: number;
	status: number;
	health: number;
	lastHealthTime: number;
	baseRegenerationRate: number;
	regenerationRate: number;
	fightStrength: number;
	fightStrengthPoints: number;
	attBonusPoints: number;
	defBonusPoints: number;
	resBonusPoints: number;
	resBonusType: number;
	freePoints: number;
	speed: number;
	untilTime: number;
	bonuses: any;
	maxScrollsPerDay: number;
	scrollsUsedToday: number;
	waterbucketUsedToday: number;
	ointmentsUsedToday: number;
	adventurePointCardUsedToday: number;
	resourceChestsUsedToday: number;
	cropChestsUsedToday: number;
	artworkUsedToday: number;
	isMoving: boolean;
	adventurePoints: number;
	adventurePointTime: number;
	levelUp: number;
	xp: number;
	xpThisLevel: number;
	xpNextLevel: number;
	level: number;
}

export interface Iplayer {
	//TODO fill interface
	playerId: number
	tribeId: tribe
}
