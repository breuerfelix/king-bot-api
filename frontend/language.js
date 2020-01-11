import axios from 'axios';

const languages = {
	en: {
		lang_navbar_king_bot_api: 'king-bot-api',
		lang_navbar_home: 'home',
		lang_navbar_add_feature: 'add feature',
		lang_navbar_extras: 'extras',
		lang_navbar_easy_scout: 'easy scout',
		lang_navbar_inactive_finder: 'inactive finder',
		lang_navbar_logger: 'logger',
		lang_navbar_change_login: 'change login',
		lang_navbar_language: 'language',
		lang_navbar_links: 'links',
		lang_navbar_landing_page: 'landing page',
		lang_navbar_github: 'github',
		lang_navbar_report_bug: 'report a bug',
		lang_navbar_releases: 'releases',
		lang_navbar_felixbreuer: 'felixbreuer',
		lang_navbar_donate: 'donate',

		lang_feature_finish_earlier: 'instant finish',
		lang_feature_hero: 'auto adventure',
		lang_feature_farming: 'send farmlists',
		lang_feature_queue: 'building queue',
		lang_feature_raise_fields: 'raise fields',
		lang_feature_trade_route: 'trade route',
		lang_feature_timed_attack: 'timed attack',

		lang_home_features: 'your features',
		lang_home_name: 'feature name',
		lang_home_description: 'description',
		lang_home_status: 'status',
		lang_home_off_on: 'off / on',
		lang_home_options: 'options',

		lang_easy_scout_title: 'easy scout',
		lang_easy_scout_description: 'send 1 scout to every farm in the given farmlist',

		lang_combo_box_select_farmlist: 'select farmlist',
		lang_combo_box_select_village: 'select village',

		lang_label_spy_for: 'spy for',
		lang_label_ressources: 'ressources',
		lang_label_defence: 'defence',

		lang_table_farmlist: 'farmlist',
		lang_table_village: 'village',
		lang_table_remove: 'remove',

		lang_table_distance: 'distance',
		lang_table_population: 'population',
		lang_table_coordinates: 'coordinates',
		lang_table_player: 'player',
		lang_table_kingdom: 'kingdom',
		lang_table_tribe: 'tribe',
		lang_table_id: 'id',
		lang_table_name: 'name',
		lang_table_lvl: 'lvl',
		lang_table_pos: 'pos',

		lang_button_submit: 'submit',
		lang_button_cancel: 'cancel',
		lang_button_delete: 'delete',
		lang_button_search: 'search',

		lang_adventure_adventure_type: 'adventure type',
		lang_adventure_short: 'short',
		lang_adventure_long: 'long',
		lang_adventure_min_health: 'minimum health',
		lang_adventure_min: 'min',
		lang_adventure_max: 'max',
		lang_adventure_health: 'health',
		lang_adventure_prov_number: 'provide a number',

		lang_queue_res_fields: 'ressource fields',
		lang_queue_buildings: 'buildings',
		lang_queue_queue: 'queue',
		lang_queue_level: 'level',
		lang_queue_wood: 'wood',
		lang_queue_clay: 'clay',
		lang_queue_iron: 'iron',
		lang_queue_crop: 'crop',

		lang_farmlist_add: 'add farmlist',
		lang_farmlist_interval: 'interval in seconds (min / max)',
		lang_farmlist_losses: 'send farms with losses to',

		lang_finder_default: 'default',
		lang_finder_name: 'inactive finder',
		lang_finder_distance_to: 'distance relative to',
		lang_finder_player_pop: 'player pop (min / max)',
		lang_finder_village_pop: 'village pop (min / max)',
		lang_finder_distance: 'distance (min / max)',
		lang_finder_add_list: 'add to farmlist',
		lang_finder_inactive_for: 'inactive for',
		lang_finder_days: 'days',

		lang_log_level: 'level',
		lang_log_group: 'group',
		lang_log_message: 'message',
	},
	de: {
		lang_feature_farming: 'farmlisten schicken',
		lang_feature_finish_earlier: '5 min früher beenden',
	},
};

class Language {
	availableLanguages = [];
	currentLanguage = 'en';
	store = null;

	constructor() {
		this.availableLanguages = Object.keys(languages);
	}

	translate(token) {
		if (!(token in languages[this.currentLanguage])) return token;
		return languages[this.currentLanguage][token];
	}

	changeLanguage(lang, post = true) {
		// default language
		if (!(lang in languages)) lang = 'en';
		this.currentLanguage = lang;

		if (post) axios.post('/api/language', { language: lang });

		if (!this.store) return;
		this.store.setState({ ...languages[lang] });
	}
}

const storeKeys = Object.keys(languages.en).join(',');

export {
	languages,
	storeKeys,
};

export default new Language();
