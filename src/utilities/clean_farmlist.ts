import { sleep } from '../util';
import api from '../api';

export async function clean_farmlist(farmlist_id: number, losses_farmlist_id: number): Promise<boolean> {
	const finished = true; //Returning true at the end to know when this is finished.
	const params = [`Collection:FarmListEntry:${farmlist_id}`]
	var listResponse = await api.get_cache(params);
	if (listResponse.length > 0) {
		listResponse[0].data.forEach(async (data: any) => {
			const farm = data.data;
			if (farm.lastReport) {
				if (farm.lastReport.notificationType != '1') {
					console.log("removing")
					await api.copy_farmlist_entry(farm.villageId, losses_farmlist_id, farm.entryId);
					await sleep(.15);
					await api.copy_farmlist_entry(farm.villageId, farmlist_id, farm.entryId);
				}
			} else {
				console.log(farm)
				await api.copy_farmlist_entry(farm.villageId, losses_farmlist_id, farm.entryId);
				await sleep(.15);
				await api.copy_farmlist_entry(farm.villageId, farmlist_id, farm.entryId);
			}
		});
	}
	else {
		//TODO: Send 1 attack to test? 
		//No you have to test before putting farm on list. Otherwise we would have to look to see if the farmlist has empty reports and send all that are not empty and send the empty one if there is not currently an attack underway.
		//Better to just assume the farm is good.
	}
	return finished;
}