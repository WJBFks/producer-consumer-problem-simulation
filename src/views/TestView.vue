<template>
  <div class="test">
    <os-process :process="new Process(1, 'Producer')" />
    <os-process :process="new Process(2, 'Consumer')" />
  </div>
</template>

<script lang="ts" setup>
import { Process } from "@/scripts/models";
import OsProcess from "@/components/OsProcess.vue";
</script>

<style lang="stylus" scoped>
.test
  margin-top 200px
</style>
