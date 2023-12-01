import { useState } from 'react'
import { useSelector, useDispatch } from '../redux/store'
import { 
    toggleSwapOrientation, toggleScrollingWindow, toggleDataHeader, togglePlotStyle,
    setServer, setOrdinateAxis
} from '../redux/optionsSlice';
import { useServers } from '../hooks'

import OptionSwitch from '../components/optionSwitch';
import ToggleSwitch from '../components/toggleSwitch';

interface OptionBlockProps {
    flexDirection?: 'row' | 'column'
    title?: string
    optionComponent?: JSX.Element
    children?: JSX.Element | JSX.Element[]
}
const OptionBlock = (props: OptionBlockProps) => {

    const flexDirectionClass = props.flexDirection 
        ? props.flexDirection == 'column'
            ? 'is-flex-direction-column'
            : 'is-flex-direction-row'
        : 'is-flex-direction-row'

    const classOpts = "is-flex is-justify-content-space-between " + flexDirectionClass
    const styleOpts = {
        padding: "0.8em",
        border: "1px solid #dddddd"
    }

    const titleElem = props.title ? <span className="mt-2">{props.title}</span> : null

    return (
        <div className={classOpts} style={styleOpts}>
            {titleElem}
            {props.optionComponent || props.children}
        </div>
    )
}

const ParameterSelectorDropdown = () => {
    const [filterText, setFilterText] = useState('')
    const dispatch = useDispatch()
    const serverParams = useSelector(state => state.vars.params)
    const ordinateAxis = useSelector(state => state.options.ordinateAxis)

    if(!serverParams) return null

    const params = [{name: 'Time', id: -1, raw: "utc_time", units: 's'}, ...serverParams]
    const filteredParams = params.filter(x=>x.name.toLowerCase().includes(filterText.toLowerCase()))
    const options = filteredParams.map(p=>
            <option key={p.id} value={p.raw}>{p.name} ({p.units})</option>
        )

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fp = params.filter(x=>x.name.toLowerCase().includes(e.target.value.toLowerCase()))
        setFilterText(e.target.value)

        const dispatchVal = fp.length ? fp[0].raw : 'utc_time'
        dispatch(setOrdinateAxis(dispatchVal))
    }

    const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setOrdinateAxis(e.target.value))
    }

    return (
        <div className="field has-addons">
            <div className="control">
                <input className="input" placeholder='filter...' value={filterText} onChange={onChange}/>
            </div>
            <div className="control">
                <div className="select">
                    <select onChange={onSelectChange} value={ordinateAxis} style={{minWidth: "400px"}}>
                        {options}
                    </select>
                </div>
            </div>
        </div>
    )
}

const ServerSelectorDropDown = () => {

    const servers = useServers()
    const server = useSelector(state => state.options.server)
    const dispatch = useDispatch()

    const options = servers.map(s=>{
        return <option key={s} value={s}>{s}</option>
    })

    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setServer(e.target.value))
    }

    return (
        <div className="select">
            <select value={server} onChange={onChange}>
                {options}
            </select>
        </div>
    )
}

const PlotOptionCard = () => {

    const swapToggleOn = useSelector(s=>s.options.swapOrientation)
    const scrollingOn = useSelector(s=>s.options.scrollingWindow)
    const dataHeaderOn = useSelector(s=>s.options.dataHeader)
    const plotStyle = useSelector(s=>s.options.plotStyle)

    const ordinateSwapToggleSwitch = <ToggleSwitch on={swapToggleOn} toggle={toggleSwapOrientation}/>
    const plotStyleToggleSwitch = <OptionSwitch options={plotStyle.options} value={plotStyle.value} toggle={togglePlotStyle} />
    const scrollingWindowToggleSwitch = <ToggleSwitch on={scrollingOn} toggle={toggleScrollingWindow} />
    const dataHeaderToggleSwitch = <ToggleSwitch on={dataHeaderOn} toggle={toggleDataHeader} />
    const paramSelector = <ParameterSelectorDropdown />
    const serverSelector = <ServerSelectorDropDown />

    return (
        <nav className="panel mt-4 is-dark">
            <p className="panel-heading">
                
                Plot options
            </p>
            <div className="p-4">
            <OptionBlock title="Swap ordinate/coordinate orientation" optionComponent={ordinateSwapToggleSwitch}/>
            <OptionBlock title="Plot Style" optionComponent={plotStyleToggleSwitch}/>
            <OptionBlock title="Scrolling Window" optionComponent={scrollingWindowToggleSwitch} />
            <OptionBlock title="Data Header" optionComponent={dataHeaderToggleSwitch} />
            <OptionBlock title="Ordinate Axis" optionComponent={paramSelector}/>
            <OptionBlock title="Server" optionComponent={serverSelector} />
            </div>
        </nav>
    )
}

export { PlotOptionCard, OptionBlock }