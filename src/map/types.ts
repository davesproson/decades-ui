import { Map } from "ol";

export type MapContextType = {
    state: {
        map: Map | null;
    };
    actions: {
        setMap: (map: Map | null) => void;
        addLayer: () => void;
    };
};
