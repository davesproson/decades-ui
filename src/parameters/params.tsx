
import { useDispatch, useSelector } from "../redux/store"
import { useDispatchParameters } from "../hooks"
import { toggleParamSelected } from "../redux/parametersSlice"
import { Loader } from "../components/loader"
import { FadeOut } from "../components/fadeout"
import { VistaError } from "../components/error"

import { Parameter } from "../redux/parametersSlice"
import { ParameterSearchInput } from "./filterBar"
import { Container } from "../components/container"
import { memo } from "react"

type ParameterLineProps = Omit<Parameter, "axisId" | "raw">

type ParameterInputProps = {
    name: string
    id: number | string
    selected: boolean
}
const ParameterInput = (props: ParameterInputProps) => {
    const dispatch = useDispatch()

    const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        dispatch(toggleParamSelected({
            id: props.id
        }))
    }

    const style = {
        background: "none",
        cursor: "pointer",
        border: "none",
    }

    const classes = props.selected
        ? "has-text-light"
        : "has-text-dark"

    return (
        <button onClick={onClick} style={style} className={classes}>
            {props.name}
        </button>
    )
}

const ParameterLine = memo((props: ParameterLineProps) => {
    const dispatch = useDispatch()

    const toggleSelected = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
        const value = (e.target as HTMLTableRowElement).dataset?.data;

        if (value !== "is-status") {
            return dispatch(toggleParamSelected({
                id: props.id
            }))
        } else {
            console.log("TODO: Refresh parameter status.")
        }
    }

    const statusClass = props.status === true
        ? "has-background-success-light has-text-success "
        : props.status === false
            ? "has-background-danger-light has-text-danger"
            : "has-text-grey-lighter"

    const statusText = props.status === true
        ? "Available"
        : props.status === false
            ? "Unavailable"
            : "Loading..."

    const selectedClass = props.selected ? "has-background-dark has-text-light" : ""

    return (
        <tr className={selectedClass} onClick={(e) => toggleSelected(e)} style={{ "cursor": "pointer" }}>
            <td style={{ width: "0" }} className={statusClass} data-data="is-status">{statusText}</td>
            <td style={{ width: "0" }}>{props.id}</td>
            <td><ParameterInput name={props.name} id={props.id} selected={props.selected}/></td>
            <td>{props.units}</td>
        </tr>
    )
})

const ParameterTable = memo(() => {

    const vars = useSelector(state => state.vars)
    const filterText = useSelector(state => state.paramfilter)
    const server = useSelector(state => state.options.server)
    useDispatchParameters()

    const paramsChecked = vars.params.length && vars.params.every(x => x.status !== null)

    if (server === undefined) return <Loader text="Waiting for server availability..." />
    if (!paramsChecked) return <Loader text="Checking Parameter Availability..." />
    if (!vars.params) return <Loader text="Getting parameters..." />;
    if (server === null) return <VistaError message="Server is not available." error={null} />

    const rows = vars.params
        .filter(
            x => (x.name.toLowerCase().includes(filterText.filterText.toLowerCase())
                || x.id.toString().toLowerCase().includes(filterText.filterText.toLowerCase())))
        .sort((a, b) => parseFloat(a.id.toString()) - parseFloat(b.id.toString()))
        .map(param => <ParameterLine key={param.id}
            id={param.id}
            name={param.name}
            selected={param.selected}
            units={param.units}
            status={param.status} />)

    return (
        <FadeOut>
            <Container fixedNav>
                <ParameterSearchInput filterText={filterText.filterText} />
                <table className="table is-narrow is-hoverable is-fullwidth is-bordered is-striped" style={{ "margin": "auto" }}>
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Param #</th>
                            <th>Parameter</th>
                            <th>Units</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            </Container>
        </FadeOut>
    )
})

export default ParameterTable