<template>
	<q-card bordered flat>
		<!-- Quick Report Buttons -->
		<q-card-section>
			<div class="row items-center q-gutter-md">
				<div class="text-h6 text-weight-medium">Quick Reports:</div>
				<q-btn @click="loadYTDReport" color="info" label="YTD" unelevated />
			</div>
		</q-card-section>

		<q-separator spaced />

		<!-- Manual Report Generation -->
		<q-card-section>
			<div class="row q-gutter-sm">
				<!-- From date-->
				<q-input
					v-model="fromDate"
					:rules="[
						(val) =>
							/^-?[\d]+\-[0-1]\d\-[0-3]\d$/.test(val) ||
							'Enter a valid date (YYYY-MM-DD)',
						(val) => val < toDate || 'from date must be after to date',
					]"
					class="col"
					mask="####-##-##"
					outlined
				>
					<template v-slot:append>
						<q-icon class="cursor-pointer" name="event">
							<q-popup-proxy
								transition-hide="scale"
								transition-show="scale"
								cover
							>
								<q-date v-model="fromDate" mask="YYYY-MM-DD" minimal>
									<div class="row items-center justify-end">
										<q-btn color="primary" label="Close" flat v-close-popup />
									</div>
								</q-date>
							</q-popup-proxy>
						</q-icon>
					</template>
				</q-input>

				<!-- To date -->
				<q-input
					v-model="toDate"
					:rules="[
						(val) =>
							/^-?[\d]+\-[0-1]\d\-[0-3]\d$/.test(val) ||
							'Enter a valid date (YYYY-MM-DD)',
						(val) => val > fromDate || 'To date must be after from date',
					]"
					class="col"
					mask="####-##-##"
					outlined
				>
					<template v-slot:append>
						<q-icon class="cursor-pointer" name="event">
							<q-popup-proxy
								transition-hide="scale"
								transition-show="scale"
								cover
							>
								<q-date v-model="toDate" mask="YYYY-MM-DD" minimal>
									<div class="row items-center justify-end">
										<q-btn color="primary" label="Close" flat v-close-popup />
									</div>
								</q-date>
							</q-popup-proxy>
						</q-icon>
					</template>
				</q-input>

				<!-- Generate Report button -->
				<q-btn
					@click="loadDateRangeReport"
					color="primary"
					label="Generate"
					unelevated
					:disable="loading"
					class="fit"
				/>
			</div>
		</q-card-section>
	</q-card>

	<div class="q-my-md" />

	<q-table
		:columns="[
			{
				name: 'category',
				label: 'Category',
				field: 'category_first',
				align: 'left',
			},
			{
				name: 'amount',
				label: 'Amount',
				field: 'amount',
			},
			{
				name: 'percent',
				label: '% Spend',
				field: 'percent',
			},
		]"
		:loading
		:rows-per-page-options="[0]"
		:rows="reportData"
		bordered
		flat
	/>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';

import useReports, { type ReportConfig } from 'src/composables/useReports';
import type { ReportCategoryData } from 'src/types/interfaces';
import { toISODate } from 'src/util/date-utils';

const props = defineProps({
	accountId: {
		type: Number,
		required: true,
	},
});

const reports = useReports();
const { loading, generateReport } = reports;

const fromDate = ref(toISODate(new Date()));
const toDate = ref(toISODate(new Date()));
const reportData: Ref<ReportCategoryData[]> = ref([]);

const loadYTDReport = async () => {
	const currentYear = new Date().getFullYear();

	const config: ReportConfig = {
		accountId: props.accountId,
		from: currentYear.toString().concat('-01-01'),
		to: toISODate(new Date()),
	};
	reportData.value = await generateReport(config);
};

const loadDateRangeReport = async () => {
	const config: ReportConfig = {
		accountId: props.accountId,
		from: fromDate.value,
		to: toDate.value,
	};
	reportData.value = await generateReport(config);
};
</script>

<style scoped></style>
