function memoize(fn, { maxSize = Infinity, policy = "lru", ttl = null, customEvict = null } = {}) {
  const cache = new Map();
  const freq = {};
  const times = {};

  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key) && ttl && Date.now() - times[key] > ttl) {
      cache.delete(key);
    }

    if (cache.has(key)) {
      freq[key] = (freq[key] || 0) + 1;
      const value = cache.get(key);
      cache.delete(key);
      cache.set(key, value);
      console.log("From cache");
      return value;
    }

    if (cache.size >= maxSize) {
      let keyToDelete;

      if (customEvict) {
        keyToDelete = customEvict(cache, freq, times);
      } else if (policy === "lru") {
        keyToDelete = cache.keys().next().value;
      } else if (policy === "lfu") {
        let minFreq = Infinity;
        for (const k of cache.keys()) {
          if ((freq[k] || 0) < minFreq) {
            minFreq = freq[k] || 0;
            keyToDelete = k;
          }
        }
      }

      cache.delete(keyToDelete);
      delete freq[keyToDelete];
      delete times[keyToDelete];
    }

    console.log("Calculating...");
    const result = fn(...args);
    cache.set(key, result);
    freq[key] = 1;
    times[key] = Date.now();
    return result;
  };
}

// ===== ТЕСТИ =====
const add = (a, b) => a + b;

console.log("=== LRU ===");
const lruAdd = memoize(add, { maxSize: 2, policy: "lru" });
lruAdd(1, 2); // Calculating...
lruAdd(3, 4); // Calculating...
lruAdd(1, 2); // From cache
lruAdd(5, 6); // Calculating...
lruAdd(3, 4); // Calculating...

console.log("=== LFU ===");
const lfuAdd = memoize(add, { maxSize: 2, policy: "lfu" });
lfuAdd(1, 2); // Calculating...
lfuAdd(3, 4); // Calculating...
lfuAdd(1, 2); // From cache 
lfuAdd(5, 6); // Calculating... 
lfuAdd(3, 4); // Calculating...

console.log("=== TTL ===");
const ttlAdd = memoize(add, { ttl: 500 });
ttlAdd(1, 2); // Calculating...
ttlAdd(1, 2); // From cache
setTimeout(() => {
  ttlAdd(1, 2); // Calculating...
}, 600);

console.log("=== Custom ===");
const customAdd = memoize(add, {
  maxSize: 2,
  customEvict: (cache) => cache.keys().next().value
});
customAdd(1, 2); // Calculating...
customAdd(3, 4); // Calculating...
customAdd(5, 6); // Calculating...
customAdd(1, 2); // Calculating...
