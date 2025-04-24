import { Divider, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Feature, MapModel } from './model';
import Map, { FullscreenControl, GeolocateControl, Layer, MapLayerMouseEvent, MapRef, Marker, NavigationControl, ScaleControl, Source } from '@vis.gl/react-maplibre';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import { clusterCountLayer, clusterLayer, unclusteredLayer } from './layers';

const sky = {
    'sky-color': '#80ccff',
    'sky-horizon-blend': 0.5,
    'horizon-color': '#ccddff',
    'horizon-fog-blend': 0.5,
    'fog-color': '#fcf0dd',
    'fog-ground-blend': 0.2
};

const terrain = { source: 'terrain-dem', exaggeration: 1.5 };


const HompageMap = () => {
    const [listOfPin, setListOfPin] = useState<any[]>()
    const [optionList, setOptionList] = useState<Feature[]>()
    const [center, setCenter] = useState<number[]>([])
    const mapRef = useRef<MapRef>(null);
    const [zoom, setZoom] = useState(5);


    const onSelectCity = useCallback((data: number[]) => {
        mapRef.current?.flyTo({ center: [data[0], data[1]], duration: 2000, zoom: 10 });
    }, []);

    useEffect(() => {

        getData().then((res: MapModel) => {
            // setOptionList(res.features)
            onSelectCity(res.features[0].geometry.coordinates)
            setListOfPin(res.features.map((it, index) => (
                <Marker
                    key={`marker-${index}`}
                    longitude={it.geometry.coordinates[0]}
                    latitude={it.geometry.coordinates[1]}
                    anchor="bottom"
                    onClick={e => {
                        // If we let the click event propagates to the map, it will immediately close the popup
                        // with `closeOnClick: true`
                        onSelectCity(it.geometry.coordinates)
                        setCenter(it.geometry.coordinates)
                        e.originalEvent.stopPropagation();
                    }}

                >
                    <LocationPinIcon color='error' className='pin' key={index} />
                </Marker>
            )))
        })
    }, []);

    const getData = async () => {
        const res = await fetch('https://v2k-dev.vallarismaps.com/core/api/features/1.1/collections/658cd4f88a4811f10a47cea7/items?api_key=bLNytlxTHZINWGt1GIRQBUaIlqz9X45XykLD83UkzIoN6PFgqbH7M7EDbsdgKVwC&limit=1')
        const data = await res.json()
        return data
    }

    const handleSelectedField = (event: SelectChangeEvent) => {
        const data: number[] = JSON.parse(event.target.value)
        onSelectCity(data)
        setCenter(data)
    }

    // const handleDbClick = async (e: MapLayerMouseEvent) => {
    //     const res = await fetch(`https://v2k-dev.vallarismaps.com/core/api/features/1.1/collections/658cd4f88a4811f10a47cea7/items?api_key=bLNytlxTHZINWGt1GIRQBUaIlqz9X45XykLD83UkzIoN6PFgqbH7M7EDbsdgKVwC&limit=10&search=${e.lngLat.lat, e.lngLat.lng}`)
    //     const data = await res.json()
    //     console.log(data)
    //     return data
    // }

    return (
        <div>
            <div className="navigation-bar p-3">
                <h1>Where we go</h1>
            </div>
            <Grid className='m-2 mt-4' container spacing={2}>
                <Grid size={8}>
                    <div style={{ border: '1px solid black', padding: 5, borderRadius: 4, height: 600 }}>
                        <Map
                            ref={mapRef}
                            initialViewState={{
                                longitude: 0,
                                latitude: 0,
                                zoom: 10
                            }}
                            // mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                            style={{ width: '100%', height: '100%', borderRadius: 4 }}
                            mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
                            sky={sky}
                            terrain={terrain}
                            // onZoomEnd={(e) => console.log(e.viewState.zoom)}                            
                        >
                            <GeolocateControl position="top-left" />
                            <FullscreenControl position="top-left" />
                            <NavigationControl position="top-left" />
                            <ScaleControl />
                            {/* {listOfPin} */}
                            <Source
                                id="earthquakes"
                                type="geojson"
                                data="https://v2k-dev.vallarismaps.com/core/api/features/1.1/collections/658cd4f88a4811f10a47cea7/items?api_key=bLNytlxTHZINWGt1GIRQBUaIlqz9X45XykLD83UkzIoN6PFgqbH7M7EDbsdgKVwC&limit=10000"
                                cluster={true}
                                clusterMaxZoom={11}
                                clusterRadius={50}

                            >
                                <Layer {...clusterLayer} />
                                <Layer {...clusterCountLayer} />
                                <Layer {...unclusteredLayer} />
                            </Source>

                        </Map>
                    </div>

                </Grid>
                <Grid size={4} >
                    <div style={{ border: '1px solid black', padding: 5, borderRadius: 4, height: 600 }}>
                        <h2 className='py-2'>Recommend Place</h2>
                        <FormControl variant='outlined' fullWidth size='small'>
                            <InputLabel id="demo-simple-select-standard-label">Select Place</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                onChange={handleSelectedField}
                                label="Select Place"
                                value={JSON.stringify(center)}
                            >
                                {optionList?.map((it) => {
                                    return <MenuItem value={JSON.stringify(it.geometry.coordinates)}>{it.geometry.coordinates[0]} - {it.geometry.coordinates[1]}</MenuItem>
                                })}

                            </Select>
                        </FormControl>
                        <Divider className='py-2' />
                        <h2 className='py-2'> ชื่อสถานที่ : {null}</h2>
                        <span className='text-xs'>คำอธิบายเพิ่มเติม : {null}</span>
                        <br />
                        <br />
                        <span className='text-sm'>รูปภาพเพิ่มเติม</span>


                    </div>

                </Grid>
            </Grid>


        </div>
    )
}

export default HompageMap