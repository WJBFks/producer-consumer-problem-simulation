<template>
  <div :class="['os-process', process.type]">
    <el-popconfirm
      confirm-button-text="确定"
      cancel-button-text="取消"
      icon-color="red"
      title="你确定要移除该进程吗？"
      @confirm="emits('remove', process.id)"
    >
      <template #reference>
        <div class="content">
          {{ process.type[0] }}
          {{ process.id < 10 ? "0" + process.id : process.id }}
        </div>
      </template>
    </el-popconfirm>
  </div>
</template>

<script lang="ts" setup>
import { Process } from "@/scripts/models";
import { defineProps, defineEmits } from "vue";

const emits = defineEmits<{
  (event: "remove", id: number): void;
}>();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  process: {
    type: Process,
    required: true,
  },
});
</script>

<style lang="stylus" scoped>
.os-process
  display block
  border 1px solid black
  min-width 60px
  padding 10px
  border-radius 6px
  height 20px
  cursor pointer
  & .content
    font-weight bold
    font-size 20px
  &.Producer
    border-color #b3e19d
    background-color #f0f9eb
    color #67c23a
  &.Consumer
    border-color #f3d19e
    background-color #fdf6ec
    color #e6a23c
  &.block
    border-color #fab6b6
    background-color #fef0f0
    color #f56c6c
</style>
