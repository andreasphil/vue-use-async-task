// src/useAsyncTask.ts
import { computed, ref } from "vue";
function useAsyncTask(fetcher, shared) {
  const data = ref();
  const isLoading = shared?.isLoading ?? ref(false);
  const error = shared?.error ?? ref(void 0);
  const hasError = computed(() => !!error.value);
  const run = async (...args) => {
    isLoading.value = true;
    error.value = void 0;
    try {
      const result = await fetcher(...args);
      data.value = result;
      return [result, void 0];
    } catch (e) {
      error.value = e;
      return [void 0, e];
    } finally {
      isLoading.value = false;
    }
  };
  return {
    /**
     * Executes the task and updates all the state properties. Returns a tuple
     * of the shape `[data, error]` that contains the result of the task. If
     * the task succeeded, `data` will be set to the return value (if one
     * exists), `error` will be undefined. If the task threw, `data` will be
     * undefined and `error` will be set to the value that was thrown. Note
     * that `run` itself never throws, so you don't need to catch anything.
     *
     * Example:
     *
     * ```
     * const { run } = useAsyncTask(myTask);
     * const [data, error] = await run();
     * if (error) {
     *   // Handle error here
     * } else {
     *   // Do something with data here
     * }
     * ```
     */
    run,
    /** Return value of the task */
    data,
    /** True while the task is running */
    isLoading,
    /** Will receive the exception thrown by the task if one occurs */
    error,
    /** True if an exception has been thrown */
    hasError
  };
}
export {
  useAsyncTask
};
