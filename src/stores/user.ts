import type { Ref } from 'vue';
import { ref } from 'vue';
import { defineStore, acceptHMRUpdate } from 'pinia';

import { useNotify } from 'src/composables/useNotify';

import { anonClient } from 'src/supabase/anon-client';
import type { AppSettings } from 'src/pages/SettingsPage.vue';
import { Dark } from 'quasar';

export const storeUser = defineStore('user', () => {
	const settings: Ref<AppSettings> = ref({
		appearance: {
			dark: Dark.isActive,
		},
		financial: {
			currencySymbol: '$',
		},
	});

	const loadAppSettings = async () => {
		const { data, error } = await anonClient
			.from('user_settings')
			.select('app_settings')
			.single();

		if (error) {
			useNotify('negative', 'Error loading settings', error.message);
		}
		if (data && data.app_settings) {
			const localAppSettings: AppSettings = JSON.parse(
				JSON.stringify(data.app_settings as string)
			);
			settings.value = localAppSettings as AppSettings;
		}

		if (settings.value.appearance.dark) {
			Dark.set(settings.value.appearance.dark);
		}
	};

	const persistAppSettings = async () => {
		const userId = (await anonClient.auth.getSession()).data.session?.user.id;

		if (!userId) {
			useNotify('negative', 'Not Authenticated');
		}

		const { error } = await anonClient.from('user_settings').upsert({
			user_id: userId as string,
			app_settings: JSON.parse(JSON.stringify(settings.value)),
		});
		if (error) {
			useNotify('negative', 'Error saving app settings', error.message);
		} else {
			useNotify('positive', 'Settings saved successfully');
		}
	};

	return {
		settings,
		loadAppSettings,
		persistAppSettings,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(storeUser, import.meta.hot));
}
