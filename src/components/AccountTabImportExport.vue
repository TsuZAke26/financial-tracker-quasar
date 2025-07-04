<template>
	<!-- Import Transaction controls -->
	<div class="q-col-gutter-sm">
		<div class="text-h5 text-weight-bold">Import</div>
		<div class="row justify-between items-center q-gutter-md">
			<q-file
				v-model="importFile"
				class="col"
				accept=".csv, text/csv"
				label="CSV File to Import"
				dense
				outlined
			/>
			<q-btn
				:loading="loading"
				class="col-auto"
				@click="importTransactions"
				color="primary"
				label="Import"
			/>
			<q-btn
				class="col-auto"
				@click="generateImportTemplate"
				color="secondary"
				label="Template"
			/>
		</div>
	</div>

	<div class="q-my-lg" />

	<!-- Export Transactions controls -->
	<div class="q-col-gutter-sm">
		<div class="text-h5 text-weight-bold">Export</div>
		<div class="row justify-start items-start q-gutter-md">
			<q-input
				v-model="exportYear"
				:rules="[
					(val: number) =>
						/^\d{4}$/.test(val.toString()) || 'Enter a valid year',
				]"
				class="col-3"
				label="Year"
				type="number"
				dense
				lazy-rules
				outlined
			/>
			<q-input
				v-model="exportMonth"
				:rules="[
					(val: number) => (val > 0 && val < 13) || 'Enter a valid month',
				]"
				class="col-3"
				label="Month"
				maxlength="2"
				type="number"
				dense
				lazy-rules
				outlined
			/>
			<q-btn
				class="col-auto"
				@click="handleExport"
				color="primary"
				label="Export"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { type Ref, ref } from 'vue';
import { type PostgrestError } from '@supabase/supabase-js';

import { updateAccountBalances } from 'src/composables/useAccounts';
import { useNotify } from 'src/composables/useNotify';
import {
	generateImportTemplate,
	convertCSVRowsToJSON,
	createTransactionRows,
	createTransactionExport,
} from 'src/composables/useImportExport';
import { storeTransactions } from 'src/stores/transactions';
import { anonClient } from 'src/supabase/anon-client';

const props = defineProps({
	accountId: {
		type: Number,
		required: true,
	},
});

const transactions = storeTransactions();
const { addTransactionToStore } = transactions;

const loading = ref(false);
const importFile: Ref<File | null> = ref(null);
const importTransactions = async () => {
	if (!importFile.value) {
		return;
	}

	try {
		loading.value = true;

		if (!importFile.value) {
			throw new Error('No file selected');
		}
		if (importFile.value?.type !== 'text/csv') {
			throw new Error('Not a CSV file');
		}

		const csvRowsAsJson = (await convertCSVRowsToJSON(importFile.value)).data;
		const transactionsToInsert = createTransactionRows(
			props.accountId,
			csvRowsAsJson
		);

		const { data, error } = await anonClient
			.from('transactions')
			.insert(transactionsToInsert)
			.select();
		if (error) {
			throw error;
		}
		if (data) {
			data.forEach((transaction) => addTransactionToStore(transaction));
			useNotify('positive', 'Transactions imported successfully');
			await updateAccountBalances();
			importFile.value = null;
		}
	} catch (error) {
		console.error(error);
		useNotify('negative', 'Error importing transactions');
	} finally {
		loading.value = false;
	}
};

const exportYear = ref(new Date().getFullYear());
const exportMonth = ref(new Date().getMonth() + 1);
const handleExport = async () => {
	try {
		const exportMonthForStr = exportMonth.value.toString().padStart(2, '0');

		const dateStart = exportYear.value
			.toString()
			.concat('-')
			.concat(exportMonthForStr)
			.concat('-')
			.concat('01');

		let monthEndDay = '';
		if (exportMonthForStr === '02') {
			monthEndDay = '28';
			if (exportYear.value % 4 === 0) {
				monthEndDay = '29';
			}
		} else if (['04', '06', '09', '11'].includes(exportMonthForStr)) {
			monthEndDay = '30';
		} else {
			monthEndDay = '31';
		}
		const dateEnd = exportYear.value
			.toString()
			.concat('-')
			.concat(exportMonthForStr)
			.concat('-')
			.concat(monthEndDay);

		const { data, error } = await anonClient
			.from('transactions')
			.select('category_first, category_second, name, date, amount')
			.eq('account_id', props.accountId)
			.gte('date', dateStart)
			.lte('date', dateEnd);
		if (error) {
			throw error;
		}
		if (data && data.length > 0) {
			createTransactionExport(data);
		} else {
			useNotify(
				'info',
				`No transactions were found for ${exportYear.value}-${exportMonthForStr}`
			);
		}
	} catch (error) {
		const supabaseError = error as PostgrestError;
		useNotify(
			'negative',
			'Error exporting transactions',
			supabaseError.message
		);
	}
};
</script>

<style scoped></style>
