<template>
  <q-page class="flex" style="flex-direction: column;">
    <div class="flex w-full q-px-md q-py-sm" style="
    align-items: center;
    justify-content: space-between;
    ">
      <q-btn @click="$router.push('/')"  icon="home" flat no-caps></q-btn>

      <span class="text-h5">
        Demystifying SQL Order:
        <b>
          {{ exptStore.name }}
        </b>
      </span>

      <q-btn icon="code" href="https://github.com/djalilhebal/demystifying-sql-order" flat></q-btn>
    </div>

    <q-stepper flat contracted class="flex-grow" style="width: 100%;" v-model="step">
      <q-step
        v-for="step in exptStore.steps"
        :key="step.id"
        :name="step.name" :title="step.name + ''"
        :done="step.done || step.commandExecuted"
        >
        <section class="row">
          <QMarkdown class="col-8 q-ma-md" no-line-numbers>
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

        <q-btn
          v-if="step.explainable"
          outline :color="step.explainable ? 'white' : 'grey`'" label="Explain"
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
        <q-stepper-navigation class="fixed-bottom" style="text-align: right;">
          <q-btn
            v-if="step > 1"
            label="Back" outline color="white" class="q-mr-sm"
            @click="stepper?.previous()"
            />
          <q-btn @click="stepper?.next()" color="primary" label="Next" />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { QMarkdown } from '@quasar/quasar-ui-qmarkdown';
import '@quasar/quasar-ui-qmarkdown/dist/index.css';
import 'prismjs/components/prism-sql';
import { QStepper, useQuasar } from 'quasar';

import KTable from './KTable.vue';

const props = defineProps({
  exptStore: {
    type: Object,
    required: true,
  },
});

const $q = useQuasar();

const stepper = ref<QStepper | null>(null);

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
