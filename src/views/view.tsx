import { useSearchParams } from 'react-router-dom'
import { decode } from 'base-64';
import { base } from '../settings'

const View = () => {
    const [searchParams, _] = useSearchParams();
    const encodedUrls = searchParams.getAll('plot')
    const urls = encodedUrls.map(url => decode(url)).filter(x=>x!=="#").map(x=>{
        if (x.startsWith('http') || x.startsWith(base)) {
            return x
        }
        return `${base}${x}`
    })

    const nRowsString = searchParams.get('nRows') || urls.length.toString()
    const nRows = parseInt(nRowsString) || urls.length

    const nColsString = searchParams.get('nCols') || "1"
    const nCols = parseInt(nColsString) || 1

    return (
        <div style={{ top: 0, left: 0, width: '100%', height: '100%', position: 'absolute' }}>
            {urls.map((url, i) => {
                const opts = new URLSearchParams(url.split('?')[1])

                const viewWidth = parseFloat(
                    opts.get('viewWidth') || (100 / nCols).toString()
                )
                const viewHeight = parseFloat(
                    opts.get('viewHeight') || (100 / nRows).toString()
                )
                
                const width = `${(viewWidth) - 1 / nCols}%`
                const height = `${(viewHeight) - 1 / nRows}%`
                
                return (
                    <iframe key={i} src={url}  width={width} frameBorder="0" scrolling="no"
                        height={height} style={{border: "none", overflow: "hidden"}}/>
                )
            })}
        </div>
    )
}

export default View