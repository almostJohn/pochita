/**
 * @template T
 * @typedef {Object} Success
 * @property {T} data - The result.
 * @property {null} error - No error, always null.
 */

/**
 * @template E
 * @typedef {Object} Failure
 * @property {E} error - The error object.
 * @property {null} data - No data, always null.
 */

/**
 * @template T
 * @template [E=Error]
 * @typedef {Success<T> | Failure<E>} Result
 */

/**
 * @template T
 * @template [E=Error]
 * @param {Promise<T>} promise - The promise to execute.
 * @returns {Promise<Result<T, E>>} A promise that resolves a success or a failure result.
 */
export async function tryCatch(promise) {
	try {
		const data = await promise;
		return { data, error: null };
	} catch (error_) {
		/** @type {Error} */
		const error = error_;
		return { data: null, error };
	}
}
