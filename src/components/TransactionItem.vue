<template>
	<div
		class="rounded-borders col items-center q-pa-sm cursor-pointer"
		style="border: 1px solid gray"
		@click="handleClick"
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
				{{ formatAmount(transaction.amount) }}
			</div>
		</div>

		<!-- Bottom Row (category & date) -->
		<div class="row justify-between items-start">
			<!-- Category -->
			<div class="row">
				<q-chip color="primary" size="sm">
					{{ transaction.category_main }}
				</q-chip>
				<q-chip v-if="transaction.category_misc" color="secondary" size="sm">
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
import { Dialog } from 'quasar';

import { formatAmount, styleAmount } from 'src/composables/useCurrency';
import type { Database } from 'src/supabase/types';

import EditTransaction from 'src/components/EditTransaction.vue';

const props = defineProps({
	transaction: {
		type: Object as PropType<
			Database['public']['Tables']['transactions']['Row']
		>,
		required: true,
	},
});

const handleClick = () => {
	Dialog.create({
		component: EditTransaction,
		componentProps: {
			transaction: props.transaction,
		},
	});
};
</script>

<style scoped></style>
