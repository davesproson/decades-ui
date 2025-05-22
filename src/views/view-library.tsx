import { useDispatch, useSelector } from "../redux/store"
import { saveView } from "@/redux/viewSlice"
import { libraryViews } from "@/views/library-entries"
import { Button } from "@/components/ui/button"
import { v4 as uuidv4 } from 'uuid'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Navbar from '@/navbar'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DecadesBreadCrumb } from "@/components/ui/breadcrumb"

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
        <Alert className="mt-2">
            <AlertDescription>
                <div className="flex">
                    <Check className="mr-2 text-green-600" />
                    <span className="mt-0.5">
                        This view has been made available. To access it,
                        select <strong className="underline">{props.title}</strong> from the <strong> Views </strong> menu.
                    </span>
                </div>
            </AlertDescription>
        </Alert>

    )
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
        <Button variant="outline" className="w-full mt-2" onClick={load} disabled={viewIsLoaded}>
            {loadButtonText}
        </Button>
    )

    return (
        <Card className="mb-4">
            <CardHeader>
                <h4 className="font-bold">{props.title}</h4>
            </CardHeader>
            <CardContent>
                <span className="text-muted-foreground">{props.description}</span>
                <LoadedInfo loaded={viewIsLoaded} title={props.title} />
                {viewIsLoaded ? null : button}
            </CardContent>
        </Card>

    )
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
        <Navbar>
            <DecadesBreadCrumb
                crumbs={[
                    { label: "View Library" }
                ]}
            />
            <Card className="mb-2">
                <CardHeader>
                    <CardTitle>
                        View Library
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {cards}
                </CardContent>
            </Card>
        </Navbar>
    )
}

export { ViewLibrary }