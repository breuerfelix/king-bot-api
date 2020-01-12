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

		lang_feature_desc_hero: 'this feature sends the hero automaticly on an adventure if the health is above given percentage.',
		lang_feature_desc_queue: 'this is an endless building queue. don\'t change the village once it\'s set. if you want to change the village, just do another building queue feature with your desired village',
		lang_feature_desc_raise_fields: 'this feature will raise all your fields to a given level on it\'s own. it will always upgrade the type which got the lowest storage.',
		lang_feature_desc_farming: 'this feature will just send the farmlist in a given interval.',
		lang_feature_desc_trade_route: 'sends merchants from the origin village to the desination at a given interval.',

		lang_home_features: 'your features',
		lang_home_name: 'feature name',
		lang_home_description: 'description',
		lang_home_status: 'status',
		lang_home_off_on: 'off / on',
		lang_home_options: 'options',

		lang_easy_scout_title: 'easy scout',
		lang_easy_scout_description: 'send 1 scout to every farm in the given farmlist',
		lang_easy_scout_amount: 'amount',

		lang_combo_box_select_farmlist: 'select farmlist',
		lang_combo_box_select_village: 'select village',

		lang_label_spy_for: 'spy for',
		lang_label_ressources: 'resources',
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
		lang_adventure_max: 'max',
		lang_adventure_health: 'health',

		lang_queue_res_fields: 'resource fields',
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
		lang_finder_description: 'searches for inactive players and displays their villages based on distance. once you added them to your farmlist, you can use the easy scout feature to spy them.',

		lang_log_level: 'level',
		lang_log_group: 'group',
		lang_log_message: 'message',

		lang_login_notification: 'the bot is going to shut down.... restart it, so the changes take effect.',
		lang_login_reset_features: 'this will reset all features you configured!',
		lang_login_login: 'login',
		lang_login_gameworld: 'gameworld',
		lang_login_email: 'email',
		lang_login_password: 'password',
		lang_login_sitter_dual: 'sitter / dual ?',
		lang_login_optional: '(optional)',
		lang_login_sitter_description: 'if you play as a sitter or dual we need the ingame nick to identify the correct gameworld id',
		lang_login_ingame_name: 'ingame name (only when sitter or dual)',

		lang_trade_source_village: 'select source village',
		lang_trade_dest_village: 'select destination village',
		lang_trade_interval: 'interval in seconds (min / max)',
		lang_trade_send_ress: 'send (wood|clay|iron|crop)',
		lang_trade_source_greater: 'when source is greater than (wood|clay|iron|crop)',
		lang_trade_dest_less: 'and destination is less than (wood|clay|iron|crop)',

		lang_common_min: 'min',
		lang_common_max: 'max',
		lang_common_prov_number: 'provide a number',
	},
	ar: {
		lang_navbar_king_bot_api: 'مساعد المالك السحابي',
		lang_navbar_home: 'الأوامر الحالية',
		lang_navbar_add_feature: 'إضافة أوامر',
		lang_navbar_extras: 'إضافات',
		lang_navbar_easy_scout: 'التجسس على قوائم المزارع',
		lang_navbar_inactive_finder: 'بحث عن القرى الخاملة',
		lang_navbar_logger: 'سجل العملياة',
		lang_navbar_change_login: 'تغير معلومات الدخول',
		lang_navbar_language: 'اللغة',
		lang_navbar_links: 'روابط',
		lang_navbar_landing_page: 'كيفية إستعمال المساعد',
		lang_navbar_github: 'نسخة المطورين',
		lang_navbar_report_bug: 'التبليغ عن مشكلة',
		lang_navbar_releases: 'تحرير',
		lang_navbar_felixbreuer: 'felixbreuer',
		lang_navbar_donate: 'التبرع',

		lang_easy_scout_amount: 'العدد',

		lang_feature_finish_earlier: 'الإنهاء الفوري',
		lang_feature_hero: 'المغامرات',
		lang_feature_farming: 'قوائم النهب',
		lang_feature_queue: 'أوامر البناء',
		lang_feature_raise_fields: 'رفع الحقول',
		lang_feature_trade_route: 'الطريق التجاري',
		lang_feature_timed_attack: 'إرسال الهجمات',

		lang_feature_desc_hero: 'هذة الميزة تمكنك من ارسال البطل للغامرات بشكل تلقائي في حال كانت صحة البطل فوق النسبة المدخلة.',
		lang_feature_desc_queue: 'نقدم لك قائمة مهام لا نهائيه. اذا كنت تريد تغير القرية المراد تطويرها فقط قم بإدخال امر بناء إضافي في قائمة الإنتظار.',
		lang_feature_desc_raise_fields: 'هذه الميزة سوف ترفع جميع الحقول الخاصة بك إلى مستوى معين. سيقوم دائمًا بترقية أقل انتاج لديك.',
		lang_feature_desc_farming: 'هذه الميزة سوف ترسل قوائم المزارع حسب الفترات المدخلة.',
		lang_feature_desc_trade_route: 'هذه الميزه تمكنك من ارسال الموارد لقريتك او لقرية أخرى حسب الفترة الزمنيه المدخلة.',

		lang_home_features: 'الأوامر الخاصه بك',
		lang_home_name: 'الأمر',
		lang_home_description: 'وصف',
		lang_home_status: 'الحالة',
		lang_home_off_on: 'نشط / غير نشط',
		lang_home_options: 'خيارات',

		lang_easy_scout_title: 'التجسس',
		lang_easy_scout_description: 'إرسال 1 جاسوس الى قوائم المزارع المختارة',

		lang_combo_box_select_farmlist: 'إختيار قائمة',
		lang_combo_box_select_village: 'إختيار القرية',

		lang_label_spy_for: 'نوع التجسس',
		lang_label_ressources: 'الموارد',
		lang_label_defence: 'التحصينات',

		lang_table_farmlist: 'قوائم المزارع',
		lang_table_village: 'القرية',
		lang_table_remove: 'حذف',

		lang_table_distance: 'المسافة',
		lang_table_population: 'عدد السكان',
		lang_table_coordinates: 'الإحداثيات',
		lang_table_player: 'إسم الاعب',
		lang_table_kingdom: 'إسم المملكة',
		lang_table_tribe: 'القبيلة',
		lang_table_id: 'المعرف',
		lang_table_name: 'الإسم',
		lang_table_lvl: 'المستوى',
		lang_table_pos: 'الترتيب',

		lang_button_submit: 'تأكيد',
		lang_button_cancel: 'إلغاء',
		lang_button_delete: 'حذف',
		lang_button_search: 'بحث',

		lang_adventure_adventure_type: 'نوع المغامرة',
		lang_adventure_short: 'قصيرة',
		lang_adventure_long: 'طويلة',
		lang_adventure_min_health: 'أدنى نسبة صحة',
		lang_adventure_max: 'أقصى',
		lang_adventure_health: 'الصحة',

		lang_queue_res_fields: 'حقول الموارد',
		lang_queue_buildings: 'المباني',
		lang_queue_queue: 'الدور',
		lang_queue_level: 'المستوى',
		lang_queue_wood: 'الخشب',
		lang_queue_clay: 'الطين',
		lang_queue_iron: 'الحديد',
		lang_queue_crop: 'القمح',

		lang_farmlist_add: 'إضافة قائمة مزارع',
		lang_farmlist_interval: 'الفترة بالثواني (أدنى / أقصى )',
		lang_farmlist_losses: 'إرسال المزارع التي يظهر فيها خسائر الى',

		lang_finder_default: 'افتراضي',
		lang_finder_name: 'مسكتشف الخاملين',
		lang_finder_distance_to: 'المسافة بالنسبة الى',
		lang_finder_player_pop: 'سكان الاعب ( أدنى /أقصى )',
		lang_finder_village_pop: 'سكان القرية ( أدنى / أقصى )',
		lang_finder_distance: 'السافة ( أدنى / أقصى )',
		lang_finder_add_list: 'إضف للقائمة',
		lang_finder_inactive_for: 'غير نشط منذ',
		lang_finder_days: 'أيام',
		lang_finder_description: 'البحث عن الاعبين الخاملين واستعراض قراهم بالنسبه للمسافه بينكم. تستطيع استخدام ميزة التجسس عند إضافتهم لقوائم المزارع.',

		lang_log_level: 'المستوى',
		lang_log_group: 'المجموعة',
		lang_log_message: 'رسالة',

		lang_login_notification: 'سيتم إعادة تشغيل البوت لتحديث التعييرات.',
		lang_login_reset_features: 'سؤدي هذا الأمر لإعادة جميع الميزات التي قمت بإنشائها.',
		lang_login_login: 'دخول',
		lang_login_gameworld: 'عالم اللعب',
		lang_login_email: 'الإيميل',
		lang_login_password: 'الباسورد',
		lang_login_sitter_dual: 'حساب وكيل / شريك ؟',
		lang_login_optional: '((إختياري))',
		lang_login_sitter_description: 'فقط إذا كنت وكيل او شريك، نحن نحتاج اسم العضوية لتحديد عالم اللعب الصحيح.',
		lang_login_ingame_name: 'اسم العضويه ( فقط في حالة وكيل او شريك )',

		lang_trade_source_village: 'إختيار القرية المرسل منها',
		lang_trade_dest_village: 'إختيار قرية الهدف',
		lang_trade_interval: 'الفترات بالثواني ( أدنى / أقصى )',
		lang_trade_send_ress: 'إرسال ( خشب|طين|حديد|قمح)',
		lang_trade_source_greater: 'عندما تكون موارد القرية المرسل منها أكثر من (إرسال ( خشب|طين|حديد|قمح )',
		lang_trade_dest_less: 'وقرية الهدف أقل من ( خشب|طين|حديد|قمح )',

		lang_common_min: 'أدنى',
		lang_common_max: 'أقصى',
		lang_common_prov_number: 'أدخل رقم صحيح',
	},
	it: {
		lang_navbar_king_bot_api: 'king-bot-api',
		lang_navbar_home: 'home',
		lang_navbar_add_feature: 'aggiungi funzione',
		lang_navbar_extras: 'extra',
		lang_navbar_easy_scout: 'spia rapida',
		lang_navbar_inactive_finder: 'ricerca inattivi',
		lang_navbar_logger: 'logger',
		lang_navbar_change_login: 'cambia account',
		lang_navbar_language: 'lingua',
		lang_navbar_links: 'collegamenti',
		lang_navbar_landing_page: 'sito web',
		lang_navbar_github: 'github',
		lang_navbar_report_bug: 'segnala un problema',
		lang_navbar_releases: 'versioni',
		lang_navbar_felixbreuer: 'felixbreuer',
		lang_navbar_donate: 'dona',

		lang_feature_finish_earlier: 'completa subito',
		lang_feature_hero: 'auto avventure',
		lang_feature_farming: 'lancia lista farm',
		lang_feature_queue: 'coda di costruzione',
		lang_feature_raise_fields: 'aumenta campi',
		lang_feature_trade_route: 'percorso di scambio',
		lang_feature_timed_attack: 'attacco a tempo',

		lang_feature_desc_hero: 'questa opzione invia automaticamente l\'eroe in avventura se la sua salute è superiore alla percentuale data.',
		lang_feature_desc_queue: 'questa è la coda di costruzione infinita. non cambiare villaggio una volta impostato. se vuoi cambiare villaggio, aggiungi una nuova coda di costruzione con il villaggio desiderato.',
		lang_feature_desc_raise_fields: 'questa opzione amplierà automaticamente tutti i tuoi campi di risorse fino al livello impostato. migliorerà sempre il tipo di risorsa con la scorta più bassa a magazzino.',
		lang_feature_desc_farming: 'questa opzione invierà la lista farm con l\'intervallo impostato.',
		lang_feature_desc_trade_route: 'invia mercanti dal villaggio impostato al villaggio di destinazione all\'intervallo impostato.',

		lang_home_features: 'le tue opzioni',
		lang_home_name: 'nome opzione',
		lang_home_description: 'descrizione',
		lang_home_status: 'stato',
		lang_home_off_on: 'off / on',
		lang_home_options: 'impostazioni',

		lang_easy_scout_title: 'spia rapida',
		lang_easy_scout_description: 'manda 1 spia ad ogni farm nella lista farm impostata',
		lang_easy_scout_amount: 'quantità',

		lang_combo_box_select_farmlist: 'seleziona lista farm',
		lang_combo_box_select_village: 'seleziona villaggio',

		lang_label_spy_for: 'spia per',
		lang_label_ressources: 'risorse',
		lang_label_defence: 'difese',

		lang_table_farmlist: 'lista farm',
		lang_table_village: 'villaggio',
		lang_table_remove: 'rimuovi',

		lang_table_distance: 'distanza',
		lang_table_population: 'popolazione',
		lang_table_coordinates: 'coordinate',
		lang_table_player: 'giocatore',
		lang_table_kingdom: 'regno',
		lang_table_tribe: 'tribù',
		lang_table_id: 'id',
		lang_table_name: 'nome',
		lang_table_lvl: 'lvl',
		lang_table_pos: 'pos',

		lang_button_submit: 'imposta',
		lang_button_cancel: 'annulla',
		lang_button_delete: 'elimina',
		lang_button_search: 'cerca',

		lang_adventure_adventure_type: 'tipo avventura',
		lang_adventure_short: 'breve',
		lang_adventure_long: 'lunga',
		lang_adventure_min_health: 'salute minima',
		lang_adventure_max: 'max',
		lang_adventure_health: 'salute',

		lang_queue_res_fields: 'campi di risorse',
		lang_queue_buildings: 'edifici',
		lang_queue_queue: 'coda',
		lang_queue_level: 'livello',
		lang_queue_wood: 'legno',
		lang_queue_clay: 'argilla',
		lang_queue_iron: 'ferro',
		lang_queue_crop: 'grano',

		lang_farmlist_add: 'aggiungi lista farm',
		lang_farmlist_interval: 'intervallo in secondi (min / max)',
		lang_farmlist_losses: 'invia farm con perdite a',

		lang_finder_default: 'default',
		lang_finder_name: 'ricerca inattivi',
		lang_finder_distance_to: 'distanza relativa da',
		lang_finder_player_pop: 'pop giocatore (min / max)',
		lang_finder_village_pop: 'pop villaggio (min / max)',
		lang_finder_distance: 'distanza (min / max)',
		lang_finder_add_list: 'aggiungi alla lista farm',
		lang_finder_inactive_for: 'inattivo per',
		lang_finder_days: 'giorni',
		lang_finder_description: 'ricerca giocatori inattivi e mostra i loro villaggi in base alla distanza. una volta aggiunti alla lista farm, puoi usare spia rapida per spiarli.',

		lang_log_level: 'livello',
		lang_log_group: 'gruppo',
		lang_log_message: 'messaggio',

		lang_login_notification: 'il bot si sta spegnendo.... riavvialo, in modo da applicare le modifiche.',
		lang_login_reset_features: 'questo resetterà tutte le opzioni configurate!',
		lang_login_login: 'login',
		lang_login_gameworld: 'mondo di gioco',
		lang_login_email: 'email',
		lang_login_password: 'password',
		lang_login_sitter_dual: 'sitter / dual ?',
		lang_login_optional: '(opzionale)',
		lang_login_sitter_description: 'se giochi come sitter o dual abbiamo bisogno del nome profilo in gioco per identificare correttamente l\'id del mondo di gioco',
		lang_login_ingame_name: 'nome profilo in gioco (solo se sitter o dual)',

		lang_trade_source_village: 'seleziona il villaggio di partenza',
		lang_trade_dest_village: 'seleziona il villaggio di destinazione',
		lang_trade_interval: 'intervallo in secondi (min / max)',
		lang_trade_send_ress: 'invia (legno|argilla|ferro|grano)',
		lang_trade_source_greater: 'quando l\'origine è maggiore di (legno|argilla|ferro|grano)',
		lang_trade_dest_less: 'e la destinazione è minore di (legno|argilla|ferro|grano)',

		lang_common_min: 'min',
		lang_common_max: 'max',
		lang_common_prov_number: 'fornisci un numero',
	},
	lt: {
		lang_navbar_king_bot_api: 'king-bot-api',
		lang_navbar_home: 'namai',
		lang_navbar_add_feature: 'pridėti funkciją',
		lang_navbar_extras: 'extra',
		lang_navbar_easy_scout: 'lengvas šnipinėjimas',
		lang_navbar_inactive_finder: 'neaktyviu žaidėjų ieškiklis',
		lang_navbar_logger: 'žurnalas',
		lang_navbar_change_login: 'pakeisti prisijungimo duomenis',
		lang_navbar_language: 'kalbda',
		lang_navbar_links: 'saitai',
		lang_navbar_landing_page: 'namai',
		lang_navbar_github: 'github',
		lang_navbar_report_bug: 'panešti apie klaidą',
		lang_navbar_releases: 'išleidimai',
		lang_navbar_felixbreuer: 'felixbreuer',
		lang_navbar_donate: 'palaikimas',

		lang_feature_finish_earlier: 'staigus užbaigimas',
		lang_feature_hero: 'automatinis nuotykis',
		lang_feature_farming: 'farmlist ataku siuntimas',
		lang_feature_queue: 'pastatu eilė',
		lang_feature_raise_fields: 'kelti laukus',
		lang_feature_trade_route: 'prekybos keliai',
		lang_feature_timed_attack: 'atakos paskirtu laiku',

		lang_feature_desc_hero: 'Ši funkcija automatiškai siunčia herojų į nuotykį, kai sveikata viršija nurodytą procentą.',
		lang_feature_desc_queue: 'Ši funkcija yra nesibaigianti statybų eilė. Pasirinkę kaimą, jo nekeiskite. Jei norite pakeisti kaimą, pridekite dar vieną pastato eilės funkciją su norimu kaimu.',
		lang_feature_desc_raise_fields: 'Ši funkcija padidins visus jūsų laukus iki nurodyto lygio. Ši funkcija visada pakels resursu rūši, kurio yra mažiausia saugykloje.',
		lang_feature_desc_farming: 'Ši funkcija tiesiog paleis farmlist tam tikru intervalu.',
		lang_feature_desc_trade_route: 'Ši funkcija siunčia prekeivius iš kilmės kaimo į paskirties kaima pasirinktu intervalu.',

		lang_home_features: 'Tavo funkcijos',
		lang_home_name: 'Funkcijos pavadinimas',
		lang_home_description: 'Apibūdinimas',
		lang_home_status: 'Statusas',
		lang_home_off_on: 'Išjungti / Įjungti',
		lang_home_options: 'Galimybės',

		lang_easy_scout_title: 'lengvas šnipinėjimas',
		lang_easy_scout_description: 'siųskite 1 skautą į kiekvieną nurodyto farmlist ferma',
		lang_easy_scout_amount: 'kiekis',

		lang_combo_box_select_farmlist: 'pasirink farmlist',
		lang_combo_box_select_village: 'pasirink kaima',

		lang_label_spy_for: 'šnipinėti',
		lang_label_ressources: 'resursai',
		lang_label_defence: 'gynyba',

		lang_table_farmlist: 'farmlist',
		lang_table_village: 'kaimas',
		lang_table_remove: 'pašalinti',

		lang_table_distance: 'atstumas',
		lang_table_population: 'gyventojų skaičius',
		lang_table_coordinates: 'koordinatės',
		lang_table_player: 'žaidėjas',
		lang_table_kingdom: 'karalystė',
		lang_table_tribe: 'gentis',
		lang_table_id: 'id',
		lang_table_name: 'vardas',
		lang_table_lvl: 'lvl',
		lang_table_pos: 'pozicija',

		lang_button_submit: 'užbaigti',
		lang_button_cancel: 'atšaukti',
		lang_button_delete: 'ištrinti',
		lang_button_search: 'paieška',

		lang_adventure_adventure_type: 'nuotykio tipas',
		lang_adventure_short: 'trumpas',
		lang_adventure_long: 'ilgas',
		lang_adventure_min_health: 'minimali sveikata',
		lang_adventure_max: 'maksimali sveikata',
		lang_adventure_health: 'sveikata',

		lang_queue_res_fields: 'resursu laukai',
		lang_queue_buildings: 'pastatai',
		lang_queue_queue: 'eilė',
		lang_queue_level: 'level',
		lang_queue_wood: 'mediena',
		lang_queue_clay: 'molis',
		lang_queue_iron: 'geležies',
		lang_queue_crop: 'grūdai',

		lang_farmlist_add: 'pridėti farmlist',
		lang_farmlist_interval: 'intervalas sekundėmis (min / max)',
		lang_farmlist_losses: 'siųsti fermas su nuostoliais į',

		lang_finder_default: 'numatytas',
		lang_finder_name: 'neaktyviu žaidėjų ieškiklis',
		lang_finder_distance_to: 'atstumas nuo',
		lang_finder_player_pop: 'žaidėjų populiacija (min / max)',
		lang_finder_village_pop: 'kaimo populiacija (min / max)',
		lang_finder_distance: 'atstumas (min / max)',
		lang_finder_add_list: 'pridėti i farmlist',
		lang_finder_inactive_for: 'neaktyvumo laikas',
		lang_finder_days: 'dienos',
		lang_finder_description: 'Ieško neaktyvių žaidėjų ir rodo jų gyvenvietes pagal atstumą. Pridėję juos prie savo farmlist, galite naudoti paprastą skautų funkciją, norėdami juos šnipinėti.',

		lang_log_level: 'level',
		lang_log_group: 'grupė',
		lang_log_message: 'žinutė',

		lang_login_notification: 'robotas bus išjungtas .... paleiskite jį iš naujo, kad pakeitimai įsigaliotų.',
		lang_login_reset_features: 'tai atkurs visas sukonfigūruotas funkcijas!',
		lang_login_login: 'Prisijungti',
		lang_login_gameworld: 'žaidimų pasaulis',
		lang_login_email: 'email',
		lang_login_password: 'slaptažodis',
		lang_login_sitter_dual: 'sitter / dual ?',
		lang_login_optional: '(neprivaloma)',
		lang_login_sitter_description: 'jei žaidžiate kaip sitter ar dual, mums reikia žaidimo slapyvardžio, kad būtų galima nustatyti teisingą žaidimo pasaulio ID',
		lang_login_ingame_name: 'vardas žaidime (tik tada, kai sitter ar dual)',

		lang_trade_source_village: 'pasirinkti pradini kaima',
		lang_trade_dest_village: 'pasirinkti paskirties kaim',
		lang_trade_interval: 'intervalas sekundėmis (min / max)',
		lang_trade_send_ress: 'siųsti (mediena | molis | geležis | grūdai)',
		lang_trade_source_greater: 'kai šaltinis turi daugiau nei (mediena | molis | geležis | grūdai)',
		lang_trade_dest_less: 'ir kelionės tikslas turi mažiau nei (mediena | molis | geležis | grūdai)',

		lang_common_min: 'min',
		lang_common_max: 'max',
		lang_common_prov_number: 'pateikti numerį',
	}
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
