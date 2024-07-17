import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TimePicker } from "./timepicker"
import { useSelector, useDispatch } from "@store"
import { setCustomTimeframe } from "@/redux/optionsSlice"
import { QuicklookOnly } from "@/quicklook"
import { Button } from "@/components/ui/button"

const TimeframeSelectCard = () => {
  const quicklookMode = useSelector(state => state.config.quickLookMode)
  const dataTimeSpan = useSelector(state => state.quicklook.dataTimeSpan)
  const dispatch = useDispatch()

  const resetTimeframe = () => {
    if (!quicklookMode) return
    if (!dataTimeSpan) return
    dispatch(setCustomTimeframe(dataTimeSpan))
  }

  return (
    <Card className="mt-2">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:justify-between">
          Select a timeframe
          <QuicklookOnly>
            <Button onClick={resetTimeframe}>Reset to entire dataset</Button>
          </QuicklookOnly>
        </CardTitle>
      </CardHeader>
      <div className="flex flex-col md:flex-row md:justify-between">
        <CardContent className="flex-grow w-[50%]">
          <TimePicker title="Start Time" boundary="start" />
        </CardContent>
        <CardContent className="flex-grow w-[50%]">
          <TimePicker title="End Time" allowOngoing={true && !quicklookMode} boundary="end" />
        </CardContent>
      </div>
    </Card>
  )
}

export { TimeframeSelectCard }