import { useState } from 'react'
import { useSelector, useDispatch } from '../redux/store'
import {
    toggleSwapOrientation, toggleScrollingWindow, toggleDataHeader, togglePlotStyle,
    setOrdinateAxis
} from '../redux/optionsSlice';

import { LiveDataOnly } from '../quicklook';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { OptionBlock } from './utils'



const ParameterSelectorDropdown = () => {
    const [filterText, setFilterText] = useState('')
    const dispatch = useDispatch()
    const serverParams = useSelector(state => state.vars.params)
    const ordinateAxis = useSelector(state => state.options.ordinateAxis)

    if (!serverParams) return null

    const params = [{ name: 'Time', id: -1, raw: "utc_time", units: 's' }, ...serverParams]
    const filteredParams = params.filter(x => x.name.toLowerCase().includes(filterText.toLowerCase()))
    const options = filteredParams.map((p) =>
        <SelectItem key={p.id} value={p.raw}>{p.name} ({p.units})</SelectItem>
    )

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fp = params.filter(x => x.name.toLowerCase().includes(e.target.value.toLowerCase()))
        setFilterText(e.target.value)

        const dispatchVal = fp.length ? fp[0].raw : 'utc_time'
        dispatch(setOrdinateAxis(dispatchVal))
    }

    const onSelectChange = (e: string) => {
        dispatch(setOrdinateAxis(e))
    }

    return (
        <div className="flex flex-col sm:flex-row">
            <Input className="mr-2 w-[300px]" placeholder='filter...' value={filterText} onChange={onChange} />
            <Select value={ordinateAxis} onValueChange={onSelectChange}>
                <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Select ordinate axis..." />
                </SelectTrigger>
                <SelectContent >
                    {options}
                </SelectContent>
            </Select>
        </div >
    )
}


const PlotStyleSelector = () => {
    const plotStyle = useSelector(s => s.options.plotStyle)
    const dispatch = useDispatch()

    return (
        <div className='flex'>
            {plotStyle.options.map((opt, i) => {
                const cls = (i === 0) 
                    ? 'rounded-r-none' 
                    : (i === plotStyle.options.length - 1)
                        ? 'rounded-l-none' 
                        : 'rounded-none'

                return (
                    <Button key={i} className={cls + " mt-[-5px]"} size="sm" variant={opt===plotStyle.value?'default':'outline'} onClick={()=>dispatch(togglePlotStyle())}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </Button>
                )
            })}
        </div>
    )
}

const PlotOptions = () => {
    const swapToggleOn = useSelector(s => s.options.swapOrientation)
    const scrollingOn = useSelector(s => s.options.scrollingWindow)
    const dataHeaderOn = useSelector(s => s.options.dataHeader)
    const dispatch = useDispatch()

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Plot Options
                </CardTitle>
            </CardHeader>
            <CardContent>
                <OptionBlock title="Swap ordinate/coordinate orientation">
                    <Switch checked={swapToggleOn} onCheckedChange={() => dispatch(toggleSwapOrientation())} />
                </OptionBlock>

                <OptionBlock title="Plot Style">
                    <PlotStyleSelector />
                </OptionBlock>

                <LiveDataOnly >
                    <OptionBlock title="Scrolling Window">
                        <Switch checked={scrollingOn} onCheckedChange={() => dispatch(toggleScrollingWindow())} />
                    </OptionBlock>
                </LiveDataOnly>

                <LiveDataOnly>
                    <OptionBlock title="Data Header">
                        <Switch checked={dataHeaderOn} onCheckedChange={() => dispatch(toggleDataHeader())} />
                    </OptionBlock>
                </LiveDataOnly>

                <OptionBlock title="Ordinate Axis">
                    <ParameterSelectorDropdown />
                </OptionBlock>

            </CardContent>
        </Card>
    )
}

export { PlotOptions }