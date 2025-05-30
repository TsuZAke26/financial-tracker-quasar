<template>
	<div class="row no-wrap q-gutter-sm">
		<q-input
			v-model="name"
			class="fit"
			placeholder="Expense Name"
			dense
			outlined
		/>
		<q-input
			v-model.number="amount"
			class="col-4"
			type="number"
			dense
			outlined
		/>
		<q-btn
			:disabled="!allowAdd"
			class="col-1"
			@click="handleAdd"
			color="positive"
			icon="add"
			placeholder="Amount"
			dense
		/>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const emit = defineEmits<{
	(e: 'new-budget-item', data: { name: string; amount: number }): void;
}>();

const name = ref('');
const amount = ref(0);
const allowAdd = computed(() => {
	return name.value.length > 0 && amount.value !== 0;
});

const handleAdd = () => {
	emit('new-budget-item', { name: name.value, amount: amount.value });
	name.value = '';
	amount.value = 0;
};
</script>

<style scoped></style>
