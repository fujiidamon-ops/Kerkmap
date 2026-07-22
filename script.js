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
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true
}));

// Studioで変更したレイヤー名を設定
const layerId = 'church_pins';

map.on('load', () => {
    // クリック時のイベント
    map.on('click', layerId, (e) => {
        const p = e.features[0].properties;

        new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: true,
            maxWidth: "340px"
        })
        .setLngLat(e.lngLat)
        .setHTML(`
            <div class="popup" style="color: #333; font-family: sans-serif; padding: 5px;">
                <h2 style="margin: 0 0 5px 0; font-size: 16px;">${p.Name || ''}</h2>
                <!-- 項目名「JP」を表示 -->
                <p class="jp" style="margin: 0 0 10px 0; color: #666; font-size: 14px;">${p.JP || ''}</p>
                <hr style="border: 0; border-top: 1px solid #ccc; margin: 10px 0;">
                <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                    <tr><th style="text-align: left; padding: 4px 0; width: 80px;">City</th><td>${p.City || ''}</td></tr>
                    <tr><th style="text-align: left; padding: 4px 0;">Architect</th><td>${p.Architect || ''}</td></tr>
                    <tr><th style="text-align: left; padding: 4px 0;">Year</th><td>${p.Year || ''}</td></tr>
                    <tr><th style="text-align: left; padding: 4px 0;">Sect</th><td>${p.Sect || ''}</td></tr>
                    <tr><th style="text-align: left; padding: 4px 0;">Style</th><td>${p.Style || ''}</td></tr>
                    <tr><th style="text-align: left; padding: 4px 0;">References</th><td>${p.References || ''}</td></tr>
                </table>
                ${p.Link ? `<a href="${p.Link}" target="_blank" style="display: block; text-align: center; margin-top: 10px; padding: 8px; background: #007cbf; color: white; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: bold;">Read More</a>` : ''}
            </div>
        `)
        .addTo(map);
    });

    // カーソルをポインターに変更する処理
    map.on('mouseenter', layerId, () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', layerId, () => {
        map.getCanvas().style.cursor = '';
    });
});
