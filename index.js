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
// ===== TEST =====

const add = (a, b) => a + b;

const memoAdd = memoize(add, 2);

console.log(memoAdd(2, 3)); // Calculating...
console.log(memoAdd(2, 3)); // From cache

console.log(memoAdd(4, 5)); // Calculating...
console.log(memoAdd(6, 7)); // Calculating...

console.log(memoAdd(2, 3)); // Calculating (бо було видалено)
