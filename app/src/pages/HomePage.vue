<template>
  <q-page>
    <h1 class="text-center text-h1">Demystifying SQL Order</h1>
    <q-card flat style="max-width: 500px; margin: auto;">
      <q-card-section>
        <h2 class="text-center text-h2 text-bold">Experiments</h2>
      </q-card-section>
      <q-card-section>
        <q-list class="q-gutter-lg">
          <q-item clickable v-ripple to="/expt-one" class="w-full text-h3 text-violet-light">
            <q-item-section>Expt. One: Barbara</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/expt-two" class="w-full text-h3 text-violet-light">
            <q-item-section>Expt. Two: Damian</q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style>
.text-violet-light {
  color: #a361ff !important;
}
</style>
