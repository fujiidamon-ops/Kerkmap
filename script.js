// あなたのAccess Token
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhY2hhMzI4IiwiYSI6ImNtcWFnYTcyNDA2Z2MycnBwNWJ2Z2pucXkifQ.Z7dIsGQl4CeGw4HkYKh6qg';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/chacha328/cmr7bti6i004a01rd8c7eb7rk',
    center: [5.3, 52.1], // オランダの中心
    zoom: 7
});

// コントロール類の追加
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl());
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true
}));

map.on('load', () => {
    const searchBox = document.getElementById('search-box');

    // 🔍 検索・絞り込み機能
    searchBox.addEventListener('input', (e) => {
        const value = e.target.value.trim().toLowerCase();

        // 検索窓が空なら、すべてのピンを表示して終了
        if (value === "") {
            map.setFilter('church_pins', null);
            return;
        }

        // 部分一致で検索する構文
        const filter = ['any',
            ['in', value, ['downcase', ['coalesce', ['get', 'Name'], '']]],
            ['in', value, ['downcase', ['coalesce', ['get', 'JP'], '']]],
            ['in', value, ['downcase', ['coalesce', ['get', 'Architect'], '']]]
        ];

        map.setFilter('church_pins', filter);
    });

    // 🖱️ クリック時のポップアップ表示
    map.on('click', (e) => {
        const features = map.queryRenderedFeatures(e.point);
        const church = features.find(f => f.properties && (f.properties.Name || f.properties.JP));

        if (!church) return;

        const p = church.properties;

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
                ${p.Link ? `<a href="${p.Link}" target="_blank" style="display: block; text-align: center; margin-top: 10px; padding: 8px; background: #666; color: white; text-decoration: none; border-radius: 4px; font-size: 12px;">Official Website</a>` : ''}
                ${p.Studio_Link ? `<a href="${p.Studio_Link}" target="_blank" style="display: block; text-align: center; margin-top: 5px; padding: 8px; background: #007cbf; color: white; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: bold;">Read Studio Article</a>` : ''}
            </div>
        `)
        .addTo(map);
    });

    // マウスホバーでカーソルをポインターにする処理
    map.on('mousemove', (e) => {
        const features = map.queryRenderedFeatures(e.point);
        const hasData = features.some(f => f.properties && (f.properties.Name || f.properties.JP));
        map.getCanvas().style.cursor = hasData ? 'pointer' : '';
    });
});
