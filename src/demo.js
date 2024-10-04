import { createApp, defineComponent } from "vue/dist/vue.esm-bundler.js";
import { useAsyncTask } from "./lib.ts";

const App = defineComponent({
  setup() {
    let shouldFail = false;
    let shouldComplete = false;

    async function task() {
      return new Promise((resolve, reject) => {
        const i = setInterval(() => {
          if (!shouldComplete) return;
          clearInterval(i);
          shouldFail ? reject("Error!") : resolve("Success!");
        }, 500);
      });
    }

    const { data, error, hasError, isLoading, run } = useAsyncTask(task);

    function runTask() {
      shouldComplete = false;
      run();
    }

    function finish(success) {
      shouldFail = !success;
      shouldComplete = true;
    }

    return { data, error, hasError, isLoading, runTask, finish };
  },

  template: /* html */ `
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
  `,
});

createApp(App).mount("#app");
