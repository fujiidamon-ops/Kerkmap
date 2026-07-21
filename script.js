// あなたのAccess Token
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhY2hhMzI4IiwiYSI6ImNtcWFnYTcyNDA2Z2MycnBwNWJ2Z2pucXkifQ.Z7dIsGQl4CeGw4HkYKh6qg';

// 地図を作成
const map = new mapboxgl.Map({

    container: 'map',

    // あなたのStyle URL
    style: 'mapbox://styles/chacha328/cmr7bti6i004a01rd8c7eb7rk',

    center: [5.3,52.1],   // オランダ

    zoom: 7

});

// 拡大縮小ボタン
map.addControl(new mapboxgl.NavigationControl());

// 全画面ボタン
map.addControl(new mapboxgl.FullscreenControl());

// 現在地ボタン
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions:{
        enableHighAccuracy:true
    },
    trackUserLocation:true
}));
