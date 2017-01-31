ymaps.ready(init);
var count=0;
var marks=true;
function init() {
    var myPlacemark,
        myMap = new ymaps.Map('map', {
            center: [55.753994, 37.622093],
            zoom: 9
        }, {
            searchControlProvider: 'yandex#search'
        });
		

    if (marks) {
    // Слушаем клик на карте.
    myMap.events.add('click', function (e) {
        var coords = e.get('coords');
            myPlacemark = createPlacemark(coords);
            myMap.geoObjects.add(myPlacemark);
            // Слушаем событие окончания перетаскивания на метке.
            myPlacemark.events.add('dragend', function () {
                getAddress(myPlacemark.geometry.getCoordinates());
            });
        getAddress(coords);
    });
}
    // Создание метки.
    function createPlacemark(coords) {
			            count++;
						
        return new ymaps.Placemark(coords, {
            iconCaption: 'поиск...'
        }, {
            preset: 'islands#violetDotIconWithCaption',
            draggable: true
        });
    }

    // Определяем адрес по координатам (обратное геокодирование).
    function getAddress(coords) {
        myPlacemark.properties.set('iconCaption', 'поиск...');
        ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);
            myPlacemark.properties
                .set({
                    iconCaption: ('Базовая станция '+count),
                    balloonContent: firstGeoObject.properties.get('text')
                });
        });
    }
}
