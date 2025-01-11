<template>
	<div
		class="rounded-borders col items-center q-pa-sm"
		style="border: 1px solid gray"
	>
		<!-- Top Row (name & amount) -->
		<div class="row justify-between items-start">
			<!-- Name -->
			<div class="ellipsis col">{{ transaction.name }}</div>

			<!-- Amount -->
			<div
				:style="styleAmount(transaction.amount)"
				class="text-weight-medium col-auto"
			>
				{{
					formatAmount(settings.financial.currencySymbol, transaction.amount)
				}}
			</div>
		</div>

		<!-- Bottom Row (category & date) -->
		<div class="row justify-between items-start">
			<!-- Category -->
			<div class="row">
				<q-chip size="sm" color="primary">
					{{ transaction.category_main }}
				</q-chip>
				<q-chip v-if="transaction.category_misc" size="sm" color="secondary">
					{{ transaction.category_misc }}
				</q-chip>
			</div>
			<!-- Date -->
			<div>{{ transaction.date }}</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

import { storeUser } from 'src/stores/user';

import type { Database } from 'src/supabase/types';

import { formatAmount, styleAmount } from 'src/composables/useCurrency';

defineProps({
	transaction: {
		type: Object as PropType<
			Database['public']['Tables']['transactions']['Row']
		>,
		required: true,
	},
});

const user = storeUser();
const { settings } = user;
</script>

<style scoped></style>
