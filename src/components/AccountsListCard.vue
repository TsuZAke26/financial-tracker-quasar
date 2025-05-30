<template>
	<q-card class="accounts-list-card" flat bordered>
		<q-card-section>
			<div class="text-h6 text-weight-bold">{{ title }}</div>
		</q-card-section>

		<q-card-section>
			<div v-if="accounts.length > 0" class="q-gutter-md">
				<div
					v-for="account in accounts"
					:key="account.id"
					class="row justify-between items-center cursor-pointer rounded-borders q-pa-sm"
					style="border: 1px solid grey"
					@click="handleAccountClick(account.id)"
					clickable
				>
					<div class="ellipsis">{{ account.name }}</div>
					<div>
						{{ formatAmount(account.balance) }}
					</div>
				</div>
			</div>

			<div v-else class="text-center">No accounts created yet</div>
		</q-card-section>
	</q-card>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { useRouter } from 'vue-router';

import { formatAmount } from 'src/composables/useCurrency';
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
