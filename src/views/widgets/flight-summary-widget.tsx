import type { WidgetConfiguration, ConfigWidgetProps } from "./types"
import FlightSummary from "@/flight-summary/flight-summary"
import flightSummaryIcon from "@/assets/view-icons/flight-summary.svg"

const FltSumConfig = () => {
    return (
        <div className="mt-2">
            Add a table showing the current flight summary
        </div>
    )
}

export const flightSummaryWidgetConfig: WidgetConfiguration = {
    name: "Flight Summary",
    type: "flight-summary",
    configComponent: <FltSumConfig />,
    save: (props: ConfigWidgetProps) => {
        props.setData({
            type: "flight-summary",
        })
        return true
    },
    icon: flightSummaryIcon,
    tooltip: 'Display the flight summary',
    component: () => <FlightSummary />
}
