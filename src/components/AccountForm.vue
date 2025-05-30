<template>
	<div class="q-gutter-md">
		<q-input
			v-model="localAccount.name"
			:rules="[(val) => !!val || 'Enter an account name']"
			@update:model-value="$emit('account-form', localAccount)"
			placeholder="Name"
			outlined
		/>
		<q-select
			v-model="localAccount.account_type"
			:disable="account?.account_type?.length > 0"
			:options="['Checking', 'Savings', 'Credit Line']"
			@update:model-value="$emit('account-form', localAccount)"
			label="Account Type"
			outlined
		/>
		<q-input
			v-if="localAccount.account_type === 'Credit Line'"
			v-model="localAccount.max_balance"
			:rules="[(val) => !!val || 'Enter a credit limit']"
			@update:model-value="$emit('account-form', localAccount)"
			placeholder="Credit Limit"
			type="number"
			outlined
		/>
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
		Object.assign(localAccount, props.account);
	}
});
</script>

<style scoped></style>
