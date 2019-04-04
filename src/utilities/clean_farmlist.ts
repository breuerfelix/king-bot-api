import { sleep } from '../util';
import api from '../api';

export async function clean_farmlist(farmlist_id: number, losses_farmlist_id: number): Promise<void> {
	const params = [`Collection:FarmListEntry:${farmlist_id}`];
	const listResponse = await api.get_cache(params);

	if (listResponse.length < 1) return;

	for (let data of listResponse[0].data) {
		const farm = data.data;

		// no last report given
		if (!farm.lastReport) continue;

		// report is green
		if (farm.lastReport.notificationType == '1') continue;

		console.log(`moving farm: ${farm.villageName} from list: ${farmlist_id} to list: ${losses_farmlist_id}`);

		// copy to other list
		await api.copy_farmlist_entry(farm.villageId, losses_farmlist_id, farm.entryId);
		await sleep(.5);

		// remove from old list
		await api.toggle_farmlist_entry(farm.villageId, farmlist_id);
		await sleep(.5);
	}
}
