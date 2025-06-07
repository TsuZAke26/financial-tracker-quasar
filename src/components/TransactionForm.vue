<template>
	<div class="q-gutter-md">
		<q-input
			v-model="localTransaction.name"
			:rules="[(val) => !!val || 'Enter a transaction name']"
			@update:model-value="$emit('transaction-form', localTransaction)"
			placeholder="Name"
			outlined
		/>
		<q-select
			v-model="localTransaction.category_main"
			:options="TRANSACTION_CATEGORIES_MAIN"
			:rules="[(val) => !!val || 'Enter a transaction category']"
			@update:model-value="$emit('transaction-form', localTransaction)"
			label="Category"
			outlined
		/>
		<q-input
			v-if="localTransaction.category_main === 'Miscellaneous'"
			v-model="localTransaction.category_misc"
			style="margin-bottom: 40px"
			@update:model-value="$emit('transaction-form', localTransaction)"
			placeholder="Miscellaneous Category"
			outlined
		/>
		<q-input
			v-model="localTransaction.date"
			:rules="[
				(val) =>
					/^-?[\d]+\-[0-1]\d\-[0-3]\d$/.test(val) ||
					'Enter a valid date (YYYY-MM-DD)',
			]"
			mask="####-##-##"
			outlined
		>
			<template v-slot:append>
				<q-icon class="cursor-pointer" name="event">
					<q-popup-proxy transition-hide="scale" transition-show="scale" cover>
						<q-date
							v-model="localTransaction.date"
							@update:model-value="$emit('transaction-form', localTransaction)"
							mask="YYYY-MM-DD"
							minimal
						>
							<div class="row items-center justify-end">
								<q-btn color="primary" label="Close" flat v-close-popup />
							</div>
						</q-date>
					</q-popup-proxy>
				</q-icon>
			</template>
		</q-input>

		<q-input
			v-model="localTransaction.amount"
			:rules="[
				(val) =>
					/^-?\d{1,}(\.\d{1,2})?$/.test(val) ||
					'Enter a valid transaction amount',
			]"
			@update:model-value="$emit('transaction-form', localTransaction)"
			placeholder="Amount"
			outlined
		>
			<template #prepend>
				<span>{{ currencySymbol }}</span>
			</template>
		</q-input>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, type PropType } from 'vue';

import { storeUser } from 'src/stores/user';
import type { Database } from 'src/supabase/types';
import { TRANSACTION_CATEGORIES_MAIN } from 'src/types/constants';

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

defineEmits<{
	(
		e: 'transaction-form',
		data: {
			account_id: number;
			category_main: string;
			category_misc: string | null;
			date: string;
			name: string;
			amount: number;
		}
	): void;
}>();

const user = storeUser();
const { currencySymbol } = user;

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
