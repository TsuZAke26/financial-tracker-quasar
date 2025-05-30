<template>
	<q-card bordered flat>
		<q-card-section class="text-h6"> Create New Budget </q-card-section>

		<q-card-section>
			<q-input v-model="budgetName" placeholder="Budget Name" outlined dense />
		</q-card-section>

		<!-- Add new expense -->
		<q-card-section>
			<AddExpenseItem @new-budget-item="handleNewBudgetItem" />
		</q-card-section>

		<!-- List expenses -->
		<q-card-section v-if="localExpenses.length > 0">
			<q-list separator bordered>
				<q-slide-item
					v-for="expense in localExpenses"
					:key="expense.id"
					right-color="red"
					@right="removeLocalExpense(expense)"
				>
					<template v-slot:right>
						<q-icon name="delete" />
					</template>

					<!-- Edit Expense line item -->
					<q-item v-if="expense.edit">
						<div class="row no-wrap q-gutter-sm">
							<q-input v-model="expense.name" dense outlined class="fit" />
							<q-input
								v-model.number="expense.amount"
								dense
								outlined
								type="number"
								class="col-4"
							/>
							<q-btn
								icon="check"
								color="primary"
								class="col-1"
								@click="expense.edit = false"
							/>
						</div>
					</q-item>

					<!-- Regular Expense line item -->
					<q-item v-else clickable @click="expense.edit = true">
						<q-item-section>
							{{ expense.name }}
						</q-item-section>
						<q-item-section
							avatar
							:class="`text-weight-bold text-${expense.amount < 0 ? 'red' : 'green'}`"
						>
							{{ expense.amount.toFixed(2) }}
						</q-item-section>
					</q-item>
				</q-slide-item>
			</q-list>

			<!-- Budget Totals -->
			<q-item class="row justify-between">
				<span class="text-subtitle1">Total</span>
				<span
					:class="`text-subtitle1 text-weight-bold text-${Number.parseFloat(total) < 0 ? 'red' : 'green'}`"
				>
					{{ total }}
				</span>
			</q-item>
		</q-card-section>

		<!-- Save/Clear buttons -->
		<q-card-actions align="right" class="q-ma-sm">
			<q-btn
				label="Cancel"
				color="negative"
				unelevated
				@click="$emit('close-new-budget')"
			/>
			<q-space />
			<q-btn label="Clear" @click="handleClearBudgets" outline />
			<q-btn
				label="Save"
				color="primary"
				@click="handleSaveBudget"
				:disable="preventSave"
				unelevated
			/>
		</q-card-actions>
	</q-card>
</template>

<script setup lang="ts">
import { computed, type Ref, ref } from 'vue';

import { anonClient } from 'src/supabase/anon-client';

import AddExpenseItem from './AddExpenseItem.vue';
import { addNumbers } from 'src/util/number-utils';

const props = defineProps({
	accountId: {
		type: Number,
		required: true,
	},
	loadBudgets: {
		type: Function,
		required: true,
	},
});

const emit = defineEmits(['close-new-budget']);

interface LocalExpense {
	id: number;
	name: string;
	amount: number;
	edit: boolean;
}

const budgetName = ref('');
let idCounter = 1;
const localExpenses: Ref<LocalExpense[]> = ref([]);
const total = computed(() => {
	const amounts = localExpenses.value.map(
		(localExpense) => localExpense.amount
	);
	return addNumbers(amounts);
});
const handleNewBudgetItem = (event: { name: string; amount: number }) => {
	const newExpense: LocalExpense = {
		id: idCounter++,
		name: event.name,
		amount: event.amount,
		edit: false,
	};
	localExpenses.value.push(newExpense);
};
const removeLocalExpense = (expense: LocalExpense) => {
	const index = localExpenses.value.findIndex(
		(localExpense) => expense.id === localExpense.id
	);
	if (index !== -1) {
		localExpenses.value.splice(index, 1);
	}
};
const handleClearBudgets = () => {
	localExpenses.value = [];
};

const preventSave = computed(() => {
	return budgetName.value.length === 0 || localExpenses.value.length === 0;
});
const handleSaveBudget = async () => {
	try {
		const budgetPayload = {
			name: budgetName.value,
			account_id: props.accountId,
		};
		const { data: budgetData, error: budgetError } = await anonClient
			.from('budgets')
			.insert(budgetPayload)
			.select()
			.single();
		if (budgetError) {
			throw budgetError;
		}

		if (budgetData) {
			const expensesPayload = localExpenses.value.map((localExpense) => {
				return {
					name: localExpense.name,
					amount: localExpense.amount,
					budget_id: budgetData.id,
				};
			});
			const { error: expensesError } = await anonClient
				.from('budgets_expenses')
				.insert(expensesPayload);
			if (expensesError) {
				throw expensesError;
			}
			await props.loadBudgets();
			emit('close-new-budget');
		}
	} catch (error) {
		console.error(error);
	}
};
</script>

<style scoped></style>
