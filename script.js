mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhY2hhMzI4IiwiYSI6ImNtcWFnYTcyNDA2Z2MycnBwNWJ2Z2pucXkifQ.Z7dIsGQl4CeGw4HkYKh6qg';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/chacha328/cms4g1uwz000e01sj4zjbaub9',
    center: [5.3, 52.1],
    zoom: 7
});

// コントロール類の追加
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl());
map.addControl(new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true }));

// 地図の読み込みが完了したあとに実行
map.on('load', () => {
    
    // 🎨 CSVの Color_Group に応じてピンの色を自動で塗り分ける設定
    map.setPaintProperty('church_pins', 'circle-color', [
        'match',
        ['to-string', ['get', 'Color_Group']], 
        '1', 'hsl(302, 56%, 47%)', 
        '2', 'hsl(302, 56%, 47%)', 
        '3', 'hsl(69, 56%, 57%)',  
        '4', 'hsl(266, 60%, 58%)', 
        '5', 'hsl(29, 87%, 53%)',  
        '6', 'hsl(144, 61%, 34%)', 
        '7', 'hsl(302, 56%, 47%)', 
        '8', 'hsl(302, 56%, 47%)', 
        'hsl(302, 56%, 47%)' // どれにも当てはまらない場合のデフォルト色
    ]);

    const searchBox = document.getElementById('search-box');
    
    // 🔍 検索・絞り込み機能
    searchBox.addEventListener('input', (e) => {
        const value = e.target.value.trim().toLowerCase();
        
        if (value === '') {
            map.setFilter('church_pins', null);
            return;
        }

        const filter = [
            'any',
            ['in', value, ['downcase', ['coalesce', ['get', 'Name'], '']]],
            ['in', value, ['downcase', ['coalesce', ['get', 'JP'], '']]],
            ['in', value, ['downcase', ['coalesce', ['get', 'Architect'], '']]],
            ['in', value, ['downcase', ['coalesce', ['get', 'Sect'], '']]],
            ['in', value, ['downcase', ['coalesce', ['get', 'Style'], '']]]
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
            maxWidth: "400px",
            focusAfterOpen: false
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
                
                <!-- Googleマップの埋め込み (CSVにGmap_Embedがある場合のみ表示) -->
                ${p.Gmap_Embed ? `
                <div style="margin-top: 10px; width: 100%; height: 150px; border-radius: 4px; overflow: hidden;">
                    <iframe src="${p.Gmap_Embed}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
                ` : ''}

                ${p.Link ? `<a href="${p.Link}" target="_blank" style="display: block; text-align: center; margin-top: 10px; padding: 8px; background: #666; color: white; text-decoration: none; border-radius: 4px; font-size: 12px;">Official Website</a>` : ''}
                ${p.Studio_Link ? `<a href="${p.Studio_Link}" target="_blank" style="display: block; text-align: center; margin-top: 5px; padding: 8px; background: #007cbf; color: white; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: bold;">Read Studio Article</a>` : ''}
            </div>
        `)
        .addTo(map);
    });
});
