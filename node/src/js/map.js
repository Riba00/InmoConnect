(function() {
    const lat = document.querySelector('#lat').value || 40.6555447;
    const lng = document.querySelector('#lng').value || 0.4683695;
    const map = L.map('mapa').setView([lat, lng ], 16);

    let marker;

    const geocodeService = L.esri.Geocoding.geocodeService();
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // PIN
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    }).addTo(map)

    // Detect marker movement
    marker.on('moveend', function (e) {
        marker = e.target
        const position = marker.getLatLng();
        map.panTo(new L.LatLng(position.lat, position.lng))

        // Get the address of the marker
        geocodeService.reverse().latlng(position, 13).run(function(error, result){
            // console.log(result);
            marker.bindPopup(result.address.LongLabel)

            document.querySelector('.street').textContent = result?.address?.Address ?? '';
            document.querySelector('#street').value = result?.address?.Address ?? '';
            document.querySelector('#lat').value = result?.latlng?.lat ?? '';
            document.querySelector('#lng').value = result?.latlng?.lng ?? '';
        })
    })

})()