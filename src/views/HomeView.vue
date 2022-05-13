<template>
  <div class="home">
    <os-queue :buffers="bufferQue" type="buffer" name="Buffer" />
    <os-queue v-model:processes="currentQue" type="running" name="Current" />
    <os-queue v-model:processes="emptyQue" type="block" name="Empty" />
    <os-queue v-model:processes="fullQue" type="block" name="Full" />
    <os-queue v-model:processes="mutexQue" type="block" name="Mutex" />
    <div class="operate">
      <div class="buffer-size">
        <div class="input">
          <el-input v-model.number="IBufferSize"></el-input>
        </div>
        <el-button
          type="primary"
          @click="
            () => {
              BufferSize = IBufferSize;
              bufferResize();
            }
          "
          plain
          >Buffer Resize</el-button
        >
      </div>
      <el-button type="success" plain @click="newProducer">Producer</el-button>
      <el-button type="warning" plain @click="newConsumer">Consumer</el-button>
      <el-button type="info" plain @click="exit">Exit</el-button>
    </div>
    <div class="tips">
      <div class="title">生产者消费者问题模拟</div>
      <div>
        <div class="title">BufferSize:</div>
        <div class="value">{{ BufferSize }}</div>
      </div>
      <div>
        <div class="title">BufferEmpty:</div>
        <div class="value">{{ BufferEmpty }}</div>
      </div>
      <div>
        <div class="title">BufferFull:</div>
        <div class="value">{{ BufferFull }}</div>
      </div>
      <div>
        <div class="title">Mutex:</div>
        <div class="value">{{ Mutex }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import OsQueue from "@/components/OsQueue.vue";
import { Process, Buffer } from "@/scripts/models";
import { ref } from "vue";
let head = 0;
let tail = 0;
let bufferCunter = 1;
const counter = ref(1);
const BufferSize = ref(8);
const IBufferSize = ref(BufferSize.value);
const BufferEmpty = ref(BufferSize.value);
const BufferFull = ref(0);
const Mutex = ref(1);
const bufferQue = ref(new Array<Buffer>());
const currentQue = ref(new Array<Process>());
const emptyQue = ref(new Array<Process>());
const fullQue = ref(new Array<Process>());
const mutexQue = ref(new Array<Process>());
const bufferResize = () => {
  bufferQue.value = new Array<Buffer>();
  for (let i = 1; i <= BufferSize.value; i++) {
    bufferQue.value.push(new Buffer(i, false));
  }
  bufferCunter = 1;
  counter.value = 1;
  BufferEmpty.value = BufferSize.value;
  BufferFull.value = 0;
  Mutex.value = 1;
};
bufferResize();
const toMutex = (producer: Process) => {
  Mutex.value -= 1;
  if (Mutex.value >= 0) {
    currentQue.value.push(producer);
  } else {
    mutexQue.value.push(producer);
  }
};
const runProducer = (producer: Process) => {
  if (BufferEmpty.value >= 0) {
    toMutex(producer);
  } else {
    emptyQue.value.push(producer);
  }
};
const runConsumer = (consumer: Process) => {
  if (BufferFull.value >= 0) {
    toMutex(consumer);
  } else {
    fullQue.value.push(consumer);
  }
};
const newProducer = () => {
  let producer = new Process(counter.value++, "Producer");
  BufferEmpty.value -= 1;
  runProducer(producer);
};
const newConsumer = () => {
  let consumer = new Process(counter.value++, "Consumer");
  BufferFull.value -= 1;
  runConsumer(consumer);
};
const exit = () => {
  if (currentQue.value.length > 0) {
    let process = currentQue.value.shift();
    Mutex.value += 1;
    if (process?.type == "Producer") {
      bufferQue.value[tail].id = bufferCunter++;
      bufferQue.value[tail++].isExist = true;
      tail %= BufferSize.value;
      BufferFull.value += 1;
      let p = fullQue.value.shift();
      if (p != undefined) {
        toMutex(p);
      }
    } else {
      bufferQue.value[head++].isExist = false;
      head %= BufferSize.value;
      BufferEmpty.value += 1;
      let p = emptyQue.value.shift();
      if (p != undefined) {
        toMutex(p);
      }
    }
    let mutex = mutexQue.value.shift();
    if (mutex != undefined) {
      currentQue.value.push(mutex);
    }
  }
};
</script>

<style lang="stylus" scoped>
.home
  margin 0 auto
  max-width 720px
  .os-queue
    max-width calc(100% - 40px)
    width 100%
    margin 20px auto
.status, .operate
  max-width 1030px
  width 100%
  margin auto
.os-queue
  border 1px solid black
  width 100%
.logs
  margin-top 30px
  height calc(100vh - 630px)
  min-height 300px
  box-sizing border-box
  padding 10px
  border-radius 8px
  border 2px solid #99A
  text-align left
  display flex
  flex-direction column-reverse
  justify-content flex-end
  overflow-y auto
.outline
  box-sizing border-box
  padding 10px 150px 10px 10px
  border 2px solid #99A
  &.t1
    border-width 0
  &.t2
    padding 10px
    border-bottom 0
    border-radius 8px 8px 0 0
    display flex
    & .mem
      & .text
        width 120px
        text-align right
        font-weight bold
  &.t3
    border-top 0
    border-bottom 0
  &.t4
    border-top 0
    border-radius 0 0 8px 8px
  &.t5
    border-width 0
.operate
  margin-top 30px
  display flex
  justify-content center
  flex-wrap wrap
  & .buffer-size
    padding 10px
    border 1px solid black
    border-radius 6px
    border-color #a0cfff
    background-color #ecf5ff
    color #409eff
    display flex
    align-items center
    & .input
      display flex
      flex-direction column
      align-items center
      margin-left 10px
      &::after
        content '____'
        position absolute
        margin-top 9px
        color #a0cfff
      & .tip
        font-size 12px
    & .el-input
      width 50px
    /deep/& .el-input__inner
      box-shadow 0 0 0 0
      border 1px solid black
      border-radius 6px
      border-color #a0cfff
      background-color #ecf5ff
      color #409eff
      width 50px
      text-align center
      &:focus::placeholder
        opacity 0
    & .id
      font-weight bold
      font-size 20px
    & .el-button
      margin-left 20px
      font-size 16px
      height 32px
      font-size 20px
  & .el-button
    height 54px
    font-size 20px
    border-radius 6px
    margin-left 20px
.tips
  position absolute
  right 0
  top 100px
  padding 20px
  border #a0cfff 1px solid
  background-color #ecf5ff
  color #409eff
  border-radius 10px 0 0 10px
  font-size 24px
  &>.title
    font-weight bold
    margin-bottom 20px
  & div
    display flex
    & .title
      width 210px
    & .value
      justify-content right
      width 30px
</style>
