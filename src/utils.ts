export const onLuxe = () => {
    return window.location.hostname.startsWith('192.168')
}

export const capitalize = (s: string) => (s && s[0].toUpperCase() + s.slice(1)) || ""

export const nullNaN = (x: number) => isNaN(x) ? null : x

/**
 * A wrapper around localStorage that allows for setting an expiry time for items.
 * 
 */
export const localStorageWithExpiry = {

    /**
     * Set an item in localStorage with an expiry time.
     * 
     * @param key - the key of the item
     * @param value - the value of the item
     * @param ttl - the time to live of the item in milliseconds
     */
    set: (key: string, value: any, ttl: number) => {
        const now = new Date()
        const item = {
            value: value,
            expiry: now.getTime() + ttl
        }
        localStorage.setItem(key, JSON.stringify(item))
    },

    /**
     * Retrieve an item from localStorage. If the item has expired, remove it 
     * and return null.
     * 
     * @param key - the key of the item
     * @returns the value of the item
     */
    get: (key: string) => {
        const itemStr = localStorage.getItem(key)
        if (!itemStr) {
            return null
        }
        const item = JSON.parse(itemStr)
        const now = new Date()
        if (now.getTime() > item.expiry) {
            localStorage.removeItem(key)
            return null
        }
        return item.value
    }
}

/**
 * Get an environment variable as a boolean. If the variable is not set, 
 * return the default value.
 * 
 * @param key - the key of the environment variable
 * @param defaultValue - the default value to return if the variable is not set
 * @returns the value of the environment variable as a boolean
 */
export const booleanEnv = (key: string, defaultValue: boolean) => {
    if (import.meta.env[key] === undefined) {
        return defaultValue
    }
    return import.meta.env[key] === "true"
}

/**
 * Get an environment variable as a number. If the variable is not set,
 * return the default value.
 * 
 * @param key - the key of the environment variable
 * @param defaultValue - the default value to return if the variable is not set
 * @returns the value of the environment variable as a number
 * @throws an error if the value is not a number
 */
export const numberEnv = (key: string, defaultValue: number) => {
    if (import.meta.env[key] === undefined) {
        return defaultValue
    }

    const value = Number(import.meta.env[key])
    if (isNaN(value)) {
        throw new Error(`Environment variable ${key} is not a number`)
    }
    return value
 
}
