<template>
  <ExptSlides :exptStore="exptStore"></ExptSlides>
</template>

<script setup>
import { useExptTwoStore } from 'src/stores/expt-two-store';
import ExptSlides from 'src/pages/ExptSlides.vue';

const exptStore = useExptTwoStore();
</script>
