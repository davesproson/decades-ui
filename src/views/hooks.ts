import { encode } from 'base-64';
import { useSelector } from '../redux/store'

const useViewUrl = () => {
    const ViewConfig = useSelector(s => s.view)
    const nRows = ViewConfig.nRows
    const nCols = ViewConfig.nCols
    const plots = ViewConfig.plots
    const encodedPlots = plots.map(x => encode(x))

    // TODO: Encode this URL properly
    let url = `/view?nRows=${nRows}&nCols=${nCols}`
    for (let eurl of encodedPlots) {
        url += `&plot=${eurl}`
    }

    return url
}

export { useViewUrl }