// all number types have to be converted with Number(value) to be sure it's a number

export interface Ifarmlist {
	listId: number;
	listName: string;
	lastSent: Date;
	lastChanged: Date;
	units: Iunits;
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
	units: Iunits; 	
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

export interface Iunits {
	[index: number]: number
	1: number;
	2: number;
	3: number;
	4: number;
	5: number;
	6: number;
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

export interface Ibuilding {

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
	1: number;
	2: number;
	3: number;
	4: number;
}
