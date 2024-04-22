
import Map from './map';
import { BaseLayer } from './layers/base';
import { TrackedEntity } from './layers/trackedEntity';

import { getData } from '../plot/plotUtils';

export type CompatibleData = {
    lat: number,
    lon: number,
    time: number
}

const updateLuxe = async (callback: Function) => {

    const now = Math.floor(new Date().getTime() / 1000);
    let data = await getData({
        params: ["gin_latitude", "gin_longitude"],
    }, now - 2, now - 1);

    const compatibleData = {
        lat: data.gin_latitude[data.gin_latitude.length - 1],
        lon: data.gin_longitude[data.gin_longitude.length - 1],
        time: data.utc_time[data.utc_time.length - 1],
    };

    callback(compatibleData);
}

const DecadesMap = () => {
    return (
        <Map>
            <BaseLayer />
            <TrackedEntity
                icon={{
                    src: 'mapicons/g-luxe.png',
                    scale: 0.5,
                    name: 'G-LUXE'
                }}
                updater={updateLuxe}
                updateFrequency={3000}
            />
        </Map>
    )
}

export default DecadesMap;