import Map from './map';

import { DataContext } from './context';
import { useAircraftData } from './hooks';
import { MapHeader } from './header';
import { BaseLayer } from './layers/base';
import { TrackedEntity } from './features/trackedEntity';
import { useScrollInhibitor } from '../hooks';

const DecadesMap = () => {
    const { aircraftData, aircraftHistory } = useAircraftData()
    useScrollInhibitor(true)

    return (
        <DataContext.Provider value={{ aircraftData, aircraftHistory }}>
            <MapHeader />
            <Map top={100}>
                <BaseLayer />
                <TrackedEntity
                    icon={{
                        src: 'mapicons/g-luxe.png',
                        scale: 0.5,
                        name: 'G-LUXE'
                    }}
                />
            </Map>
        </DataContext.Provider>
    )
}

export default DecadesMap;