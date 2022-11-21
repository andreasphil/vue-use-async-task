<script setup lang="ts">
import { useAsyncTask } from "../index";

/* -------------------------------------------------- *
 * Dummy task for demonstration                       *
 * -------------------------------------------------- */

let shouldFail = false;
let shouldComplete = false;

async function task() {
  return new Promise<string>((resolve, reject) => {
    const i = setInterval(() => {
      if (!shouldComplete) return;
      clearInterval(i);
      shouldFail ? reject("Error!") : resolve("Success!");
    }, 500);
  });
}

/* -------------------------------------------------- *
 * Demo setup                                         *
 * -------------------------------------------------- */

const { data, error, hasError, isLoading, run } = useAsyncTask(task);

function runTask() {
  shouldComplete = false;
  run();
}

function finish(success: boolean) {
  shouldFail = !success;
  shouldComplete = true;
}
</script>

<template>
  <h1>useAsyncTask demo</h1>
  <div :style="{ display: 'flex', gap: '0.5rem' }">
    <button :disabled="isLoading" @click="runTask">Start</button>
    <button :disabled="!isLoading" @click="finish(true)">Succeed</button>
    <button :disabled="!isLoading" @click="finish(false)">Fail</button>
  </div>
  <hr />
  <ul>
    <li><strong>isLoading</strong>: {{ isLoading }}</li>
    <li><strong>hasError</strong>: {{ hasError }}</li>
    <li><strong>data</strong>: {{ data }}</li>
    <li><strong>error</strong>: {{ error }}</li>
  </ul>
</template>
