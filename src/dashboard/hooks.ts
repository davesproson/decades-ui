import { useSelector } from '../redux/store'
import { useEffect, useState } from 'react'
import { base as siteBase } from '../settings'
import { getData } from '../plot/plotUtils';
import { DashboardOptions } from './dashboard.types';
import { DecadesDataResponse } from '../plot/plot.types';
import { useLocalStorage } from 'usehooks-ts';

const useDashboardUrl = () => {
    const params = useSelector(state => state.vars.params);
    const options = useSelector(state => state.options);
    const origin = window.location.origin
    const selectedParams = params.filter(param => param.selected)
                                    .map(param => param.raw)
    const server = options.server
    const useNewDashboard = useLocalStorage<boolean>('useNewDashboard', false)[0]

    const dashboard = useNewDashboard ? 'redash' : 'dashboard'
    return origin + `${siteBase}${dashboard}?params=${selectedParams.join(',')}&server=${server}`
}

const useDashboardData = (dataOptions: DashboardOptions) => {
    const [data, setData] = useState<DecadesDataResponse>()

    useEffect(() => {
        getData(dataOptions).then(data => setData(data))
                            .catch(() => setData({'utc_time': []}))
                            
        const interval = setInterval(() => {
            if(!(document.visibilityState === "visible")) return
            getData(dataOptions).then(data => setData(data))
                                .catch(() => setData({'utc_time': []}))
        }, 1000)
        return () => clearInterval(interval)
    }, [setData])

    return data
}

export { useDashboardUrl, useDashboardData }