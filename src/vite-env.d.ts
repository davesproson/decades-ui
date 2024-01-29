/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DEPLOYMENT_MODE: "demo" | "dev" | "prod"
    readonly VITE_BASE_URL: string | undefined
    readonly VITE_USE_WEBSOCKET_DATA: string | undefined
    readonly VITE_ENABLE_TUTORIAL: string | undefined
    readonly VITE_BAD_DATA: string | undefined
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}