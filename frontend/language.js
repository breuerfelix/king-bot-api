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

		lang_button_submit: 'submit',
		lang_button_cancel: 'cancel',
	},
	de: {
		lang_feature_farming: 'farmlisten schicken',
		lang_feature_finish_earlier: 'schnell beenden',
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

	changeLanguage(lang) {
		// default language
		if (!(lang in languages)) lang = 'en';
		this.currentLanguage = lang;
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
