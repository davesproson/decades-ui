import React, { PropsWithChildren } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { AppStore, createStore } from '@/redux/store'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    store?: AppStore
}

export function renderWithStore(
    ui: React.ReactElement,
    extendedRenderOptions: ExtendedRenderOptions = {}
) {
    const {
        store = createStore(),
        ...renderOptions
    } = extendedRenderOptions

    const Wrapper = ({ children }: PropsWithChildren) => (
        <Provider store={store}>{children}</Provider>
    )

    return {
        store,
        ...render(ui, { wrapper: Wrapper, ...renderOptions })
    }
}