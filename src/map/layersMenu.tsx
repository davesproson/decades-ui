import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { LayerType } from "./types"
import { Eye, EyeOff } from "lucide-react"


type LayerMenuProps = {
    toggleLayerVisibility: Function,
    layers: Array<LayerType>,
}

const filterLayersForFeatureType = (layers: Array<LayerType>, featureType: string) => {
    return layers.filter(layer => layer.features[0].type === featureType)
}

const LayerItem = ({ layer, toggleLayerVisibility }: { layer: LayerType, toggleLayerVisibility: Function }) => {
    return (
        <AccordionContent key={layer.name}>
            <label className={`checkbox flex gap-2 cursor-pointer ${layer.visible || "text-secondary hover:text-primary"}`}>
                <input className="appearance-none shrink-0" type="checkbox" checked={layer.visible} onChange={() => toggleLayerVisibility(layer.name)} />
                {layer.visible && <Eye /> || <EyeOff />}
                <span className="hover:underline">{layer.name}</span>
            </label>
        </AccordionContent>
    )
}

const LayersMenu = ({ toggleLayerVisibility, layers }: LayerMenuProps) => {

    return (
        <div className="absolute bg-background p-4 rounded-md bottom-[50px] left-[10px] z-11 top-[150px] min-h-[300px] w-[250px] overflow-y-auto">
            <h2 className="text-2xl mb-2">Layers</h2>
            <Accordion type="multiple" className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Waypoints</AccordionTrigger>
                    {filterLayersForFeatureType(layers, 'poi').map((layer) => {
                        return <LayerItem key={layer.name} layer={layer} toggleLayerVisibility={toggleLayerVisibility} />
                    })}
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>KML Layers</AccordionTrigger>
                    {filterLayersForFeatureType(layers, 'kml').map((layer) => {
                        return <LayerItem key={layer.name} layer={layer} toggleLayerVisibility={toggleLayerVisibility} />
                    })}
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>Imagery</AccordionTrigger>
                    {filterLayersForFeatureType(layers, 'image').map((layer) => {
                        return <LayerItem key={layer.name} layer={layer} toggleLayerVisibility={toggleLayerVisibility} />
                    })}
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export { LayersMenu }