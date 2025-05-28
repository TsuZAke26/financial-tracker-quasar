<template>
	<q-dialog ref="dialogRef">
		<q-card flat bordered class="edit-account-card">
			<q-card-section>
				<div class="row justify-between items-center">
					<div class="text-body1 text-weight-medium">Edit Account</div>
					<q-btn dense size="sm" circle icon="close" @click="onDialogHide" />
				</div>
			</q-card-section>
			<q-card-section>
				<q-form ref="editAccountFormRef" @submit="handleSubmit">
					<AccountForm
						@account-form="updateAccountData($event)"
						:account="account"
						:loading="loading"
					/>
				</q-form>
			</q-card-section>
			<q-card-section class="row justify-between">
				<q-btn label="Delete" color="negative" @click="handleDelete" />
				<q-btn
					label="Submit"
					color="secondary"
					@click="editAccountFormRef?.submit()"
					:loading="loading"
				/>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
import { type PropType, type Ref, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { QForm, useDialogPluginComponent, useQuasar } from 'quasar';

import { storeAccounts } from 'src/stores/accounts';
import { anonClient } from 'src/supabase/anon-client';
import type { Database } from 'src/supabase/types';

import AccountForm from './AccountForm.vue';

defineEmits({
	...useDialogPluginComponent.emits,
});

const props = defineProps({
	account: {
		type: Object as PropType<Database['public']['Tables']['accounts']['Row']>,
		default: () => {},
	},
});

const { dialogRef, onDialogHide } = useDialogPluginComponent();

const accounts = storeAccounts();
const { updateAccount, deleteAccount } = accounts;

const editAccountFormRef: Ref<QForm | null> = ref(null);
const accountData: {
	id: number;
	name: string;
	account_type: 'Checking' | 'Savings' | 'Credit Line';
	max_balance: number | null;
} = reactive({
	id: props.account.id,
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
		const payload: Database['public']['Tables']['accounts']['Update'] = {
			id: accountData.id,
			user_id: userId as string,
			name: accountData.name,
			account_type: accountData.account_type,
			max_balance: accountData.max_balance,
		};
		await updateAccount(payload);

		onDialogHide();
	} catch (error) {
		console.error(error);
	} finally {
		loading.value = false;
	}
};

const router = useRouter();
const $q = useQuasar();
const handleDelete = () => {
	$q.dialog({
		title: 'Delete Account',
		message: 'Are you sure you want to delete this account?',
		cancel: true,
	})
		.onOk(async () => {
			try {
				const userId = (await anonClient.auth.getSession()).data.session?.user
					.id;
				if (!userId) {
					throw new Error('Not authenticated');
				}
				await deleteAccount(props.account.id);
				router.push({ name: 'home' });
			} catch (error) {
				console.error(error);
			}
		})
		.onCancel(() => {
			// console.log('Cancel')
		})
		.onDismiss(() => {
			// console.log('I am triggered on both OK and Cancel')
		});
};
</script>

<style scoped>
.edit-account-card {
	min-width: 300px;
}
</style>
