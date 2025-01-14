<template>
	<q-card flat bordered>
		<q-card-section>
			<div v-if="account" class="row justify-between items-start">
				<div>
					<div class="text-weight-bold" style="font-size: 1.2rem">
						{{ account.name }}
					</div>
					<div v-if="creditUtilization !== -1" class="text-weight-medium">
						Utilization:
						<span :style="creditUtilizationStyle(creditUtilization)">
							{{ creditUtilization.toFixed(0) }}%
						</span>
					</div>
				</div>

				<div class="text-weight-bold" style="font-size: 1.5rem">
					{{ formatAmount(settings.financial.currencySymbol, account.balance) }}
				</div>
			</div>
		</q-card-section>
		<q-card-actions align="right">
			<q-btn
				label="Edit Account"
				color="secondary"
				@click="showEditAccountDialog"
			/>
		</q-card-actions>
	</q-card>

	<!-- <q-page-sticky position="top" expand>
		<q-toolbar
			v-if="account"
			class="bg-secondary row justify-between items-start"
		>
			<div>
				<div class="text-weight-bold" style="font-size: 1.2rem">
					{{ account.name }}
				</div>
				<div v-if="creditUtilization !== -1" class="text-weight-medium">
					Utilization:
					<span :style="creditUtilizationStyle(creditUtilization)">
						{{ creditUtilization.toFixed(0) }}%
					</span>
				</div>
			</div>

			<div class="text-weight-bold" style="font-size: 1.5rem">
				{{ formatAmount(settings.financial.currencySymbol, account.balance) }}
			</div>
		</q-toolbar>
	</q-page-sticky> -->
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { Dialog } from 'quasar';

import { formatAmount } from 'src/composables/useCurrency';
import { storeUser } from 'src/stores/user';
import { storeAccounts } from 'src/stores/accounts';

import EditAccount from './EditAccount.vue';

const props = defineProps({
	accountId: {
		type: String,
		required: true,
	},
});
const accountIdAsNumber = Number.parseInt(props.accountId);

const user = storeUser();
const { settings } = user;

const accounts = storeAccounts();
const { getAccountById } = accounts;
const { accounts: accountsInStore } = storeToRefs(accounts);

const account = computed(() => {
	return accountsInStore.value.find(
		(storeAccount) => accountIdAsNumber === storeAccount.id
	);
});

const creditUtilization = computed(() => {
	let result = -1;

	if (
		account.value?.balance !== undefined &&
		account.value?.max_balance !== null
	) {
		result = (account.value?.balance / account.value?.max_balance) * 100;
	}

	return result;
});
const creditUtilizationStyle = (utilization: number) => {
	let textColor = 'font-size: 1rem; color: ';

	if (utilization <= 30) {
		textColor = textColor.concat('green');
	} else if (utilization <= 60) {
		textColor = textColor.concat('yellow');
	} else {
		textColor = textColor.concat('red');
	}

	return textColor;
};

const showEditAccountDialog = () => {
	const account = getAccountById(Number.parseInt(props.accountId));
	if (account) {
		Dialog.create({
			component: EditAccount,
			componentProps: {
				account: account,
			},
		});
	}
};
</script>

<style scoped></style>
