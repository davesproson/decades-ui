import { LayerType } from "../types"

const getLayers = async (luxeBase: string) => {
    const fetchedLayers: LayerType[] = []
    const response = await fetch(`${luxeBase}/api/v1/mapping/layers`)
    const availableLayers = (await response.json()).filter((layer:any)=>layer.layer_type==='poi')
    for (const layer of availableLayers) {
        const detail_response = await fetch(`${luxeBase}/api/v1/mapping/layers/${layer.id}?layer_type=poi`)
        const detail = await detail_response.json()
        fetchedLayers.push({
            name: layer.name,
            visible: false,
            type: 'vector',
            features: detail.pois.map((poi:any)=>({
                type: 'poi',
                latitude: poi.latitude,
                longitude: poi.longitude,
                color: poi.color,
                heading: poi.heading
            }))
        })
    }
    return fetchedLayers
}

export const LAYER_INTERFACES = {
    FAAMAir: (async () => getLayers('http://192.168.101.105/gluxe')),
    FAAMGround: (async () => getLayers('http://localhost:9999')),
}