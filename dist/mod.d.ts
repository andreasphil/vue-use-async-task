/**
 * Returns the parameters of a generic function T
 *
 * @template T
 * @typedef {T extends (...t: [...infer Params]) => any ? Params : never} InferArgs
 */
/**
 * Returns the return value of a generic function T
 *
 * @template T
 * @typedef {T extends (...t: any) => infer Return ? Return : never} InferReturn
 */
/**
 * @template {(...args: any[]) => Promise<any>} F
 * @template E
 * @param {F} fetcher
 * @param {Object} [shared]
 * @param {Ref<boolean>} [shared.isLoading]
 * @param {Ref<E | undefined>} [shared.error]
 */
export function useAsyncTask<F extends (...args: any[]) => Promise<any>, E>(fetcher: F, shared?: {
    isLoading?: Ref<boolean>;
    error?: Ref<E | undefined>;
}): {
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
    run: (...args: InferArgs<F>) => Promise<[Awaited<InferReturn<typeof fetcher>>, undefined] | [undefined, E]>;
    /** Return value of the task */
    data: Ref<Awaited<InferReturn<F>>, Awaited<InferReturn<F>>>;
    /** True while the task is running */
    isLoading: Ref<boolean, boolean>;
    /** Will receive the exception thrown by the task if one occurs */
    error: Ref<E, E>;
    /** True if an exception has been thrown */
    hasError: import("vue").ComputedRef<boolean>;
};
/**
 * Returns the parameters of a generic function T
 */
export type InferArgs<T> = T extends (...t: [...infer Params]) => any ? Params : never;
/**
 * Returns the return value of a generic function T
 */
export type InferReturn<T> = T extends (...t: any) => infer Return ? Return : never;
import type { Ref } from "vue";
