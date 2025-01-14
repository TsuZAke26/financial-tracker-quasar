<template>
	<div class="q-gutter-md">
		<q-input
			outlined
			v-model="localAccount.name"
			placeholder="Name"
			@update:model-value="$emit('account-form', localAccount)"
			:rules="[(val) => !!val || 'Enter an account name']"
		/>
		<q-select
			:disable="account?.account_type?.length > 0"
			v-model="localAccount.account_type"
			@update:model-value="$emit('account-form', localAccount)"
			label="Account Type"
			outlined
			:options="['Checking', 'Savings', 'Credit Line']"
		/>
		<q-input
			v-if="localAccount.account_type === 'Credit Line'"
			outlined
			v-model="localAccount.max_balance"
			placeholder="Credit Limit"
			type="number"
			@update:model-value="$emit('account-form', localAccount)"
			:rules="[(val) => !!val || 'Enter a credit limit']"
		/>
		<!-- <div class="row justify-end">
			<q-btn
				type="submit"
				label="Submit"
				color="secondary"
				:loading="loading"
			/>
		</div> -->
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, type PropType } from 'vue';

import type { Database } from 'src/supabase/types';

const props = defineProps({
	account: {
		type: Object as PropType<Database['public']['Tables']['accounts']['Row']>,
		default: () => {},
	},
	loading: {
		type: Boolean,
		default: false,
	},
});

defineEmits(['account-form']);

const localAccount: Database['public']['Tables']['accounts']['Update'] =
	reactive({
		name: '',
		account_type: 'Checking',
		max_balance: null,
	});

onMounted(() => {
	if (props.account) {
		localAccount.name = props.account.name;
		localAccount.account_type = props.account.account_type;
		localAccount.max_balance = props.account.max_balance;
	}
});
</script>

<style scoped></style>
