<template>
  <q-table virtual-scroll ref="table" style="flex-shrink: 1; flex-grow: 1; height: 50vh; margin: auto;" flat :rows="rows"
    :rows-per-page-options="[0]" :columns="[
    { name: 'index', label: 'Index', align: 'left', field: '_' },
    ...fieldColumns,
  ]">

    <template v-slot:top>
      <div class="inline-block q-px-md text-body2">
        Index of target: <strong class="text-primary">{{ targetIndex }}</strong>
      </div>
      <q-btn color="primary" :disable="targetIndex === -1" label="Scroll to target" @click="scrollToTarget()" />
    </template>

    <template v-slot:body-cell-index="props">
      <q-td :props="props" :class="{ 'bg-purple-7 text-white': getShouldHighlight(props.row) }">
        {{ props.rowIndex }}
      </q-td>
    </template>

    <template v-slot:body-cell="props">
      <q-td :props="props" :class="{ 'bg-purple-7 text-white': getShouldHighlight(props.row) }">
        {{ props.value }}
      </q-td>
    </template>

  </q-table>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { QTable } from 'quasar';

const props = defineProps({
  fields: {
    type: Array,
    required: true,
  },
  rows: {
    type: Array,
    required: true,
  },
  getShouldHighlight: {
    type: Function,
    default: function (data: any) {
      return false;
    },
  },
});

const table = ref<QTable | null>(null);

const fieldColumns = computed(() => {
  return props.fields.map((field: any) => {
    return { name: field, label: field, field: field };
  });
});

const targetIndex = computed(() => {
  return props.rows.findIndex((row: any) => {
    return props.getShouldHighlight(row);
  });
});

function scrollToTarget() {
  const idx = targetIndex.value;
  if (idx > -1) {
    console.log('[KTable] scrolling to', idx);
    table.value?.scrollTo(idx, 'center');
  } else {
    console.log('[KTable] Target not found. Not scrolling.');
  }
}
</script>
