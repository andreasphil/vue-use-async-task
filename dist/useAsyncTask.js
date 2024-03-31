import { ref as r, computed as a } from "vue";
function f(i, o) {
  const c = r(), u = (o == null ? void 0 : o.isLoading) ?? r(!1), n = (o == null ? void 0 : o.error) ?? r(void 0), e = a(() => !!n.value);
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
    run: async (...l) => {
      u.value = !0, n.value = void 0;
      try {
        const t = await i(...l);
        return c.value = t, [t, void 0];
      } catch (t) {
        return n.value = t, [void 0, t];
      } finally {
        u.value = !1;
      }
    },
    /** Return value of the task */
    data: c,
    /** True while the task is running */
    isLoading: u,
    /** Will receive the exception thrown by the task if one occurs */
    error: n,
    /** True if an exception has been thrown */
    hasError: e
  };
}
export {
  f as useAsyncTask
};
