<template>
	<q-dialog ref="dialogRef">
		<q-card flat bordered class="add-account-card">
			<q-card-section>
				<div class="row justify-between items-center">
					<div class="text-body1 text-weight-medium">Add Account</div>
					<q-btn dense size="sm" circle icon="close" @click="onDialogHide" />
				</div>
			</q-card-section>
			<q-card-section>
				<q-form ref="addAccountFormRef" @submit="handleSubmit">
					<AccountForm
						@account-form="updateAccountData($event)"
						:loading="loading"
					/>
				</q-form>
			</q-card-section>
			<q-card-section>
				<div class="row justify-end">
					<q-btn
						label="Submit"
						color="secondary"
						@click="addAccountFormRef?.submit()"
						:loading="loading"
					/>
				</div>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
import { reactive, type Ref, ref } from 'vue';
import { QForm, useDialogPluginComponent } from 'quasar';

import { storeAccounts } from 'src/stores/accounts';
import { anonClient } from 'src/supabase/anon-client';
import type { Database } from 'src/supabase/types';

import AccountForm from './AccountForm.vue';

defineEmits({
	...useDialogPluginComponent.emits,
});

const { dialogRef, onDialogHide } = useDialogPluginComponent();

const accounts = storeAccounts();
const { addAccount } = accounts;

const addAccountFormRef: Ref<QForm | null> = ref(null);
const accountData: {
	name: string;
	account_type: 'Checking' | 'Savings' | 'Credit Line';
	max_balance: number | null;
} = reactive({
	name: '',
	account_type: 'Checking',
	max_balance: null,
});

const updateAccountData = (event: {
	name: string;
	account_type: 'Checking' | 'Savings' | 'Credit Line';
	max_balance: number | null;
}) => {
	accountData.name = event.name;
	accountData.account_type = event.account_type;
	accountData.max_balance = event.max_balance;
};

const loading = ref(false);
const handleSubmit = async () => {
	try {
		const userId = (await anonClient.auth.getSession()).data.session?.user.id;
		if (!userId) {
			throw new Error('Not authenticated');
		}
		const payload: Database['public']['Tables']['accounts']['Insert'] = {
			user_id: userId as string,
			name: accountData.name,
			account_type: accountData.account_type,
			max_balance: accountData.max_balance,
		};
		await addAccount(payload);

		onDialogHide();
	} catch (error) {
		console.error(error);
	}
};
</script>

<style scoped>
.add-account-card {
	min-width: 300px;
}
</style>
