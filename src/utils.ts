export const onLuxe = () => {
    return window.location.hostname.startsWith('192.168')
}

export const capitalize = (s: string) => (s && s[0].toUpperCase() + s.slice(1)) || ""

export const nullNaN = (x: number) => isNaN(x) ? null : x

export const localStorageWithExpiry = {
    set: (key: string, value: any, ttl: number) => {
        const now = new Date()
        const item = {
            value: value,
            expiry: now.getTime() + ttl
        }
        localStorage.setItem(key, JSON.stringify(item))
    },
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
