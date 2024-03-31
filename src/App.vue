<script setup lang="ts">
import { useAsyncTask } from "@/useAsyncTask";

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

<style>
body {
  font-family: ui-sans, sans-serif;
  font-size: 1.05em;
  line-height: 1.5em;
  margin: auto;
  max-width: 70ch;
  padding: 4rem 1rem;
  > :first-child { margin-top: 0; }
  > :last-child { margin-bottom: 0; }
}
h1, h2, h3, h4, h5, h6 {
  margin: 2em 0 1rem;
}
article, blockquote, header, footer, ol, ul, hr, p, pre {
  margin: 1.5em 0;
}
*, ::before, ::after {
  box-sizing: border-box;
}
</style>
