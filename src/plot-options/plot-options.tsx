import { useState } from 'react'
import { useSelector, useDispatch } from '../redux/store'
import {
    toggleSwapOrientation, toggleScrollingWindow, toggleDataHeader, togglePlotStyle,
    setOrdinateAxis,
    setColorVariable,
    togglePlotMask
} from '../redux/optionsSlice';

import { LiveDataOnly, QuicklookOnly, Show } from '@/components/flow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { OptionBlock } from './utils'



const ParameterSelectorDropdown = ({
    dispatchFn,
    selector,
    placeholder,
    unselected
}: {
    dispatchFn: (e: any) => any,
    selector: (state: any) => any,
    unselected: { name: string, id: number, raw: string | null, units: string },
    placeholder?: string
}) => {

    const [filterText, setFilterText] = useState('')
    const dispatch = useDispatch()
    const serverParams = useSelector(state => state.vars.params)
    const selected = useSelector(selector)

    if (!serverParams) return null

    const params = [unselected, ...serverParams]
    const filteredParams = params.filter(x => x.name.toLowerCase().includes(filterText.toLowerCase()))
    const options = filteredParams.map((p) =>
        <SelectItem key={p.id} value={p.raw || "None"}>{p.name} ({p.units})</SelectItem>
    )

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fp = params.filter(x => x.name.toLowerCase().includes(e.target.value.toLowerCase()))
        setFilterText(e.target.value)

        const dispatchVal = fp.length ? fp[0].raw : unselected.raw
        dispatch(dispatchFn(dispatchVal))
    }

    const onSelectChange = (e: string) => {
        dispatch(dispatchFn(e))
    }

    return (
        <div className="flex flex-col sm:flex-row">
            <Input className="mr-2 w-[300px]" placeholder='filter...' value={filterText} onChange={onChange} />
            <Select value={selected} onValueChange={onSelectChange}>
                <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder={placeholder || ''} />
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
                    <Button key={i} className={cls + " mt-[-5px]"} size="sm" variant={opt === plotStyle.value ? 'default' : 'outline'} onClick={() => dispatch(togglePlotStyle())}>
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
    const maskData = useSelector(s => s.options.mask)
    const selectedParams = useSelector(s => s.vars.params).filter(p => p.selected)
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

                <QuicklookOnly>
                    <OptionBlock title="Mask flagged data">
                        <Switch checked={maskData} onCheckedChange={() => dispatch(togglePlotMask())} />
                    </OptionBlock>
                </QuicklookOnly>

                <OptionBlock title="Ordinate Axis">
                    <ParameterSelectorDropdown
                        dispatchFn={setOrdinateAxis}
                        selector={state => state.options.ordinateAxis}
                        unselected={{ name: 'Time', id: -1, raw: "utc_time", units: 's' }}
                        placeholder="Select ordinate axis..." />
                </OptionBlock>

                <Show when={selectedParams?.length === 1}>
                    <OptionBlock title="Colour by">
                        <ParameterSelectorDropdown
                            dispatchFn={(e) => e === 'None' ? setColorVariable(null) : setColorVariable(e)}
                            selector={state => state.options.colorVariable}
                            unselected={{ name: '[None]', id: -1, raw: null, units: '-' }}
                            placeholder="Select colour axis..." />
                    </OptionBlock>
                </Show>

            </CardContent>
        </Card>
    )
}

export { PlotOptions }