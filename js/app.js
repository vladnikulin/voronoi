var count = 0;
var marks = true;
var test = new Array(
    [55.75689813604806, 37.60956171948243],
    [55.75133168450535, 37.625783719604506],
    [55.74794301904979, 37.64037493664552],
    [55.744215145619634, 37.61865977246095],
    [55.749346930602925, 37.59754542309572],
    [55.757430537435845, 37.64191988903809]);

ymaps.ready(init);


function marksLock() {

    if (marks) {
        document.getElementById('lock').className = 'btn-info';
        document.getElementById('lock').innerHTML = "Режим просмотра";
        marks = false;
    }
    else {
        document.getElementById('lock').className = 'btn-primary';
        document.getElementById('lock').innerHTML = "Режим добавления";
        marks = true;
    }
}

function init() {

    var multiRoute = new ymaps.multiRouter.MultiRoute({
        // Описание опорных точек мультимаршрута.
        referencePoints: [
        [55.734876, 37.59308],
        "Москва, ул. Мясницкая"
        ],
        // Параметры маршрутизации.
        params: { // Ограничение на максимальное количество маршрутов, возвращаемое маршрутизатором.
            results: 1
        }
    }, {
            // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
            boundsAutoApply: false
        });

    // Создаем кнопки для управления мультимаршрутом.
    var trafficButton = new ymaps.control.Button({
        data: { content: "Учитывать пробки" },
        options: { selectOnClick: true, visible: false }
    }),
    viaPointButton = new ymaps.control.Button({
        data: { content: "Маршрут А" },
        options: { selectOnClick: true }
    });

    // Объявляем обработчики для кнопок.
    trafficButton.events.add('select', function () {
        /**
         * Задаем параметры маршрутизации для модели мультимаршрута.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRouteModel.xml#setParams
         */
         multiRoute.model.setParams({ avoidTrafficJams: true }, true);
     });

    trafficButton.events.add('deselect', function () {
        multiRoute.model.setParams({ avoidTrafficJams: false }, true);
    });


    var myMap = new ymaps.Map('map', {
        center: [55.753994, 37.622093],
        zoom: 14,
        controls: [trafficButton, viaPointButton]
    }, {
        buttonMaxWidth: 300
    });
    myMap.geoObjects.add(multiRoute);


    // Слушаем клик на карте.
    myMap.events.add('click', function (e) {

        myPlacemark = createPlacemark(coords, false);
        myMap.geoObjects.add(myPlacemark);
        // Слушаем событие окончания перетаскивания на метке.
        myPlacemark.events.add('dragend', function () {
            getAddress(myPlacemark.geometry.getCoordinates());
        });
        getAddress(coords);
    });

    viaPointButton.events.add('click', function () {
        for (var i = 0; i < test.length; i++) {
            myPlacemark = createPlacemark(test[i], true);
            myMap.geoObjects.add(myPlacemark);
            getAddress(myPlacemark.geometry.getCoordinates());

            // ==== @TODO CONNECT TO VORONOI CANVAS ====

            // voronoicreate.js - 48,49
            // xCoords.push(10 * i); // ERROR - coordinates with canvas and dots on map doesnt match!
            // yCoords.push(10 * i); // ERROR - coordinates with canvas and dots on map doesnt match!
        }
    });
}

// Создание метки.
function createPlacemark(coords, load) {

    if (marks) {
        count++;
        var x = document.getElementById('table_marks').insertRow(1);
        var y = x.insertCell(0);
        var z = x.insertCell(1);
        var w = x.insertCell(2);
        y.innerHTML = "point" + count;
        z.innerHTML = coords[0];
        w.innerHTML = coords[1];
        return new ymaps.Placemark(
            coords, 
            { iconCaption: 'поиск...' }, 
            { preset: 'islands#violetDotIconWithCaption', draggable: true }
            );
    }
}

// Определяем адрес по координатам (обратное геокодирование).
function getAddress(coords) {
    myPlacemark.properties.set('iconCaption', 'поиск...');
    ymaps.geocode(coords).then(function (res) {
        var firstGeoObject = res.geoObjects.get(0);
        myPlacemark.properties
        .set({
            iconCaption: ('p ' + count),
            balloonContent: firstGeoObject.properties.get('text')
        });
    });
}


var visible = false;
function showCanvas() {
    if (visible) {
        document.getElementById('show').innerHTML = "Показать";
        document.getElementById('show').className = 'btn-primary';
        document.getElementById('voronoiCanvas').style.display = 'none';
        visible = false;
    } else {
        document.getElementById('show').innerHTML = "Скрыть";
        document.getElementById('show').className = 'btn-info';
        document.getElementById('voronoiCanvas').style.display = 'block';
        visible = true;
    }
}


(function () {
    var srcElem = document.getElementById("script");
    if (srcElem) {
        var dstElem = document.getElementById("scriptContainer");
        if (dstElem) {
            dstElem.innerText = srcElem.innerHTML;
        }
    }
})();