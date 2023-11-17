import PropTypes, { InferProps } from "prop-types";

import { panels } from "./panels"
import { useTutorialAction } from "./hooks"
import { setShowTutorial, incrementPosition } from "../redux/tutorialSlice"
import { useNavigate } from "react-router-dom"
import { enableTutorial } from "../settings"
import { Button } from "../components/buttons"
import { useSelector, useDispatch } from "../redux/store"

const TutorialPanelPropTypes = {
    key: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    continueText: PropTypes.string,
    abortText: PropTypes.string,
    hideContinue: PropTypes.bool,
    nextRoute: PropTypes.string,
    next: PropTypes.func,
    abort: PropTypes.func,
    action: PropTypes.func,
    clear: PropTypes.arrayOf(PropTypes.func),
    dispatch: PropTypes.arrayOf(PropTypes.func),
}

type TutorialPanelProps = InferProps<typeof TutorialPanelPropTypes>


/**
 * The TutorialPanel is the actual UI for the tutorial. It is responsible for rendering
 * the text and buttons for the panel.
 * 
 * @param {Object} props
 * @param {string} props.title - The title of the panel
 * @param {string} props.text - The text of the panel
 * @param {string} props.continueText - The text for the continue button
 * @param {string} props.abortText - The text for the abort button
 * @param {boolean} props.hideContinue - Whether to hide the continue button
 * @param {string} props.nextRoute - The route to navigate to when the continue button is clicked
 * @param {function} props.next - The function to call when the continue button is clicked
 * @param {function} props.abort - The function to call when the abort button is clicked
 * @param {function} props.action - The action to run when the panel is shown
 * @param {Array<function>} props.clear - The actions to dispatch when the panel is hidden
 * @param {Array<function>} props.dispatch - The actions to dispatch when the panel is shown
 * 
 * @component
 * @example
 * const title = "My Panel"
 * const text = "This is my panel"
 * return (
 * <TutorialPanel title={title} text={text} />
 * )
 */
const TutorialPanel = (props: TutorialPanelProps) => {
    useTutorialAction(props.action, props.dispatch, props.clear)
    const navigate = useNavigate()
    const onContinue = () => {
        if(props.nextRoute) {
            navigate(props.nextRoute)
        }
        props.next && props.next()
    }

    const continueButton = props.hideContinue
        ? null
        : <Button.Success onClick={onContinue}>{props.continueText || "Continue"}</Button.Success>

    if(!props.abort) {
        props.abort = () => {}
    }

    return (
        <div style={{
            position: "fixed",
            bottom: "0px",
            left: "0px",
            width: "100%",
            height: "300px",
            zIndex: 1000,
            backgroundColor: "rgba(0,0,0,0.85)",
            color: "white",
            overflowY: "auto",
        }}>
            <div className="container ">
                <div className="section">
                    <h6 className="title has-text-white">{props.title}</h6>
                    {props.text}
                    <div className="mt-4">
                    {continueButton}
                    <span style={{marginRight: ".3em"}}></span>
                    <Button.Danger onClick={props.abort}>{props.abortText || "Close"}</Button.Danger>
                    </div>
                </div>
            </div>
        </div>
    )
}
TutorialPanel.propTypes = TutorialPanelPropTypes

const TutorialDispatcherProptypes = {
    position: PropTypes.number.isRequired,
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
}
type TutorialDispatcherProps = InferProps<typeof TutorialDispatcherProptypes>
/**
 * A dispatcher for the tutorial panels. Bit of a legacy thing, from when TutorialPanels
 * were specified explicitly in the JSX. Now they are specified in the panels array.
 * 
 * @param {Object} props
 * @param {number} props.position - The index of the panel to show
 * @param {Object} props.children - The children to render
 * 
 * @component
 * @example
 * const position = 0
 * return (
 * <TutorialDispatcher position={position}>
 *    <TutorialPanel title="Panel 1" text="This is the first panel" />
 *    <TutorialPanel title="Panel 2" text="This is the second panel" />
 * </TutorialDispatcher>
 * )
 */
const TutorialDispatcher = (props: TutorialDispatcherProps) => {
    const child = props.children[props.position]
    return <>{child}</>
}
TutorialDispatcher.propTypes = TutorialDispatcherProptypes

/**
 * The tutorial component. This is the main component for the tutorial. It is responsible
 * for rendering the tutorial panels, and for dispatching the actions that are specified
 * in the panels array.
 * 
 * @component
 * @example
 * return (
 * <Tutorial />
 * )
 */
const Tutorial = () => {
    const position = useSelector(s => s.tutorial.position)
    const show = useSelector(s => s.tutorial.show)
    const dispatch = useDispatch()

    if(!enableTutorial) return null
    if(!show) return null

    const tutorialSeen = JSON.parse(
        window.sessionStorage.getItem("showTutorial") || "false"
    ) as boolean
    if(tutorialSeen === false) {
       return null
    } 

    return (
        <TutorialDispatcher position={position}>
            {panels.map((panel, i) => {
                return (
                    <TutorialPanel 
                        key={i} 
                        next={()=>dispatch(incrementPosition())}
                        abort={()=>dispatch(setShowTutorial(false))}
                        {...panel}  
                    />
                )
            })}
        </TutorialDispatcher>
    )
}

export default Tutorial

