import { describe, it, expect } from "vitest"
import { act, fireEvent, render } from "@testing-library/react"
import { ChatSwitch } from "../chat-enable"

describe('Test chat switch', async () => {

    it("Should render chat switch", async () => {
        const { getByText } = render(<ChatSwitch />)
        expect(getByText("Enable chat")).not.toBeNull()
        expect(getByText("Chat notify")).not.toBeNull()
    })

    it("Should toggle the chat when clicked", async () => {
        localStorage.clear()
        const { getByText } = render(<ChatSwitch />)
        const localStorageConfig = JSON.parse(localStorage.getItem("VistaChatConfig") || "{}")
        expect(localStorageConfig.chatEnabled).toBe(undefined)

        act(() => {
            fireEvent.click(getByText("Enable chat"))
        })

        const updatedConfig = JSON.parse(localStorage.getItem("VistaChatConfig") || "{}")
        expect(updatedConfig.chatActive).toBe(true)

        act(() => {
            fireEvent.click(getByText("Enable chat"))
        })

        const updatedConfig2 = JSON.parse(localStorage.getItem("VistaChatConfig") || "{}")
        expect(updatedConfig2.chatActive).toBe(false)
    })
})

describe('Test chat notify toggle', async () => {
    it("Should toggle the chat notify when clicked", async () => {
        localStorage.clear()
        const { getByText } = render(<ChatSwitch />)
        const localStorageConfig = JSON.parse(localStorage.getItem("VistaChatConfig") || "{}")
        expect(localStorageConfig.chatNotify).toBe(undefined)

        act(() => {
            fireEvent.click(getByText("Chat notify"))
        })

        const updatedConfig = JSON.parse(localStorage.getItem("VistaChatConfig") || "{}")
        expect(updatedConfig.chatNotify).toBe(true)

        act(() => {
            fireEvent.click(getByText("Chat notify"))
        })

        const updatedConfig2 = JSON.parse(localStorage.getItem("VistaChatConfig") || "{}")
        expect(updatedConfig2.chatNotify).toBe(false)
    })
})