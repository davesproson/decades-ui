import { createContext, useContext, useEffect, useState } from 'react';
import { getData } from '../plot/plotUtils';
import { v4 as uuidv4 } from 'uuid';

type Data = Array<[number, number]>

class DECADESCache {
    data: { [key: string]: Data }
    // ticker: number
    params: Array<string> = []
    paramRefCounts: { [key: string]: number } = {}
    callbacks: [string, string, (data: any) => void][] = []
    constructor() {
        console.log('creating cache')
        this.data = {}
        this.start()
        
    }

    start = () => {
        setInterval(() => {
            if (!Object.keys(this.data)?.length) return

            const options = {
                from: new Date().getTime() - 2000,
                params: Object.keys(this.data)
            }

            getData(options).then(_data => {
                console.log('getdata', this.callbacks)
                for (const param of Object.keys(this.data)) {
                    _data[param].forEach((x, i) => {
                        if(!this.data[param]) this.data[param] = []
                        if(this.data[param].map(x => x[0]).includes(_data.utc_time[i])) return
                        this.data[param].push([_data.utc_time[i], x])

                        for (const [_, key, callback] of this.callbacks) {
                            if (key === param) {
                                callback({ 'utc_time': _data.utc_time[i], 'value': x } )
                            }
                        }
                    })
                }
            })
        }, 1000)
    }


    timeseries = async (key: string, from: number | null, to: number | null) => {
        let data = this.data[key]
        if (from != null) {
            data = data.filter(x => x[0] >= from)
        }
        if (to != null) {
            data = data.filter(x => x[0] <= to)
        }
        return {
            'utc_time': data.map(x => x[0]),
            [key]: data.map(x => x[1]),
        }
    }

    latest = (keys: string | string[]) => {
        
        if (!Array.isArray(keys)) {
            keys = [keys]
        }
        // return this.data
        // const _data: any = {}
        let data: { [key: string]: { 'utc_time': number, 'value': number } } = {}
        for (const k of keys) {
            try {
                var time = this.data[k][this.data[k].length - 1][0]
            } catch (e) {
                continue
            }
            try {
                var value = this.data[k][this.data[k].length - 1][1]
            } catch (e) {
                continue
            }
            data[k] = { 'utc_time': time, 'value': value }
        }

        return data
    }


    addParam = (param: string) => {
        if (this.params.includes(param)) {
            this.paramRefCounts[param] += 1
            return
        }
        
        console.log('adding param', param)
        this.data[param] = []
        this.paramRefCounts[param] = 1
    }

    removeParam = (param: string) => {
        if (!Object.keys(this.data).includes(param)) {
            console.error(`Param ${param} has not been registered`)
            return
        }

        this.paramRefCounts[param] -= 1
        if (this.paramRefCounts[param] === 0) {
            delete this.data[param]
            delete this.paramRefCounts[param]
        }
    }

    registerCallback = (param: string, callback: (data: any) => void) => {
        if (!Object.keys(this.data).includes(param)) {
            console.error(`Param ${param} has not been registered`)
            return
        }
        console.log('registering callback', param)
        console.log(this.callbacks)
        const uuid = uuidv4()
        this.callbacks.push([uuid, param, callback])
        return uuid
    }

    removeCallback = (uuid: string) => {
        this.callbacks = this.callbacks.filter(x => x[0] !== uuid)
        console.log('removing callback', uuid)
    }
}

// const DECADESContext = createContext<DECADESCache|null>(null)


const DECADESContext = createContext<any>(null);

const DECADESProvider = (props: { children: any }) => {
    const cache = new DECADESCache()

    return (
        <DECADESContext.Provider value={cache}>
            {props.children}
        </DECADESContext.Provider>
    );
}

const useDecades = (param: string) => {
    const decades = useContext(DECADESContext)
    const [data, setData] = useState<any>()
    const [callbacks, setCallbacks] = useState<any>([])

    useEffect(() => {
        // const callbacks: string[] = []
        decades.addParam(param)
        // callbacks.push(decades.registerCallback(param, (data: any) => {
        //     setData(data)
        // }))
        setCallbacks([...callbacks, decades.registerCallback(param, (data: any) => {
            setData(data)
        })])
        return () => {
            for (const callback of callbacks) {
                decades.removeCallback(callback)
            }
            decades.removeParam(param)
        }
}, [setData])
return data
}

const User = (props: any) => {

    const ndi = useDecades(props.name)
    const di = useDecades('deiced_true_air_temp_c')

    return (
        <div>
            {props.name} - {ndi?.value}<br/>
            di - {di?.value}<br/>
        </div>
    )
}

const Temp = () => {
    const [a, setA] = useState(true)
    const [b, setB] = useState(true)

    const ele1 = a ? <User name="nondeiced_true_air_temp_c" /> : null
    const ele2 = b ? <User name="nondeiced_true_air_temp_c" /> : null

    return (
        <DECADESProvider>
        <>
            {/* <User name="deiced_true_air_temp_c" /> */}
            {ele1}
            <button onClick={() => setA(!a)}>Toggle</button>
            <br />
            {ele2}
            <button onClick={() => setB(!b)}>Toggle</button>
            
</>
         </DECADESProvider>
    )
}

export default Temp








// const useDecadesReactor = (params: string[]) => {
//     const decades = useContext(DECADESContext)
//     const [data, setData] = useState<any>({})

//     let latest: any = {}
//     useEffect(() => {
//         const interval = setInterval(() => {
//             latest = decades.latest(params) 
//             // setData(latest)
//             // console.log('latest', latest)
//             // console.log('data', data)
 
//             console.log(latest)
//             let rerender = false
//             for (const param of params) {
//                 if (data?.[param]?.value === undefined) {
//                     rerender = true
//                     break
//                 }
//                 console.log(data)
//                 console.log('comparing', data[param].value, latest[param].value)
//                 // if (data[param].value !== latest[param].value) {
//                 //     rerender = true
//                 //     break
//                 // }
//             }

//             if (rerender) {
//                 console.log('rerendering', new Date().getTime())
//                 // console.log(latest)
//                 setData(latest)
//             }
//         }, 100)

//         return () => {
//             clearInterval(interval)
//             for (const param of params) {
//                 decades.removeParam(param)
//             }
//         }
//     }, [setData])

//     // useEffect(() => {
//         for (const param of params) {
//             decades.addParam(param)
//         }
//     // }, [])

//     return data
// }

// const User = (props: any) => {
//     const decades = useContext(DECADESContext)

//     const [data, setData] = useState<any>()
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setData(decades.latest(props.name))
//         }, 1000)
//         return () => clearInterval(interval)
//     }, [setData])

//     if(!data) return (<div>Loading...</div>)
//     return (
//         <div>
//             {props.name} - {data[props.name]?.value}
//             <button onClick={() => decades.addParam(props.name)}>Add</button>
//         </div>
//     )
// }