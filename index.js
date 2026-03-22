function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log("From cache");
      return cache.get(key);
    }

    console.log("Calculating...");
    const result = fn(...args);

    cache.set(key, result);
    return result;
  };
}
