<template>
	<div class="q-gutter-md">
		<q-input
			outlined
			v-model="localTransaction.name"
			placeholder="Name"
			@update:model-value="$emit('transaction-form', localTransaction)"
			:rules="[(val) => !!val || 'Enter a transaction name']"
		/>
		<q-select
			v-model="localTransaction.category_main"
			@update:model-value="$emit('transaction-form', localTransaction)"
			label="Category"
			outlined
			:options="TRANSACTION_CATEGORIES_MAIN"
			:rules="[(val) => !!val || 'Enter a transaction category']"
		/>
		<q-input
			v-if="localTransaction.category_main === 'Miscellaneous'"
			outlined
			v-model="localTransaction.category_misc"
			placeholder="Miscellaneous Category"
			@update:model-value="$emit('transaction-form', localTransaction)"
			style="margin-bottom: 40px"
		/>
		<q-input
			outlined
			v-model="localTransaction.date"
			mask="####-##-##"
			:rules="[
				(val) =>
					/^-?[\d]+\-[0-1]\d\-[0-3]\d$/.test(val) ||
					'Enter a valud date (YYYY-MM-DD)',
			]"
		>
			<template v-slot:append>
				<q-icon name="event" class="cursor-pointer">
					<q-popup-proxy cover transition-show="scale" transition-hide="scale">
						<q-date v-model="localTransaction.date" minimal mask="YYYY-MM-DD">
							<div class="row items-center justify-end">
								<q-btn v-close-popup label="Close" color="primary" flat />
							</div>
						</q-date>
					</q-popup-proxy>
				</q-icon>
			</template>
		</q-input>
		<!-- <QCurrencyInput
			v-model="localTransaction.amount"
			:currency="settings.financial.currencySymbol"
		/> -->
		<q-input
			outlined
			v-model="localTransaction.amount"
			placeholder="Amount"
			@update:model-value="$emit('transaction-form', localTransaction)"
			:rules="[
				(val) =>
					/^-?\d{1,}(\.\d{1,2})?$/.test(val) ||
					'Enter a valid transaction amount',
			]"
		>
			<template #prepend>
				<span>{{ settings.financial.currencySymbol }}</span>
			</template>
		</q-input>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, type PropType } from 'vue';

import { storeUser } from 'src/stores/user';

import type { Database } from 'src/supabase/types';
import { TRANSACTION_CATEGORIES_MAIN } from 'src/types/constants';

// import QCurrencyInput from './QCurrencyInput.vue';

const props = defineProps({
	transaction: {
		type: Object as PropType<
			Database['public']['Tables']['transactions']['Row']
		>,
		default: () => {},
	},
	loading: {
		type: Boolean,
		default: false,
	},
});

defineEmits(['transaction-form']);

const user = storeUser();
const { settings } = user;

const localTransaction: {
	account_id: number;
	category_main: string;
	category_misc: string | null;
	date: string;
	name: string;
	amount: number;
} = reactive({
	account_id: -1,
	category_main: '',
	category_misc: null,
	date: new Date().toISOString().split('T')[0] as string,
	name: '',
	amount: 0,
});

onMounted(() => {
	if (props.transaction) {
		Object.assign(localTransaction, props.transaction);
	}
});
</script>

<style scoped></style>
