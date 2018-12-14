import merge from 'deepmerge';
import logger from './logger';

export function log(obj: any): void {
	logger.info(obj);
}

export function list_remove(item: any, list: any[]): any[] {
	var idx = list.indexOf(item);
	if (idx != -1) {
		return list.splice(idx, 1); // The second parameter is the number of elements to remove.
	}

	return list;
}

export const sleep = (ms: number) => new Promise(res => setTimeout(res, ms * 1000));

export function get_date(): number {
	return Math.floor(Number(Date.now()) / 1000);
} 

export function find_state_data(ident: string, data: any[],  contains: boolean = false): any {
	const found_obj = data.find((x: any) => {
		return contains ? x.name.includes(ident) : x.name == ident;
	});

	return found_obj.data;
}

export function get_random_int(min: number, max: number): number {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function get_diff_time(time: number): number {
	return Number(time) - get_date();
}

export function clash_obj(merge_obj: any, ident: string, ident2: string = ''): any {
	let rv: any = {};

	if(!merge_obj) return merge_obj;

	// TODO prettify this function a little bit
	// merges response and cache together, response overwrites cache
	if(ident2) {
		if(merge_obj[ident] && merge_obj[ident2]) {
			merge_obj = merge(merge_obj[ident], merge_obj[ident2]);
		} else if(merge_obj[ident]) {
			merge_obj = merge_obj[ident];
		} else if(merge_obj[ident2]) {
			merge_obj = merge_obj[ident2];
		}
	} else {
		if(merge_obj[ident]) merge_obj = merge_obj[ident];
	}

	if(Array.isArray(merge_obj)) {
		rv = [];

		for(let i = 0; i < merge_obj.length; i++) {
			rv.push(clash_obj(merge_obj[i], ident, ident2));
		}

		return rv;
	}


	if(is_object(merge_obj)) {
		rv = {};

		let keys = Object.keys(merge_obj);
		for(let i = 0; i < keys.length; i++) {
			rv[keys[i]] = clash_obj(merge_obj[keys[i]], ident, ident2);
		}

		return rv;
	}

	return merge_obj;
}

export function is_object(val: any) {
	if (val === null) { return false; }
	return ( (typeof val === 'function') || (typeof val === 'object') );
}
