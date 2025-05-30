<template>
	<!-- <div>Budgets</div> -->
	<!-- <q-separator spaced="1rem" /> -->
	<div v-if="budgets.length > 0">
		<q-list separator bordered>
			<q-item
				clickable
				v-for="budget in budgets"
				:key="budget.id"
				@click="handleEditBudget(budget)"
			>
				<q-item-section class="text-subtitle1 text-weight-medium">
					{{ budget.name }}
				</q-item-section>
			</q-item>
		</q-list>
	</div>

	<div class="q-my-md" />

	<div>
		<q-btn
			class="fit"
			label="Add New Budget"
			unelevated
			color="primary"
			@click="showNewBudget = true"
			:disabled="showNewBudget"
		/>
		<q-slide-transition>
			<div class="q-mt-md" v-if="showNewBudget">
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

await loadBudgets();

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
