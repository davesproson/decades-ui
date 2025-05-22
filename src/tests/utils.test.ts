import { describe, it, expect, afterAll, vi, Mock } from 'vitest'
import { capitalize, ddToDmm, feetToMetres, genId, getFlightNumber, localStorageWithExpiry, metresToFeet, msToKnots, nullNaN, onLuxe } from '@/utils'
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

describe('Gen ID produces equal length differnet strings', () => {
    it('should produce a string of length 10', () => {
        const id1 = genId()
        expect(id1.length).toBe(10)
    })
    it('should produce different strings', () => {
        const id1 = genId()
        const id2 = genId()
        expect(id1).not.toBe(id2)
    })
})

describe('onLuxe returns true for the 192.168.101.* domain', () => {
    const window = global.window

    it('should return true for whan host is 192.168.101.100', () => {
        global.window = new JSDOM(`<!DOCTYPE html>`, {
            url: 'http://192.168.101.100'
        }).window;
        expect(onLuxe()).toBe(true)
    })


    it('should return false for when host is localhost', () => {
        global.window = new JSDOM(`<!DOCTYPE html>`, {
            url: 'http://localhost'
        }).window;
        expect(onLuxe()).toBe(false)
    })


    it('should return false for when host is 96.1.4.2', () => {
        global.window = new JSDOM(`<!DOCTYPE html>`, {
            url: 'http://96.1.4.2'
        }).window;
        expect(onLuxe()).toBe(false)
    })

    afterAll(() => {
        global.window = window
    })
})

describe('capitalize capitalizes the first letter of a string', () => {
    it('should capitalize the first letter of a string', () => {
        expect(capitalize('hello')).toBe('Hello')
    })
    it('should return the same string if the first letter is already capitalized', () => {
        expect(capitalize('Hello')).toBe('Hello')
    })
    it('should return the same string if the first letter is a number', () => {
        expect(capitalize('1ello')).toBe('1ello')
    })
    it('should return the same string if the first letter is a symbol', () => {
        expect(capitalize('@ello')).toBe('@ello')
    })
    it('should not capitalize the first letter of the second word in a string', () => {
        expect(capitalize('hello world')).toBe('Hello world')
    })
    it('should return an empty string when given an empty string', () => {
        expect(capitalize('')).toBe('')
    })
})

describe('nullNaN returns null for NaN', () => {
    it('should return null for NaN', () => {
        expect(nullNaN(NaN)).toBe(null)
    })
    it('should return the number for a +ve number', () => {
        expect(nullNaN(1)).toBe(1)
    })
    it('should return 0', () => {
        expect(nullNaN(0)).toBe(0)
    })
    it('should return the number for a +ve number', () => {
        expect(nullNaN(-1)).toBe(-1)
    })
})

describe('ddToDmm converts decimal degrees to degrees minutes', () => {
    it('should convert 0 to 0° 0.0\' N', () => {
        expect(ddToDmm(0, ['N', 'S'])).toEqual({ coord: '0° 0.0\'', hemisphere: 'N' })
    })
    it('should convert 1 to 1° 0.0\' N', () => {
        expect(ddToDmm(1, ['N', 'S'])).toEqual({ coord: '1° 0.0\'', hemisphere: 'N' })
    })
    it('should convert -1 to 1° 0.0\' S', () => {
        expect(ddToDmm(-1, ['N', 'S'])).toEqual({ coord: '1° 0.0\'', hemisphere: 'S' })
    })
    it('should convert 1.5 to 1° 30.0\' N', () => {
        expect(ddToDmm(1.5, ['N', 'S'])).toEqual({ coord: '1° 30.0\'', hemisphere: 'N' })
    })
    it('should convert -1.75 to 1° 45.0\' S', () => {
        expect(ddToDmm(-1.75, ['N', 'S'])).toEqual({ coord: '1° 45.0\'', hemisphere: 'S' })
    })
})

describe('metresToFeet converts metres to feet', () => {
    it('should convert 0 to 0', () => {
        expect(metresToFeet(0)).toBe(0)
    })
    it('should convert 1 to 3.28084', () => {
        expect(metresToFeet(1)).toBeCloseTo(3.28084)
    })
    it('should convert 100 to 328.084', () => {
        expect(metresToFeet(100)).toBeCloseTo(328.084)
    })
})

describe('feetToMetres converts feet to metres', () => {
    it('should convert 0 to 0', () => {
        expect(feetToMetres(0)).toBe(0)
    })
    it('should convert 3.28084 to 1', () => {
        expect(feetToMetres(3.28084)).toBeCloseTo(1)
    })
    it('should convert 328.084 to 100', () => {
        expect(feetToMetres(328.084)).toBeCloseTo(100)
    })
})

describe('msToKnots converts metres per second to knots', () => {
    it('should convert 0 to 0', () => {
        expect(msToKnots(0)).toBe(0)
    })
    it('should convert 1 to 1.94384', () => {
        expect(msToKnots(1)).toBeCloseTo(1.94384)
    })
    it('should convert 100 to 194.384', () => {
        expect(msToKnots(100)).toBeCloseTo(194.384)
    })
})

describe('localStorageWithExpiry', () => {
    const window = global.window
    const localStorage = global.localStorage

    it('should set an item in localStorage with an expiry time', () => {
        const now = new Date()
        const ttl = 1000
        const key = 'key'
        const value = 'value'
        const item = {
            value: value,
            expiry: now.getTime() + ttl
        }
        localStorageWithExpiry.set(key, value, ttl)
        expect(localStorage.getItem(key)).toBe(JSON.stringify(item))
    })

    it('should retrieve an item from localStorage', () => {
        const key = 'key'
        const value = 'value'
        const item = {
            value: value,
            expiry: new Date().getTime() + 1000
        }
        localStorage.setItem(key, JSON.stringify(item))
        expect(localStorageWithExpiry.get(key)).toBe(value)
    })

    it('should return null for an item that has expired', () => {
        const key = 'key'
        const value = 'value'
        const item = {
            value: value,
            expiry: new Date().getTime() - 1000
        }
        localStorage.setItem(key, JSON.stringify(item))
        expect(localStorageWithExpiry.get(key)).toBe(null)
    })

    afterAll(() => {
        global.window = window
        global.localStorage = localStorage
    })
})

describe('getFlightNumber fetches and returns the flight number', async () => {
    global.fetch = vi.fn(() => {
        return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ flight_number: 'C234' })
        })
    }) as Mock
    it('should return the flight number', async () => {
        const flightNumber = await getFlightNumber()
        expect(flightNumber).toBe('C234')
    })
})    
