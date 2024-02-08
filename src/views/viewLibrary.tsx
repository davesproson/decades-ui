import { useDispatch, useSelector } from "../redux/store"
import PropTypes from "prop-types"
import { saveView } from "../redux/viewSlice"
import { libraryViews } from "./libraryEntries"
import { Button } from "../components/buttons"
import { FadeOut } from "../components/fadeout"
import { v4 as uuidv4 } from 'uuid'
import { Container } from "../components/container"

interface LoadedInfoProps {
    loaded: boolean,
    title: string,
}
/**
 * Provides an info box for a view that has been loaded, describing how to access it.
 * @param {Object} props
 * @param {boolean} props.loaded - Whether the view has been loaded
 * @param {string} props.title - The title of the view 
 * 
 * @component
 * @example
 * const loaded = true
 * const title = "My View"
 * return (
 * <LoadedInfo loaded={loaded} title={title} />
 * )
 */
const LoadedInfo = (props: LoadedInfoProps) => {
    if (!props.loaded) {
        return null
    }

    return (
        <article className="message is-success mb-2">
            <div className="message-body">
                This view has been made available. To access it, select
                <strong> {props.title}</strong> from the <strong>Views</strong> menu.
            </div>
        </article>
    )
}
LoadedInfo.propTypes = {
    loaded: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired
}

interface LibraryCardProps {
    title: string,
    description: string,
    config: any,
}
/**
 * Provides a card for a view that can be loaded.
 * 
 * @param {Object} props
 * @param {string} props.title - The title of the view
 * @param {string} props.description - A description of the view
 * @param {Object} props.config - The configuration for the view
 * 
 * @component
 * @example
 * const title = "My View"
 * const description = "A view that does something"
 * const config = { ... }
 * return (
 * <LibraryCard title={title} config={config} />
 * )
 */
const LibraryCard = (props: LibraryCardProps) => {
    const dispatch = useDispatch()
    const savedViews = useSelector(s => s.view.savedViews)

    const viewIsLoaded = savedViews.some(v => v.name === props.title)

    const load = () => {
        dispatch(saveView({ name: props.title, id: uuidv4(), title: props.title, ...props.config }))
    }

    const loadButtonText = viewIsLoaded ? "Loaded" : "Load"

    const button = (
        <Button.Primary outlined fullWidth onClick={load} disabled={viewIsLoaded}>
            {loadButtonText}
        </Button.Primary>
    )

    return (
        <FadeOut>
            <div className="card mt-2">
                <div className="card-content">
                    <div className="content">
                                
                        <h4 className="title is-4">{props.title}</h4>
                        <LoadedInfo loaded={viewIsLoaded} title={props.title} />
                        {viewIsLoaded ? null : props.description}
                        {viewIsLoaded ? null : <p style={{ marginTop: "1rem" }} />}
                        {viewIsLoaded ? null : button}
                    </div>
                </div>
            </div>
        </FadeOut>

    )
}
LibraryCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired
}

/**
 * Provides a page for the view library. The actual views are defined in libraryEntries.js.
 * 
 * @component
 * @example
 * return (
 * <ViewLibrary />
 * )
 */
const ViewLibrary = () => {
    const cards = libraryViews.map((view, i) => {
        return (
            <LibraryCard key={i}
                title={view.title}
                description={view.description || ""}
                config={view.config} />
        )
    })

    return (
        <Container fixedNav>
            <h3 className="title is-3 mt-4">View Library</h3>
            {cards}
        </Container>
    )
}

export default ViewLibrary