import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { LayerType, FeatureTypeName } from "./types"
import { Eye, EyeOff, Square, SquareCheckBig } from "lucide-react"
import { mapTilesOptions } from "@/settings"
import { useDecadesMapState } from "./hooks"


type LayerMenuProps = {
    toggleLayerVisibility: Function,
    layers: Array<LayerType>,
}

/**
 * Filter layers by feature type.
 * 
 * @param layers 
 * @param featureType 
 * @returns An array of layers filtered by feature type
 */
const filterLayersForFeatureType = (layers: Array<LayerType>, featureType: FeatureTypeName) => {
    return layers.filter(layer => layer.features[0]?.type === featureType)
}

const LayerItem = ({ layer, toggleLayerVisibility }: { layer: LayerType, toggleLayerVisibility: Function }) => {
    return (
        <AccordionContent key={layer.name}>
            <label className={`checkbox flex gap-2 cursor-pointer ${layer.visible || "text-gray-500 hover:text-primary"}`}>
                <input className="appearance-none shrink-0" type="checkbox" checked={layer.visible} onChange={() => toggleLayerVisibility(layer.name)} />
                {layer.visible && <Eye /> || <EyeOff />}
                <span className="hover:underline">{layer.name}</span>
            </label>
        </AccordionContent>
    )
}

const LayersMenu = ({ toggleLayerVisibility, layers }: LayerMenuProps) => {
    const { state: mapState, actions: mapActions } = useDecadesMapState()
    return (
        <div className="absolute bg-background p-4 rounded-md bottom-[50px] left-[10px] z-11 top-[150px] min-h-[300px] w-[250px] overflow-y-auto">
            <h2 className="text-2xl mb-2">Layers</h2>

            <Accordion type="multiple" className="w-full">
                <AccordionItem value="item-0">
                    <AccordionTrigger>Basemap</AccordionTrigger>
                    {mapTilesOptions.map((option) => {
                        return (
                            <AccordionContent key={option.name}>
                                <label className={`checkbox flex gap-2 cursor-pointer`}>
                                    <input
                                        className="appearance-none shrink-0"
                                        type="checkbox"
                                        checked={mapState.tileset.name === option.name}
                                        onChange={() => {
                                            const tileset = mapTilesOptions.find(t => t.name === option.name)
                                            if (tileset) {
                                                mapActions.setTileset(tileset)
                                            }
                                        }}
                                    />
                                    {mapState.tileset.name === option.name && <SquareCheckBig /> || <Square />}
                                    <span className="hover:underline">{option.name}</span>
                                </label>
                            </AccordionContent>
                        )
                    }
                    )}
                </AccordionItem>
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