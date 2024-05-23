import React from 'react';

type Props = {
    show: boolean;
    children: React.ReactNode;
};

const BleedingEdge = ({ show, children }: Props) => {
    return show ? <>{children}</> : null;
};

export { BleedingEdge }
