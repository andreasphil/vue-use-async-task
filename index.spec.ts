import { afterAll, beforeEach, describe, expect, test, vi } from "vitest";
import { ref } from "vue";
import { useAsyncTask } from "./index";

describe("useAsyncTask", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  test("initializes properly", () => {
    const task = useAsyncTask(() => Promise.resolve());
    expect(task).toBeTruthy();
  });

  test("runs the fetcher function", () => {
    const fetcher = vi.fn().mockResolvedValue("success");
    const task = useAsyncTask(fetcher);
    task.run();
    expect(fetcher).toHaveBeenCalled();
  });

  test("returns the data", async () => {
    const fetcher = vi.fn().mockResolvedValue("success");
    const { run } = useAsyncTask(fetcher);
    const [data, error] = await run();
    expect(data).toBe("success");
    expect(error).toBe(undefined);
  });

  test("returns an error", async () => {
    const fetcher = vi.fn().mockRejectedValue("error");
    const { run } = useAsyncTask(fetcher);
    const [data, error] = await run();
    expect(data).toBe(undefined);
    expect(error).toBe("error");
  });

  test("stores the returned data", async () => {
    const fetcher = vi.fn().mockResolvedValue("success");
    const { run, data } = useAsyncTask(fetcher);
    await run();
    expect(data.value).toBe("success");
  });

  test("retains the returned data if an error occurs", async () => {
    const fetcher = vi.fn().mockImplementation((willSucceed: boolean) => {
      if (willSucceed) return Promise.resolve("success");
      else throw "error";
    });

    const { run, data, error } = useAsyncTask(fetcher);

    await run(true);
    expect(data.value).toBe("success");
    expect(error.value).toBe(undefined);

    await run(false);
    expect(data.value).toBe("success");
    expect(error.value).toBe("error");
  });

  test("sets the loading state", () => {
    const fetcher = vi.fn().mockResolvedValue("success");

    const { run, isLoading } = useAsyncTask(fetcher);
    expect(isLoading.value).toBe(false);
    run();
    expect(isLoading.value).toBe(true);
  });

  test("unsets the loading state in case of success", async () => {
    const fetcher = vi.fn().mockResolvedValue("success");
    const { run, isLoading } = useAsyncTask(fetcher);

    await run();
    expect(isLoading.value).toBe(false);
  });

  test("unsets the loading state in case of error", async () => {
    const fetcher = vi.fn().mockRejectedValue("error");
    const { run, isLoading } = useAsyncTask(fetcher);

    await run();
    expect(isLoading.value).toBe(false);
  });

  test("stores the returned error", async () => {
    const fetcher = vi.fn().mockRejectedValue("error");
    const { run, error } = useAsyncTask(fetcher);

    await run();
    expect(error.value).toBe("error");
  });

  test("indicates that an error exists", async () => {
    const fetcher = vi.fn().mockRejectedValue("error");
    const { run, hasError } = useAsyncTask(fetcher);

    await run();
    expect(hasError.value).toBe(true);
  });

  test("indicates that no error exists", async () => {
    const fetcher = vi.fn().mockResolvedValue("success");
    const { run, hasError } = useAsyncTask(fetcher);

    await run();
    expect(hasError.value).toBe(false);
  });

  test("resets the returned error", async () => {
    const fetcher = vi.fn().mockImplementation((willSucceed: boolean) => {
      if (willSucceed) return Promise.resolve("success");
      else throw "error";
    });

    const { run, error } = useAsyncTask(fetcher);

    await run(false);
    expect(error.value).toBe("error");
    await run(true);
    expect(error.value).toBe(undefined);
  });

  test("uses a shared loading state", () => {
    const shared = ref(false);
    const { isLoading } = useAsyncTask(vi.fn(), { isLoading: shared });

    // Need to use refs as operands because we want to compare the refs
    // themselves instead of their values
    expect(isLoading === shared).toBe(true);
  });

  test("uses a shared error state", () => {
    const shared = ref();
    const { error } = useAsyncTask(vi.fn(), { error: shared });

    // Need to use refs as operands because we want to compare the refs
    // themselves instead of their values
    expect(error === shared).toBe(true);
  });
});
