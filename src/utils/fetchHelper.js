export const fetchWithTimeout = (fetchFunction, timeout=30000) => {
  return Promise.race([
    fetchFunction,
    new Promise((reject) => setTimeout(() => {
      reject(new Error('timeout'))
    }, timeout))
  ]);
}
