<template>
  <q-page class="flex flex-col">
    <q-stepper ref="stepper" class="flex-grow" style="width: 100%;" v-model="step" contracted>
      <q-step v-for="step in exptStore.steps" :name="step.name" :title="step.name + ''"
        :done="step.done || step.commandExecuted">
        <section class="row">
          <QMarkdown class="col-8 q-ma-md" content-class="text-body1" no-line-numbers>
            ```sql
            {{ '\n' }}
            {{ step.command }}
            {{ '\n' }}
            ```
          </QMarkdown>

          <KTable v-if="step.fetchesRows" :fields="exptStore.fields" :rows="step.dataRows"
            :getShouldHighlight="exptStore.getIsTarget"></KTable>
        </section>

        <q-btn label="Execute" @click="exptStore.execute(step);" :loading="step.commandLoading"
          :disable="step.commandExecuted" :icon="step.commandExecuted ? 'check' : undefined"
          :color="step.commandExecuted ? 'green' : 'primary'"></q-btn>

        <q-separator class="q-ma-md"></q-separator>

        <q-btn outline :disable="!step.explainable" :color="step.explainable ? 'white' : 'grey`'" label="Explain"
          :loading="step.explainLoading" @click="exptStore.explain(step)">
        </q-btn>
        <q-card v-if="step.explainOutput">
          <q-card-section>
            <pre>
            {{ step.explainOutput }}
          </pre>
          </q-card-section>
        </q-card>
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation class="fixed-bottom">
          <q-btn @click="$refs.stepper.next()" color="primary" label="Next" />
          <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { QMarkdown } from '@quasar/quasar-ui-qmarkdown';
import '@quasar/quasar-ui-qmarkdown/dist/index.css';
import 'prismjs/components/prism-sql';
import { useQuasar } from 'quasar';

import KTable from './KTable.vue';

const props = defineProps({
  exptStore: {
    type: Object,
    required: true,
  },
});

const $q = useQuasar();

const stepper = ref(null);

const step = ref(1);

// ---

onMounted(async () => {
  $q.loading.show({
    delay: 300, // ms
    message: 'Initializing DB...',
  });

  await props.exptStore.initDb();

  $q.loading.hide();
});
</script>
