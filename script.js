// あなたのAccess Token
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhY2hhMzI4IiwiYSI6ImNtcWFnYTcyNDA2Z2MycnBwNWJ2Z2pucXkifQ.Z7dIsGQl4CeGw4HkYKh6qg';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/chacha328/cmr7bti6i004a01rd8c7eb7rk',
    center: [5.3, 52.1],
    zoom: 7
});

map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl());

map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}));

// ↓ここから追加
map.on('load', () => {

    // クリック
    map.on('click', 'fd42479d8f62b097d0aa (1)', (e) => {

        const p = e.features[0].properties;

        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
                <h3>${p.Name}</h3>
            `)
            .addTo(map);
    });

    // カーソル変更
    map.on('mouseenter', 'fd42479d8f62b097d0aa (1)', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'fd42479d8f62b097d0aa(1)', () => {
        map.getCanvas().style.cursor = '';
    });

});
