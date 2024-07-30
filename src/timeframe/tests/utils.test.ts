import { describe, expect, it } from "vitest"
import { nowSecs } from "../utils"

describe('nowSecs should return the current time in seconds', () => {
    // TODO: This would probably be better with some mocking
    it('Should return a number', () => {
        expect(typeof nowSecs()).toBe('number')
    })
    it('Should return a number greater than 0', () => {
        expect(nowSecs()).toBeGreaterThan(0)
    })
    it('Should return a number less than 3000000000', () => {
        expect(nowSecs()).toBeLessThan(3000000000)
    })
})