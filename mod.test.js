import assert from "node:assert/strict";
import { describe, mock, test } from "node:test";
import { ref } from "vue";
import { useAsyncTask } from "./mod.js";

describe("useAsyncTask", () => {
  test("initializes", () => {
    const task = useAsyncTask(() => Promise.resolve());
    assert(task);
  });

  test("runs the fetcher function", () => {
    const fetcher = mock.fn(() => Promise.resolve("success"));
    const task = useAsyncTask(fetcher);
    task.run();
    assert.equal(fetcher.mock.callCount(), 1);
  });

  test("returns the data", async () => {
    const fetcher = mock.fn(() => Promise.resolve("success"));
    const { run } = useAsyncTask(fetcher);
    const [data, error] = await run();
    assert.equal(data, "success");
    assert(!error);
  });

  test("returns an error", async () => {
    const fetcher = mock.fn(() => Promise.reject("error"));
    const { run } = useAsyncTask(fetcher);
    const [data, error] = await run();
    assert(!data);
    assert.equal(error, "error");
  });

  test("stores the returned data", async () => {
    const fetcher = mock.fn(() => Promise.resolve("success"));
    const { run, data } = useAsyncTask(fetcher);
    await run();
    assert.equal(data.value, "success");
  });

  test("retains the returned data if an error occurs", async () => {
    const fetcher = mock.fn((willSucceed) => {
      if (willSucceed) return Promise.resolve("success");
      else throw "error";
    });

    const { run, data, error } = useAsyncTask(fetcher);

    await run(true);
    assert.equal(data.value, "success");
    assert(!error.value);

    await run(false);
    assert.equal(data.value, "success");
    assert.equal(error.value, "error");
  });

  test("sets the loading state", () => {
    const fetcher = mock.fn(() => Promise.resolve("success"));

    const { run, isLoading } = useAsyncTask(fetcher);
    assert(!isLoading.value);
    run();
    assert(isLoading.value);
  });

  test("unsets the loading state in case of success", async () => {
    const fetcher = mock.fn(() => Promise.resolve("success"));
    const { run, isLoading } = useAsyncTask(fetcher);

    await run();
    assert(!isLoading.value);
  });

  test("unsets the loading state in case of error", async () => {
    const fetcher = mock.fn(() => Promise.reject("error"));
    const { run, isLoading } = useAsyncTask(fetcher);

    await run();
    assert(!isLoading.value);
  });

  test("stores the returned error", async () => {
    const fetcher = mock.fn(() => Promise.reject("error"));
    const { run, error } = useAsyncTask(fetcher);

    await run();
    assert.equal(error.value, "error");
  });

  test("indicates that an error exists", async () => {
    const fetcher = mock.fn(() => Promise.reject("error"));
    const { run, hasError } = useAsyncTask(fetcher);

    await run();
    assert(hasError.value);
  });

  test("indicates that no error exists", async () => {
    const fetcher = mock.fn(() => Promise.resolve("success"));
    const { run, hasError } = useAsyncTask(fetcher);

    await run();
    assert(!hasError.value);
  });

  test("resets the returned error", async () => {
    const fetcher = mock.fn((willSucceed) => {
      if (willSucceed) return Promise.resolve("success");
      else throw "error";
    });

    const { run, error } = useAsyncTask(fetcher);

    await run(false);
    assert.equal(error.value, "error");
    await run(true);
    assert(!error.value);
  });

  test("uses a shared loading state", () => {
    const shared = ref(false);
    const { isLoading } = useAsyncTask(mock.fn(), { isLoading: shared });

    // Need to use refs as operands because we want to compare the refs
    // themselves instead of their values
    assert.equal(isLoading, shared);
  });

  test("uses a shared error state", () => {
    const shared = ref();
    const { error } = useAsyncTask(mock.fn(), { error: shared });

    // Need to use refs as operands because we want to compare the refs
    // themselves instead of their values
    assert.equal(error, shared);
  });
});
