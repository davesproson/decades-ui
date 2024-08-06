import { createStore } from '@/redux/store'
import store from '@/redux/store'
import { Provider } from 'react-redux'
import {  beforeEach } from 'vitest'


export const setupTestStore = () => {
    const refObj = {} as {
        store: typeof store,
        Wrapper: { ({ children }: { children: React.ReactNode}): React.ReactNode }
    }

    beforeEach(() => {
        const _store = createStore()
        refObj.store = _store
        refObj.Wrapper = function Wrapper({ children }: { children: React.ReactNode }) {
            return <Provider store={store}>{children}</Provider>
        }
    })

    return refObj
}