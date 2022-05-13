<template>
  <div :class="['os-queue', type]">
    <div class="content flex">
      <div class="title">{{ name }}</div>
      <div class="queue">
        <os-process
          :v-if="type != 'buffer'"
          v-for="item in processes"
          :key="item.id"
          :process="item"
          @remove="remove"
          style="margin: 0 8px"
        />
        <os-buffer
          :v-if="type == 'buffer'"
          v-for="item in buffers"
          :key="item.id"
          :buffer="item"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Process, Buffer } from "@/scripts/models";
import OsProcess from "./OsProcess.vue";
import OsBuffer from "./OsBuffer.vue";
import { ref, defineProps, defineEmits } from "vue";
const emit = defineEmits(["update:processes"]);

const props = defineProps({
  processes: {
    type: Array as () => Array<Process>,
    required: false,
  },
  buffers: {
    type: Array as () => Array<Buffer>,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const processes = ref(props.processes);
const remove = (id: number) => {
  processes.value = props.processes?.filter((item: Process) => item.id != id);
  emit("update:processes", processes.value);
};
</script>

<style lang="stylus" scoped>
.os-queue
  display block
  border 1px solid black
  padding 10px
  border-radius 6px
  height 42px
  width 100%
  & .title
    min-width 100px
    text-align center
    font-size 24px
    margin 7px 0
    font-weight bold
  & .queue
    display flex
    overflow-x hidden
  &:hover .queue
    overflow-x auto
  .os-Process
    margin-left 10px
  & .content
    display flex
    & .id
      font-weight bold
      font-size 20px
    & .pri
      font-size 12px
    & .mem
      margin-top 4px
      margin-left 8px
      font-size 16px
      justify-content bottom
  &.buffer
    border-color #a0cfff
    background-color #ecf5ff
    color #409eff
  &.running
    border-color #b3e19d
    background-color #f0f9eb
    color #67c23a
  &.block
    border-color #ffb6b6
    background-color #fffefe
    color #f56c6c
.queue::-webkit-scrollbar
  /* 滚动条整体样式 */
  height 8px
.queue::-webkit-scrollbar-thumb
  /* 滚动条里面小方块 */
  border-radius 10px
  background rgba(100, 100, 100, 0.5)
  .buffer &
    background alpha(#409eff, 0.5)
  .running &
    background alpha(#67c23a, 0.5)
  .block &
    background alpha(#f56c6c, 0.5)
.queue::-webkit-scrollbar-track
  /* 滚动条里面轨道 */
  border-radius 10px
  background rgba(0, 0, 0, 0)
</style>
