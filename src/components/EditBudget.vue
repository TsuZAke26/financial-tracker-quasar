<template>
	<q-dialog ref="dialogRef">
		<q-card class="edit-budget-card" bordered flat>
			<q-card-section class="text-h6">
				Edit Budget: {{ budget.name }}
			</q-card-section>

			<!-- Add new expense -->
			<q-card-section>
				<AddExpenseItem @new-budget-item="addExpense" />
			</q-card-section>

			<!-- List Expenses -->
			<q-card-section>
				<div v-if="localExpenses.length > 0">
					<q-list bordered separator>
						<q-slide-item
							v-for="expense in localExpenses"
							:key="expense.id"
							@right="deleteExpense(expense.id)"
							right-color="red"
						>
							<template v-slot:right>
								<q-icon name="delete" />
							</template>

							<!-- Edit Expense line item -->
							<q-item v-if="expense.edit">
								<div class="row no-wrap q-gutter-sm">
									<q-input v-model="expense.name" class="fit" dense outlined />
									<q-input
										v-model.number="expense.amount"
										class="col-4"
										type="number"
										dense
										outlined
									/>
									<q-btn
										class="col-1"
										@click="updateExpense(expense)"
										color="positive"
										icon="check"
									/>
								</div>
							</q-item>

							<!-- Regular Expense line item -->
							<q-item v-else @click="expense.edit = true" clickable>
								<q-item-section>
									{{ expense.name }}
								</q-item-section>
								<q-item-section
									:class="styleAmount(expense.amount)"
									class="text-weight-bold"
									avatar
								>
									{{ formatAmount(expense.amount) }}
								</q-item-section>
							</q-item>
						</q-slide-item>
					</q-list>
					<!-- Budget Totals -->
					<q-item class="row justify-between">
						<span class="text-subtitle1 text-weight-medium">Remaining:</span>
						<span
							:class="`text-subtitle1 text-weight-bold text-${Number.parseFloat(total) < 0 ? 'red' : 'green'}`"
						>
							{{ formatAmountString(total) }}
						</span>
					</q-item>
				</div>
				<div v-else>No expenses created yet</div>
			</q-card-section>
			<q-card-actions align="right">
				<q-btn @click="onDialogHide" label="Close" />
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
import {
	ref,
	type PropType,
	onMounted,
	reactive,
	type Ref,
	computed,
} from 'vue';
import { useDialogPluginComponent } from 'quasar';

import {
	formatAmount,
	formatAmountString,
	styleAmount,
} from 'src/composables/useCurrency';
import { anonClient } from 'src/supabase/anon-client';
import type { Database } from 'src/supabase/types';
import type { LocalExpenseDB } from 'src/types/interfaces';
import { sortDeductions } from 'src/util/expense-utils';
import { addNumbers } from 'src/util/number-utils';

import AddExpenseItem from './AddExpenseItem.vue';

const props = defineProps({
	budget: {
		type: Object as PropType<Database['public']['Tables']['budgets']['Row']>,
		required: true,
	},
});

defineEmits({
	...useDialogPluginComponent.emits,
});

const { dialogRef, onDialogHide } = useDialogPluginComponent();

const localBudget: { id: number; name: string } = reactive({
	id: -1,
	name: '',
});

const localExpenses: Ref<LocalExpenseDB[]> = ref([]);
const total = computed(() => {
	const amounts = localExpenses.value.map(
		(localExpense) => localExpense.amount
	);
	return addNumbers(amounts);
});
function sortLocalExpenses() {
	const positiveExpenses = localExpenses.value.filter(
		(expense) => expense.amount > 0
	);
	const negativeExpenses = localExpenses.value
		.filter((expense) => expense.amount < 0)
		.sort(sortDeductions);

	localExpenses.value = positiveExpenses.concat(negativeExpenses);
}
const fetchExpensesForBudget = async () => {
	try {
		const budgetId = props.budget.id;

		const { data, error } = await anonClient
			.from('budgets_expenses')
			.select()
			.eq('budget_id', budgetId);
		if (error) {
			throw error;
		}
		if (data) {
			const convertedData = data.map((expense) => {
				return {
					id: expense.id,
					name: expense.name,
					amount: expense.amount,
					budget_id: expense.budget_id,
					edit: false,
				};
			});
			localExpenses.value = convertedData;
			sortLocalExpenses();
		}
	} catch (error) {
		console.error(error);
	}
};
const addExpense = async (event: { name: string; amount: number }) => {
	try {
		const payload = {
			name: event.name,
			amount: event.amount,
			budget_id: props.budget.id,
		};
		const { data, error } = await anonClient
			.from('budgets_expenses')
			.insert(payload)
			.select()
			.single();
		if (error) {
			throw error;
		}
		if (data) {
			const newLocalExpense: LocalExpenseDB = {
				id: data.id,
				name: data.name,
				amount: data.amount,
				budget_id: data.budget_id,
				edit: false,
			};
			localExpenses.value.push(newLocalExpense);
			sortLocalExpenses();
		}
	} catch (error) {
		console.error(error);
	}
};
const updateExpense = async (expense: {
	id: number;
	budget_id: number;
	name: string;
	amount: number;
	edit: boolean;
}) => {
	try {
		const payload = {
			id: expense.id,
			name: expense.name,
			amount: expense.amount,
			budget_id: expense.budget_id,
		};
		const { error } = await anonClient
			.from('budgets_expenses')
			.update(payload)
			.eq('id', payload.id);
		if (error) {
			throw error;
		}

		const index = localExpenses.value.findIndex(
			(localExpense) => localExpense.id === expense.id
		);
		if (index !== -1) {
			const newLocalExpense: LocalExpenseDB = { ...expense, edit: false };
			localExpenses.value.splice(index, 1, newLocalExpense);
			sortLocalExpenses();
		}
	} catch (error) {
		console.error(error);
		const { data: oldExpenseData, error: oldExpenseError } = await anonClient
			.from('budgets_expenses')
			.select()
			.eq('id', expense.id)
			.single();
		if (oldExpenseError) {
			throw oldExpenseError;
		}
		if (oldExpenseData) {
			const index = localExpenses.value.findIndex(
				(localExpense) => localExpense.id === oldExpenseData.id
			);
			if (index !== -1) {
				const convertedOldExpense = {
					id: oldExpenseData.id,
					name: oldExpenseData.name,
					amount: oldExpenseData.amount,
					budget_id: oldExpenseData.budget_id,
					edit: false,
				};
				localExpenses.value.splice(index, 1, convertedOldExpense);
				sortLocalExpenses();
			}
		}
	}
};
const deleteExpense = async (id: number) => {
	try {
		const { error } = await anonClient
			.from('budgets_expenses')
			.delete()
			.eq('id', id);
		if (error) {
			throw error;
		} else {
			const localExpenseIndex = localExpenses.value.findIndex(
				(localExpense) => localExpense.id === id
			);
			if (localExpenseIndex !== -1) {
				localExpenses.value.splice(localExpenseIndex, 1);
			}
		}
	} catch (error) {
		console.error(error);
	}
};

onMounted(async () => {
	if (props.budget) {
		Object.assign(localBudget, props.budget);
	}

	await fetchExpensesForBudget();
});
</script>

<style scoped>
.edit-budget-card {
	max-width: 500px;
	width: 75vh;
}
</style>
