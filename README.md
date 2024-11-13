# DECADES Vista

> A terrible name for an awful project.

A bog standard React TS application bootstrapped with Vite. Vista (eurgh) is intended to be a complete user interface for DECADES. It includes

- Timeseries visualisation
- Tephigrams
- Data panels ('dashboards')
- User defined views
- Mapping
- Flight summary
- User-user chat
- A bunch of other widgets of varying uselessness

Requires `aio-decades` as the backend, which is assumed to be running on the same host as the frontend, behind the path `/decades` (though this can be changed in the settings file).

The following environment variables may be set:

- `VITE_VISTA_DEPLOYMENT_MODE`: Set to `prod`, `ground` or `dev` for aircraft, ground or development mode respectively. Default is `dev`.
- `VITE_VISTA_BASE_URL`: The base URL for the application. Default is `/`.
- `VITE_VISTA_BAD_DATA`: The numerical value to use for bad data. Default is `-999.99`.
- `VITE_VISTA_ENABLE_TUTORIAL`: Set to `true` to enable the tutorial. Default is `true`. Currently only supported in Version 1.
- `VITE_VISTA_MAP_TILE_URL`: The URL for the map tile server. Default is `https://tile.openstreetmap.org/{z}/{x}/{y}.png`.
- `VITE_VISTA_ENABLE_QUICKLOOK`: Set to `true` to enable the quicklook feature (visualisation of processed data). Default is `false`. Should only be enabled for ground segment.
- `VITE_VISTA_ENABLE_CHAT`: Set to `true` to enable the chat feature. Default is `false`. 
- `VITE_VISTA_ENABLE_MAP`: Set to `true` to enable the map feature. Default is `false`.
- `VIER_VISTA_MAP_LAYER_INTERFACE`: A string representing the map layer interface to use. Default is `GluxeAir`.
- `VITE_VISTA_ENABLE_TABBED_PLOTS`: Set to `true` to enable tabbed plot (i.e. stacking on the parameter page). Default is `false`.
-  `USE_WEBSOCKET_DATA`: Set to `true` to use webdocket data. Highly experimental, default is `false`.