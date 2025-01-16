<template>
  <ExptSlides :exptStore="exptStore"></ExptSlides>
</template>

<script setup>
import { useExptOneStore } from 'src/stores/expt-one-store';
import ExptSlides from 'src/pages/ExptSlides.vue';

const exptStore = useExptOneStore();
</script>
