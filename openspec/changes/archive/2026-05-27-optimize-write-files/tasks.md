## 1. Refactor `writeFiles()` method

- [x] 1.1 Collect all unique parent directory paths from entries
- [x] 1.2 Create all directories in parallel using `Promise.all()`
- [x] 1.3 Write file entries in batches of 20 using `Promise.allSettled()`
- [x] 1.4 Emit `file:changed` event once per batch
- [x] 1.5 Call `refreshTree(true)` once after all batches complete

## 2. Verify and test

- [x] 2.1 Run existing tests to confirm no regressions
- [x] 2.2 Verify batch failure handling (one file fails, others succeed)
