# Profiler Data Loader Plan

## Overview
Abstract `DataLoader` class with method-based API. Consumer creates loader and calls `fromUrls(urls)` to load data. Easy to add new methods like `fromFiles()`, `fromDatabase()` later.

## Design
- **Strategy Pattern**: `DataSource` interface for different sources (URLs, files, DB)
- **Result Pattern**: `{ok: true, text} | {ok: false, error}`
- **Fluent API**: `new DataLoader().fromUrls(urls)` delegates to `UrlSource`

## File Structure
```
src/module/profiler/
├── index.ts                    # Export DataLoader + types
└── data/
    ├── loader.ts               # DataLoader class (context)
    └── sources/
        ├── source.interface.ts # DataSource interface
        ├── url-source.ts       # UrlSource implementation
        └── index.ts            # Export sources
```

## Core Interfaces

### DataSource Strategy (data/sources/source.interface.ts)
```typescript
export interface DataSource {
  load(): Promise<LoadResult>;
}

export type LoadResult =
  | { ok: true; text: string }
  | { ok: false; error: string };
```

### Concrete Strategy: UrlSource (data/sources/url-source.ts)
```typescript
export class UrlSource implements DataSource {
  constructor(private urls: string[]) {}

  async load(): Promise<LoadResult> {
    // 1. Fetch all URLs with Promise.all()
    // 2. Extract text responses
    // 3. Concatenate with \n\n---\n\n
    // 4. Return result
  }
}
```

### Context: DataLoader (data/loader.ts)
```typescript
export class DataLoader {
  async fromUrls(urls: string[]): Promise<LoadResult> {
    const source = new UrlSource(urls);
    return source.load();
  }

  // Future: fromFiles, fromDatabase methods
}
```

## Public API (index.ts)
```typescript
export { DataLoader } from './data/loader';
export type { LoadResult } from './data/sources/source.interface';
```

## Implementation Steps

### Stage 1: Strategy interface (Testable: types compile)
1. Create `src/module/profiler/data/sources/source.interface.ts`
   - Define `DataSource` interface with `load(): Promise<LoadResult>`
   - Define `LoadResult` type

### Stage 2: UrlSource implementation (Testable: fetch URLs)
2. Create `src/module/profiler/data/sources/url-source.ts`
   - Implement `UrlSource` class
   - Constructor: accept `urls: string[]`
   - Implement `async load(): Promise<LoadResult>`
     - Fetch: `Promise.all(this.urls.map(url => fetch(url)))`
     - Extract: `await Promise.all(responses.map(r => r.text()))`
     - Concatenate: `texts.join('\n\n---\n\n')`
     - Error handling: try-catch, return `{ok: false, error}`
3. Create `src/module/profiler/data/sources/index.ts`
   - Export `UrlSource`
   - Export interface/types

### Stage 3: DataLoader context (Testable: integration)
4. Create `src/module/profiler/data/loader.ts`
   - Create `DataLoader` class
   - Implement `async fromUrls(urls: string[]): Promise<LoadResult>`
     - Instantiate `UrlSource` with urls
     - Call and return `source.load()`
5. Create `src/module/profiler/index.ts`
   - Export `DataLoader` class
   - Export `LoadResult` type

## Consumer Usage
```typescript
import { DataLoader } from '@/module/profiler';

const loader = new DataLoader();

const result = await loader.fromUrls([
  'https://example.com/bio.txt',
  'https://example.com/resume.txt'
]);

if (result.ok) {
  console.log(result.text);
} else {
  console.error(result.error);
}
```

## Future Extensibility
```typescript
// Add new source strategies
class FileSource implements DataSource {
  constructor(private paths: string[]) {}
  async load(): Promise<LoadResult> { /* read files */ }
}

class DatabaseSource implements DataSource {
  constructor(private query: string) {}
  async load(): Promise<LoadResult> { /* query DB */ }
}

// Add new methods to DataLoader
class DataLoader {
  async fromUrls(urls: string[]): Promise<LoadResult> {
    return new UrlSource(urls).load();
  }
  async fromFiles(paths: string[]): Promise<LoadResult> {
    return new FileSource(paths).load();
  }
  async fromDatabase(query: string): Promise<LoadResult> {
    return new DatabaseSource(query).load();
  }
}
```

## Error Handling
- Try-catch around fetch logic
- If ALL URLs fail → return `{ok: false, error}`
- If SOME fail → continue with successful ones
- Use Result pattern for type-safe errors

Meow 😸