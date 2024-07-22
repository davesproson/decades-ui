import { ParameterTable } from './parameter-table';
import { ParameterFilter } from './parameter-filter';
import { memo, useEffect } from 'react';
import { setParamSet } from '@/redux/parametersSlice';
import { useDispatch, useSelector } from '@/redux/store';
import { useDispatchParameters } from '@/hooks';
import Loader from '@/components/loader';

const ParameterPage = memo(() => {
    
    const dispatch = useDispatch()
    useDispatchParameters()
    const dispatchDone = useSelector((state) => state.vars.paramsDispatched)

    useEffect(() => {
        const url = new URL(window.location.href)
        const paramSet = url.searchParams.get('paramset')
        if(paramSet) dispatch(setParamSet(paramSet))
    }, [window.location.href])
        
    if (!dispatchDone) {
        return (
            <div className="fixed inset-0 flex justify-center items-center">
                <Loader />
            </div>
        )
    }

    return (
        <>
            <ParameterFilter />
            <ParameterTable />
        </>
    )
})

export { ParameterPage }