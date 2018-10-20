import { tribe } from './data';

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
