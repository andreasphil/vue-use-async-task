import { computed, ref } from "vue";
/**
 * Returns a wrapper for an asynchronous function that keeps track of the
 * loading state, errors, and return value of the function.
 */
export function useAsyncTask(
/** Function that performs an async task */
fetcher, 
/**
 * If provided, will use existing reactive variables for storing state
 * instead of creating new ones. Useful e.g. for sharing the `isLoading`
 * state between multiple async tasks.
 */
shared) {
    // State
    const data = ref();
    const isLoading = shared?.isLoading ?? ref(false);
    const error = shared?.error ?? ref(undefined);
    const hasError = computed(() => !!error.value);
    const run = async (...args) => {
        isLoading.value = true;
        error.value = undefined;
        try {
            const result = await fetcher(...args);
            data.value = result;
            return [result, undefined];
        }
        catch (e) {
            error.value = e;
            return [undefined, e];
        }
        finally {
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
        hasError,
    };
}
