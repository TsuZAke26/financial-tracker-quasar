<template>
	<!-- List Existing Budgets -->
	<div v-if="budgets.length > 0">
		<q-list bordered separator>
			<q-item
				v-for="budget in budgets"
				:key="budget.id"
				@click="handleEditBudget(budget)"
				clickable
			>
				<q-item-section class="text-subtitle1 text-weight-medium">
					{{ budget.name }}
				</q-item-section>
			</q-item>
		</q-list>
	</div>

	<div class="q-my-md" />

	<!-- Add new budget controls -->
	<div>
		<q-btn
			:disabled="showNewBudget"
			class="fit"
			@click="showNewBudget = true"
			color="primary"
			label="Add New Budget"
			unelevated
		/>
		<q-slide-transition>
			<div v-if="showNewBudget" class="q-mt-md">
				<AddBudgetWithExpenses
					:account-id="accountId"
					:load-budgets="loadBudgets"
					@close-new-budget="showNewBudget = false"
				/>
			</div>
		</q-slide-transition>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Dialog } from 'quasar';

import useBudgets from 'src/composables/useBudgets';
import type { Database } from 'src/supabase/types';

import AddBudgetWithExpenses from './AddBudgetWithExpenses.vue';
import EditBudget from './EditBudget.vue';

const props = defineProps({
	accountId: {
		type: Number,
		required: true,
	},
});

const showNewBudget = ref(false);
const accountBudgets = useBudgets();
const { budgets, loadBudgets } = accountBudgets;

await loadBudgets(props.accountId);

const handleEditBudget = (
	budget: Database['public']['Tables']['budgets']['Row']
) => {
	Dialog.create({
		component: EditBudget,
		componentProps: {
			accountId: props.accountId,
			budget: budget,
		},
	});
};
</script>

<style scoped></style>
