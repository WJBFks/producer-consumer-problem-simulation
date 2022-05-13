<template>
  <div :class="{ 'os-buffer': true, exist: buffer.isExist }">
    <div class="content">
      <span v-if="buffer.isExist">{{
        buffer.id < 10 ? "0" + buffer.id : buffer.id
      }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Buffer } from "@/scripts/models";
import { defineProps } from "vue";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  buffer: {
    type: Buffer,
    required: true,
  },
});
</script>

<style lang="stylus" scoped>
.os-buffer
  display block
  border 1px solid black
  max-width 60px
  padding 10px
  height 20px
  border-color #c8c9cc
  background-color #f4f4f5
  color #909399
  & .content
    display block
    width 25px
    height 25px
    font-weight bold
    font-size 20px
  &.exist
    border-color #a0cfff
    background-color #ecf5ff
    color #409eff
</style>
