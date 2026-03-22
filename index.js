function memoize(fn, maxSize = Infinity) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log("From cache");
      return cache.get(key);
    }

    // якщо кеш переповнений — видаляємо найстаріший
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    console.log("Calculating...");
    const result = fn(...args);

    cache.set(key, result);
    return result;
  };
}
