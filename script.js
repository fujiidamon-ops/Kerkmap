// あなたのAccess Token
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhY2hhMzI4IiwiYSI6ImNtcWFnYTcyNDA2Z2MycnBwNWJ2Z2pucXkifQ.Z7dIsGQl4CeGw4HkYKh6qg';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/chacha328/cmrw3mj4j00a701rd5lbqdevi',
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

// ★Studioで設定した「正確なレイヤー名」
// ※もし前回の「fd42479d8f62b097d0aa(1)」のままであれば、ここを書き換えてください。
const layerId = 'church_pins'; 

map.on('load', () => {
    // データソースを取得（絞り込みで何度も使うため）
    const source = map.getSource(map.getLayer(layerId).source);

    // 🔍 検索機能の実装
    const searchBox = document.getElementById('search-box');

    // 文字が入力されるたびに実行
    searchBox.addEventListener('input', (e) => {
        const value = e.target.value.trim().toLowerCase(); // 入力された文字を小文字に統一

        // 検索窓が空なら、すべてのピンを表示して終了
        if (value === "") {
            map.setFilter(layerId, null);
            return;
        }

        // CSVの項目（Name, JP, Architect）の中に、入力文字が含まれているかチェックするフィルターを作成
        const filter = ['any',
            ['ilike', ['get', 'Name'], value],        // 英語名
            ['ilike', ['get', 'JP'], value],          // 日本語名
            ['ilike', ['get', 'Architect'], value]    // 建築家名
        ];

        // フィルターを適用してピンを絞り込む
        map.setFilter(layerId, filter);
    });


    // --- ここから下は前回と同じ（クリックしてポップアップを表示） ---
    
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

    map.on('mouseenter', layerId, () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', layerId, () => {
        map.getCanvas().style.cursor = '';
    });
});
