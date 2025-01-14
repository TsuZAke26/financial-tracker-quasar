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
				<AccountForm
					@account-form="updateAccountData($event)"
					:account="account"
					:loading="loading"
				/>
			</q-card-section>
			<q-card-section class="row justify-between">
				<q-btn label="Delete" color="negative" @click="handleDelete" />
				<q-btn
					label="Submit"
					color="secondary"
					@click="handleSubmit"
					:loading="loading"
				/>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
import { type PropType, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDialogPluginComponent, useQuasar } from 'quasar';

import AccountForm from './AccountForm.vue';
import { useNotify } from 'src/composables/useNotify';
import { anonClient } from 'src/supabase/anon-client';
import type { PostgrestError } from '@supabase/supabase-js';
import type { Database } from 'src/supabase/types';

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
		loading.value = true;

		const userId = (await anonClient.auth.getSession()).data.session?.user.id;
		if (!userId) {
			throw new Error('Not authenticated');
		}
		const payload: Database['public']['Tables']['accounts']['Insert'] = {
			id: accountData.id,
			user_id: userId as string,
			name: accountData.name,
			account_type: accountData.account_type,
			max_balance: accountData.max_balance,
		};
		const { error } = await anonClient
			.from('accounts')
			.update(payload)
			.eq('id', accountData.id);
		if (error) {
			throw error;
		}
		onDialogHide();

		useNotify('positive', 'Account updated successfully');
	} catch (error) {
		const supabaseError = error as PostgrestError;
		console.error(supabaseError);
		useNotify('negative', 'Error updating account', supabaseError.message);
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
				loading.value = true;

				const userId = (await anonClient.auth.getSession()).data.session?.user
					.id;
				if (!userId) {
					throw new Error('Not authenticated');
				}

				const { error } = await anonClient
					.from('accounts')
					.delete()
					.eq('id', props.account.id);
				if (error) {
					throw error;
				}

				useNotify('positive', 'Account Deleted');
				router.push({ name: 'home' });
			} catch (error) {
				const supabaseError = error as PostgrestError;
				console.error(supabaseError);
				useNotify('negative', 'Error deleting account', supabaseError.message);
			} finally {
				loading.value = false;
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
