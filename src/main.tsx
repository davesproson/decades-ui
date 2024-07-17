import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from "@/components/theme-provider"
import { Provider } from 'react-redux'
import { base } from './settings'
import store from './redux/store'
import { Toaster } from "@/components/ui/toaster"
import { RouterProvider, createRouter  } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import ChatProvider  from '@/chat/provider'

// Create a new router instance
const router = createRouter({ 
  routeTree, 
  basepath: base 
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ChatProvider>
        <ThemeProvider>
          <Toaster />
          <RouterProvider router={router} />
        </ThemeProvider>
      </ChatProvider>
    </Provider>
  </React.StrictMode>,
)
