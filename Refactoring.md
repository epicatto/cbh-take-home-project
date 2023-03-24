# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here
Refactor changes:
* **Moved the constants to a global scope, outside the function.** They look like "app configs/settings" values, and I think there is no need to initialize these constants with the same values every time the function is called. In addition, we cloud even move them to a `config.js` file and retrieve their values from environment variables (using the current values as default).
* **Created a function in charge of creating the hash to avoid code duplication.** Since this logic requires a specific module/library (crypto), algorithm (sha3-512) and encoding (hex), it's good practice to move it to a common place (it could even be moved to an `utils` package, outside `dpk.js` file), so in case we need to change the library, the algorithm or the coding, we just need to change a single place.
* **Used early returns.** This is the main change that makes the code cleaner and more readable. We can easily see the logics for each case: no `input` is provided, no `partitionKey` is provided and `partitionKey` is provided. In the first two cases (easier), we can just return the value ASAP and focus on the last case (harder) at the end of the function.
