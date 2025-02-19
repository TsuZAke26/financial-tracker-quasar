<template>
	<q-card class="accounts-list-card">
		<q-card-section>
			<div class="text-h6 text-weight-bold">{{ title }}</div>
		</q-card-section>

		<q-card-section class="q-gutter-md">
			<div
				v-for="account in accounts"
				:key="account.id"
				clickable
				@click="handleAccountClick(account.id)"
				class="row justify-between items-center cursor-pointer rounded-borders q-pa-sm"
				style="border: 1px solid grey"
			>
				<div class="ellipsis">{{ account.name }}</div>
				<div>
					{{ formatAmount(settings.financial.currencySymbol, account.balance) }}
				</div>
			</div>
		</q-card-section>
	</q-card>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { formatAmount } from 'src/composables/useCurrency';
import { storeUser } from 'src/stores/user';
import type { Database } from 'src/supabase/types';

defineProps({
	title: {
		type: String,
		required: true,
	},
	accounts: {
		type: Array as PropType<
			Array<Database['public']['Tables']['accounts']['Row']>
		>,
		required: true,
	},
});

const user = storeUser();
const { settings } = storeToRefs(user);

const router = useRouter();
const handleAccountClick = (id: number) => {
	router.push({
		name: 'account',
		params: {
			id,
		},
	});
};
</script>

<style scoped>
.accounts-list-card {
	width: 100%;
	min-width: 360px;
}
</style>
