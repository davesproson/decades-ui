import { Tooltip } from 'react-tooltip'

export const VistaTooltip = (props: {id: string}) => {
    return <Tooltip id={props.id} className="has-text-light has-background-dark" />
}