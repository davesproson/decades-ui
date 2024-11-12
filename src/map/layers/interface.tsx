import { LayerType } from "../types"

const getGluxeLayers = async (luxeBase: string) => {
    const fetchedLayers: LayerType[] = []
    const response = await fetch(`${luxeBase}/api/v1/mapping/layers`)
    const json = await response.json()
    {
        const poiLayers = json.filter((layer: any) => layer.layer_type === 'poi')
        for (const layer of poiLayers) {
            const detail_response = await fetch(`${luxeBase}/api/v1/mapping/layers/${layer.id}?layer_type=poi`)
            const detail = await detail_response.json()
            fetchedLayers.push({
                name: layer.name,
                visible: false,
                type: 'vector',
                features: detail.pois.map((poi: any) => ({
                    type: 'poi',
                    latitude: poi.latitude,
                    longitude: poi.longitude,
                    color: poi.color,
                    heading: poi.heading,
                    name: poi.name
                }))
            })
        }
    }

    {
        const kmlLayers = json.filter((layer: any) => layer.layer_type === 'kml')
        for (const kmlLayer of kmlLayers) {
            console.log(kmlLayer)
            fetchedLayers.push({
                name: kmlLayer.name,
                visible: false,
                type: 'kml',
                features: [{
                    type: 'kml',
                    url: `${luxeBase}${kmlLayer.url}`
                }]
            })
        }
    }
    return fetchedLayers
}

export const LAYER_INTERFACES = {
    GluxeAir: () => getGluxeLayers('http://192.168.101.105/gluxe'),
    GluxeDev: () =>  getGluxeLayers('http://localhost:9999'),
    GluxeGround: () => getGluxeLayers('https://www.faam.ac.uk/gluxe'),
}