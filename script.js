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

map.on('load', () => {
    // 【対策】特定のレイヤー名に依存せず、マップ上のすべてのレイヤーを対象にクリックイベントを設定
    map.on('click', (e) => {
        // クリックした位置にある地物をすべて取得
        const features = map.queryRenderedFeatures(e.point);
        
        // プロパティ（CSVのデータ）を持っている地物があるか探す
        const churchFeature = features.find(f => f.properties && (f.properties.Name || f.properties.JP));

        if (!churchFeature) return; // データがない場所なら何もしない

        const p = churchFeature.properties;

        new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: true,
            maxWidth: "340px"
        })
        .setLngLat(e.lngLat)
        .setHTML(`
            <div class="popup" style="color: #333; font-family: sans-serif; padding: 5px;">
                <h2 style="margin: 0 0 5px 0; font-size: 16px;">${p.Name || ''}</h2>
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

    // マウスがデータ（NameかJPを持つ要素）の上に乗ったらカーソルをポインターにする
    map.on('mousemove', (e) => {
        const features = map.queryRenderedFeatures(e.point);
        const hasData = features.some(f => f.properties && (f.properties.Name || f.properties.JP));
        map.getCanvas().style.cursor = hasData ? 'pointer' : '';
    });
});
