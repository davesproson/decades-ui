# Refactor: `getDataUrl` as a pure function

**GitHub issue:** davesproson/decades-ui#7
**Branch:** master

## Background

`getDataUrl` in `src/data/utils.ts` was reading two values from the Redux store
singleton at call time:

```ts
import store from '@store'

const job = store.getState().quicklook.qcJob
const quicklookMode = store.getState().config.quickLookMode
```

This made the function impure — the same arguments could produce a different URL
depending on global state — and forced every test that exercised URL construction
to mock the entire store module:

```ts
vi.mock('@store', () => ({ default: { getState: mocks.getState } }))
mocks.getState.mockReturnValue({ quicklook: { qcJob: 123 }, config: { quickLookMode: false } })
```

A secondary issue: `src/plot/utils.ts` contained a private duplicate of `getData`
(lines 442–453) identical to the exported version in `src/data/utils.ts`.

## What changed

### New type: `DataMode`

Added to `src/data/types.ts`. A discriminated union that makes the illegal state
(`quickLookMode: true` with no `qcJob`) unrepresentable at the type level:

```ts
type DataMode =
    | { quickLookMode: false; qcJob?: null }
    | { quickLookMode: true; qcJob: number }

const LIVE_DATA_MODE: DataMode = { quickLookMode: false }
```

### `getDataUrl` and `getData` — now pure

Both functions accept `mode` as an explicit tail parameter. The store import is gone:

```ts
// Before
export const getDataUrl = (options: GetDataOptions, start: number, end?: number) => {
    const job = store.getState().quicklook.qcJob          // hidden dep
    const quicklookMode = store.getState().config.quickLookMode  // hidden dep
    ...
}

// After
export const getDataUrl = (
    options: GetDataOptions,
    start: number,
    end?: number,
    mode: DataMode = LIVE_DATA_MODE   // explicit, defaulted to live
) => {
    const { quickLookMode, qcJob } = mode as { quickLookMode: boolean, qcJob: number | null | undefined }
    ...
}
```

The `LIVE_DATA_MODE` default preserves backward compatibility — callers that are
always in live mode (gauges, pitch/roll/heading indicators) require no changes.

### `usePollingData` — mode threaded via ref

Added `mode?: DataMode` as an optional third parameter, stored in a ref alongside
`optionsRef` so the polling loop always uses the latest value without restarting
the effect:

```ts
export const usePollingData = (
    options: GetDataOptions,
    intervalMs: number = 1000,
    mode: DataMode = LIVE_DATA_MODE
)
```

### `startData` — mode passed through recursion

`StartDataExtendedArgs` gained a required `mode: DataMode` field. `startData`
forwards it to `getDataUrl` and includes it in the `callOpts` spread so every
recursive call carries the same mode:

```ts
const callOpts = { options, callback, onTimestamp, ref, signal, mode }
// ...
setTimeout(() => { startData({ ...callOpts, start: newStart }) }, 1000)
```

### Duplicate `getData` deleted from `src/plot/utils.ts`

The private copy (previously lines 442–453) was identical to the exported version
in `src/data/utils.ts`. It has been removed along with its now-unused imports
(`GetDataOptions`, `DecadesDataResponse`, `nowSecs`, `LIVE_DATA_MODE`).

### Hook callers — mode constructed and passed down

Each hook that calls `getData` directly already had Redux access. The pattern used
across all affected hooks:

```ts
const quickLookMode = useSelector(state => state.config.quickLookMode)
const qcJob = useSelector(state => state.quicklook.qcJob)

const mode: DataMode = quickLookMode && qcJob !== null
    ? { quickLookMode: true, qcJob }
    : LIVE_DATA_MODE
```

Hooks where `qcJob` was not previously selected had the selector added.

## Files changed

| File | Change |
|------|--------|
| `src/data/types.ts` | Added `DataMode` type and `LIVE_DATA_MODE` constant |
| `src/data/utils.ts` | Removed store import; added `mode` param to `getDataUrl` and `getData` |
| `src/data/hooks.ts` | Added `mode` param to `usePollingData`; stored in ref |
| `src/plot/utils.ts` | Added `mode` to `StartDataExtendedArgs`; threaded through `startData`; deleted duplicate `getData`; cleaned unused imports |
| `src/plot/hooks.ts` | Added `qcJob` selector; constructs `mode`; passes to `startData` |
| `src/tephigram/hooks.ts` | Added `qcJob` selector inside `useTephigram`; passes `mode` to `getData` and `usePollingData` |
| `src/map/hooks.ts` | Added `DataMode` import; added `qcJob` selector in `useQuickLookAircraftData`; passes `mode` to quicklook `getData` call |
| `src/timeframe/hooks.ts` | Added `DataMode` import; constructs `mode` from existing selectors; passes to `getData` |
| `src/data/tests/utils.test.ts` | Deleted `vi.mock('@store')` block; tests now pass `mode` inline |
| `src/plot/tests/startData.test.ts` | Added `mode: LIVE_DATA_MODE` to `makeArgs` |

### Callers with no changes required

These hooks call `usePollingData` in live-only contexts and rely on the
`LIVE_DATA_MODE` default:

- `src/gauges/hooks.ts`
- `src/dashboard/hooks.ts`
- `src/heading-indicator/hooks.ts`
- `src/pitch-indicator/hooks.ts`
- `src/roll-indicator/hooks.ts`

The two `getData` calls in `useAircraftData` (`src/map/hooks.ts` lines ~72 and
~145) are also live-only — the hook returns early if `quickLookMode` is true —
so they rely on the default too.

## QA plan

### Automated

Run the full test suite and confirm 0 TypeScript errors and 227 tests passing:

```sh
npx vitest run
```

Key test files exercising the changed code:

- `src/data/tests/utils.test.ts` — `getDataUrl` URL construction in both live
  and quicklook modes; no store mock required
- `src/data/tests/hooks.test.ts` — `usePollingData` polling behaviour
- `src/plot/tests/startData.test.ts` — `startData` recursive fetch loop

### Manual — live mode

1. Start the dev server against a live decades server.
2. Open a plot with one or more parameters. Confirm data loads and updates in
   real time.
3. Open the tephigram view. Confirm it initialises with historical data and
   updates as new data arrives.
4. Open the map view. Confirm the aircraft track initialises and updates.
5. Open the timeframe chart. Confirm altitude data loads.
6. Open a gauge. Confirm it polls and displays current values.

### Manual — quicklook mode

1. Switch to quicklook mode by selecting a QC job.
2. Open a plot. Confirm the request goes to the quicklook endpoint
   (`/decades/api/v2/data/qc/`) and includes a `job=<id>` query parameter.
   Verify in the browser network tab.
3. Open the tephigram view. Confirm the initial data load uses the quicklook
   endpoint.
4. Open the map view in quicklook mode. Confirm the aircraft track uses the
   quicklook endpoint.
5. Confirm the timeframe chart loads altitude data from the quicklook endpoint.

### Network tab verification

For any quicklook data request, the URL should match:

```
/decades/api/v2/data/qc/?job=<N>&frm=<start>&to=<end>&para=<param>...
```

For any live data request:

```
http://<server>/decades/api/v2/data/?frm=<start>&para=<param>...
```

### Regression checks

- Toggle between live and quicklook mode mid-session. Confirm plots, tephigram,
  and map all switch endpoints correctly.
- Reload the page in quicklook mode. Confirm the job ID is re-read from Redux
  (restored from URL/session) and the correct endpoint is used on first fetch.
- Confirm no `store.getState` calls remain in `src/data/utils.ts`:

```sh
grep -n "store.getState" src/data/utils.ts
# should return nothing
```
