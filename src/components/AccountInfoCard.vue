<template>
	<q-card bordered flat>
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

				<div
					:class="styleAmount(account.balance)"
					class="text-weight-bold"
					style="font-size: 1.5rem"
				>
					{{ formatAmount(account.balance) }}
				</div>
			</div>
		</q-card-section>
		<q-card-actions align="right">
			<q-btn
				@click="showEditAccountDialog"
				color="secondary"
				label="Edit Account"
			/>
		</q-card-actions>
	</q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { Dialog } from 'quasar';

import { formatAmount, styleAmount } from 'src/composables/useCurrency';
import { storeAccounts } from 'src/stores/accounts';

import EditAccount from './EditAccount.vue';

const props = defineProps({
	accountId: {
		type: String,
		required: true,
	},
});
const accountIdAsNumber = Number.parseInt(props.accountId);

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
		textColor = textColor.concat('amber');
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
