import { useState, useImperativeHandle, forwardRef, useRef, useEffect } from "react"
import { GroupedField, FieldInput, Input } from "../../components/forms"
import { ConfigHandle, ConfigWidgetProps, RegistryType, WidgetConfiguration } from "./widgets.types"
import { useWidgets } from "./register"

//...for data returned from the view config area
type ConfigViewData = {
    rows: number,
    cols: number,
    rowPc: number[],
    colPc: number[],
    valid: boolean
}

const ConfigViewArea = forwardRef<ConfigHandle<ConfigViewData>, {}>((_props, ref) => {

    const [rows, setRows] = useState("")
    const [cols, setCols] = useState("")
    const [rowPc, setRowPc] = useState("")
    const [colPc, setColPc] = useState("")

    // Return the data to the parent, with an indication of whether the data
    // are valid
    useImperativeHandle(ref, () => {
        return {
            getData: () => {
                return {
                    rows: parseInt(rows),
                    cols: parseInt(cols),
                    rowPc: rowPc.split(",").map(parseFloat),
                    colPc: colPc.split(",").map(parseFloat),
                    valid: validate()
                }
            }
        }
    }, [rows, cols, rowPc, colPc])

    // Validate the form data
    const validate = () => {
        if (rowPc === "") {
            let _rows = parseFloat(rows)
            setRowPc(new Array(_rows).fill((100 / _rows).toString()).join(","))
        }

        if (colPc === "") {
            let _cols = parseFloat(cols)
            setColPc(new Array(_cols).fill((100 / _cols).toString()).join(","))
        }

        if (rows === "" || cols === "") {
            return false
        }
        if (rowPc.split(",").map(x => parseFloat(x)).reduce((a, b) => a + b) !== 100) {
            return false
        }
        if (rowPc.split(",").length !== parseFloat(rows)) {
            return false
        }
        if (colPc.split(",").map(x => parseFloat(x)).reduce((a, b) => a + b) !== 100) {
            return false
        }
        if (colPc.split(",").length !== parseFloat(cols)) {
            return false
        }
        return true
    }

    // Validate the numver of row and columns - these must be positive integers
    const valPosInt = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
        let val
        val = parseFloat(e.target.value)
        if (val < 1) {
            val = 1
        }
        setter(val.toString())
    }

    // Validate the row and column percentages - these must be comma separated
    // numbers which add up to 100
    const setter = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
        let val = e.target.value
        setter(val)
        // validate()
    }

    return (
        <>
            <GroupedField>
                <Input type="number" placeholder="Number of rows" value={rows} onChange={(e: React.ChangeEvent<HTMLInputElement>) => valPosInt(e, setRows)} />
                <Input type="number" placeholder="Number of columns" value={cols} onChange={(e: React.ChangeEvent<HTMLInputElement>) => valPosInt(e, setCols)} />
            </GroupedField>
            <FieldInput type="text" placeholder="Row percentages (comma sep.)" value={rowPc} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setter(e, setRowPc)} />
            <FieldInput type="text" placeholder="Column percentages (comma sep.)" value={colPc} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setter(e, setColPc)} />
        </>
    )
})

interface ViewProps {
    title?: string,
    rowPercent: number[],
    columnPercent: number[],
    elements: any[],
    top: boolean
}
const _View = (props: ViewProps) => {

    useEffect(()=>{
        if(!props.top) return
        document.title = props.title || 'DECADES View'
    }, [])

    const register = useWidgets()

    const elements = props.elements

    const getRowColFrac = (i: 'rowPercent' | 'columnPercent'): string => {
        const theMax = props[i].reduce((a, b) => Math.max(a, b))
        try {
            return props[i].map(x=>`${x/theMax}fr`).join(" ")
        } catch (e) {
            return "1fr"
        }
    }

    const style = {
        display: "grid",
        gridTemplateRows: getRowColFrac("rowPercent"),
        gridTemplateColumns: getRowColFrac("columnPercent"),
        width: props.top ? "100vw" : undefined, 
        height: props.top ? "100vh" : undefined 
    }

    return (
        
        <div style={style}>
            {elements.map((element, i) => {
                const Element = register.getWidget(element.type).component
                return (
                    <div key={i} style={{display: "grid", position: "relative"}}>
                        <Element  {...element} />
                    </div>
                )
            })}
        </div>
        
    )

}

const useViewWidget = (registry: RegistryType<WidgetConfiguration>) => {
    const ref = useRef<ConfigHandle<ConfigViewData>>(null)
    registry.register({
        name: "View",
        type: "view",
        configComponent: <ConfigViewArea ref={ref} />,
        save: (props: ConfigWidgetProps) => {
            const data = ref.current?.getData()
            if (data === undefined) { return false }
            if (!data.valid) {
                console.error("Invalid view configuration")
                return false
            }
            props.split(data.rows, data.cols, data.rowPc, data.colPc)
            return true
        },
        icon: '',
        tooltip: 'Configure the view layout for this area',
        component: _View
    })
}

export { useViewWidget, _View }