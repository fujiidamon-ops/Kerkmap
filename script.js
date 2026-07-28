mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhY2hhMzI4...';

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

// 🔴 地図の読み込みが「完了したあと」に実行する中に色設定を入れます
map.on('load', () => {
    
    // 👇【ここに引っ越し！】CSVの Color_Group に応じてピンの色を自動で塗り分ける設定
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
        'hsl(302, 56%, 47%)'       // デフォルト色
    ]);

    const searchBox = document.getElementById('search-box');
    // 🔍 検索・絞り込み機能（以下そのまま）
    searchBox.addEventListener('input', (e) => {
        // ...
    });
    
    // 🖱️ クリック時のポップアップ表示（以下そのまま）
    map.on('click', (e) => {
        // ...
    });
});
