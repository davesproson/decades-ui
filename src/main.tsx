/**
 * This is the main entry point for the Decades Vista application, 
 * which is mounted to the root element of the document.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import DecadesVista from './vista'
import store from './redux/store'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { base } from './settings'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={base}>
        <DecadesVista />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
