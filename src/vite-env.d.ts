/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_VISTA_DEPLOYMENT_MODE: "demo" | "dev" | "prod"
    readonly VITE_VISTA_BASE_URL: string | undefined
    readonly VITE_VISTA_USE_WEBSOCKET_DATA: string | undefined
    readonly VITE_VISTA_ENABLE_TUTORIAL: string | undefined
    readonly VITE_VISTA_BAD_DATA: string | undefined

    // Experimental features
    readonly VITE_VISTA_ENABLE_QUICKLOOK: string | undefined
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}