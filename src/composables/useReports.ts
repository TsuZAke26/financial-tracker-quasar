import { readonly, ref } from 'vue';
import type { PostgrestError } from '@supabase/supabase-js';
import bigDecimal from 'js-big-decimal';

import { useNotify } from './useNotify';
import { anonClient } from 'src/supabase/anon-client';
import type { ReportCategoryData } from 'src/types/interfaces';
import type { Database } from 'src/supabase/types';

export interface ReportConfig {
	accountId: number;
	from: string;
	to: string;
}

const loading = ref(false);

function _supabaseReportQuery(
	accountType: Database['public']['Enums']['account_type'],
	config: ReportConfig
) {
	let query = anonClient
		.from('transactions')
		.select('category_main, category_misc, amount')
		.eq('account_id', config.accountId)
		.gte('date', config.from)
		.lte('date', config.to);

	if (accountType === 'Credit Line') {
		query = query.gt('amount', 0);
	} else {
		query = query.lt('amount', 0);
	}

	return query;
}

function _sumAmounts(amounts: number[]) {
	return amounts.reduce(
		(accumulator, currentAmount) =>
			accumulator.add(new bigDecimal(Math.abs(currentAmount))),
		new bigDecimal(0)
	);
}

export default () => {
	const generateReport = async (config: ReportConfig) => {
		let total = new bigDecimal(0);
		const reportCategoryData: ReportCategoryData[] = [];

		try {
			loading.value = true;

			const { data: accountData, error: accountError } = await anonClient
				.from('accounts')
				.select('account_type')
				.eq('id', config.accountId)
				.single();
			if (accountError) {
				throw accountError;
			}

			if (accountData) {
				// Fetch transactions that fit the config criteria
				const { data: transactionData, error: transactionError } =
					await _supabaseReportQuery(accountData.account_type, config);
				if (transactionError) {
					throw transactionError;
				}

				if (transactionData) {
					// Get total amount of all transactions
					total = _sumAmounts(
						transactionData.map((transaction) => transaction.amount)
					);

					// Get unique returned main categories
					const fetchedMainCategories = new Set(
						transactionData.map((transaction) => transaction.category_main)
					);
					fetchedMainCategories.forEach((category) => {
						const categoryTotal = _sumAmounts(
							transactionData
								.filter((transaction) => category === transaction.category_main)
								.map((transaction) => transaction.amount)
						);

						const reportData: ReportCategoryData = {
							category_main: category,
							category_misc: null,
							amount: categoryTotal.round(2).getPrettyValue(),
							percent: categoryTotal
								.divide(total)
								.multiply(new bigDecimal(100))
								.round(2)
								.getValue(),
						};

						reportCategoryData.push(reportData);
					});
				}
			}
		} catch (error) {
			const supabaseError = error as PostgrestError;
			console.error(error);
			useNotify('negative', 'Report Generation Failed', supabaseError.message);
		} finally {
			loading.value = false;
		}

		return reportCategoryData.sort((a, b) => {
			return bigDecimal.compareTo(b.percent, a.percent);
		});
	};

	return {
		loading: readonly(loading),
		generateReport,
	};
};
