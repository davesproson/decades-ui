import { ParameterTable } from './parameter-table';
import { ParameterFilter } from './parameter-filter';
import { memo } from 'react';

const ParameterPage = memo(() => {
    return (
        <>
            <ParameterFilter />
            <ParameterTable />
        </>
    )
})

export { ParameterPage }