export const onLuxe = () => {
    return window.location.hostname.startsWith('192.168')
}

export const capitalize = (s: string) => (s && s[0].toUpperCase() + s.slice(1)) || ""

export const nullNaN = (x: number) => isNaN(x) ? null : x
