import { reactive } from 'vue';
import { defineStore, acceptHMRUpdate } from 'pinia';

import { Dark } from 'quasar';

export const storeUser = defineStore('myStore', () => {
	const settings = reactive({
		appearance: {
			dark: Dark.isActive,
		},
	});

	return {
		settings,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(storeUser, import.meta.hot));
}
