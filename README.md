<h1 align="center">
  useAsyncTask 🚂
</h1>

<p align="center">
  <strong>Composable for state and results of asynchronous tasks in Vue</strong>
</p>

- ✅ Manages `isLoading`, return values and errors automatically
- 🦾 Works with any function that returns a promise
- 👌 Fully typed and tested

## Installation

From a CDN:

```ts
import { useAsyncTask } from "https://esm.sh/gh/andreasphil/vue-use-async-task@<tag>?external=vue";
```

With a package manager:

```sh
npm i github:andreasphil/vue-use-async-task#<tag>
```

## Usage

`useAsyncTask` is a Vue composable that returns a number of reactive variables commonly needed for handling state etc. when doing asynchronous work in components:

```ts
const { isLoading, data, error, hasError, run } = useAsyncTask(myAsyncTask);
```

Example:

```vue
<script setup lang="ts">
import { useAsyncTask } from "vue-use-async-task";

async function myAsyncTask(param: string): Promise<string> {
  // Perform some async task, e.g. an API call
}

const { isLoading, data, error, run } = useAsyncTask(myAsyncTask);

// You can now use run() to run the function you provided to the composable.
// It takes the same parameters as the original function.
run("Hello world!");
</script>
```

The following reactive variables will be available:

- `run()`: Runs the function. Expects the same parameters as the original function.
- `isLoading`: Will be true until the function either resolves or rejects
- `data`: Returns the value with which the function resolved. This will _not_ be cleared automatically if you re-run or if running rejects. This allows you, for example, to refresh data without having your view suddenly appear empty while the refresh is running.
- `error`: Will contain the error if the function rejects. This is cleared automatically next time `run` succeeds.
- `hasError`: Will be true if `error` is truthy

### Accessing `run` result directly

In most cases, you'll want to work only with the reactive variables for managing state. However, if you need to to access the result of `run` imperatively, you can do so via its return value:

```ts
const [data, error] = await run();
if (error) {
  // Handle `error`. `data` will be `undefined`.
} else {
  // Do something with `data`. `error` will be `undefined`.
}
```

### Sharing between several tasks

If you have multiple asynchronous tasks on the same page, you can choose to share the `isLoading` and `error` states between them:

```ts
const { isLoading, error, run: runTaskA } = useAsyncTask(taskA);
const { run: runTaskB } = useAsyncTask(taskB, { isLoading, error });
```

Now `isLoading` will be `true` if either `taskA` or `taskB` are running. Both will store their error in `error`.

### API

See [mod.d.ts](./mod.d.ts) for all available methods and docs.

## Development

This library is compatible with [Vue 3](https://vuejs.org). Packages are managed by [npm](https://npmjs.org). Tests are powered by [Node.js' test runner](https://nodejs.org/en/learn/test-runner/introduction). The following commands are available:

```sh
node --run test         # Run tests once
node --run test:watch   # Run tests in watch mode
node --run build        # Bundle for production
```

## Credits

This library uses a number of open source packages listed in [package.json](package.json). The syntax was inspired by [SWR](https://swr.vercel.app).

Thanks 🙏
