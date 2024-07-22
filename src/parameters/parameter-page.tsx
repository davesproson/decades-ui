import { ParameterTable } from './parameter-table';
import { ParameterFilter } from './parameter-filter';
import { memo } from 'react';
import { ParameterDispatcher } from './parameter-dispatcher';

const ParameterPage = memo(() => {
        
    return (
        <ParameterDispatcher>
            <ParameterFilter />
            <ParameterTable />
        </ParameterDispatcher>
    )
})

export { ParameterPage }