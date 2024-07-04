(function () {
  const lat = 40.6555447;
  const lng = 0.4683695;
  const map = L.map("init-map").setView([lat, lng], 16);

  let markers = new L.FeatureGroup().addTo(map);

  let properties = [];

  // Filters
  const filters = {
    category: "",
    price: "",
  };

  const categoriesSelect = document.querySelector("#categories");
  const pricesSelect = document.querySelector("#prices");

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  //
  categoriesSelect.addEventListener("change", (e) => {
    filters.category = +e.target.value;
    filterProperties();
  });

  pricesSelect.addEventListener("change", (e) => {
    filters.price = +e.target.value;
    filterProperties();
  });

  const getProperties = async () => {
    try {
      const url = "/api/properties";
      const response = await fetch(url);
      properties = await response.json();

      showProperties(properties);
    } catch (error) {
      console.log(error);
    }
  };

  const showProperties = (properties) => {

    markers.clearLayers()



    properties.forEach((property) => {
      const marker = new L.marker([property?.lat, property?.lng], {
        autoPan: true,
      }).addTo(map).bindPopup(`
                <p class="text-indigo-600 font-bold">${property.category.name}</p>
                <h1 class="text-xl font-extrabold uppercase my-2">${property?.title}</h1>
                <img src="/uploads/${property?.images[0]}" alt="${property?.title} image">
                <p class="text-gray-600 font-bold">${property.price.name}</p>
                <a href="/property/${property.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase">Show Property</a>
            `);

      markers.addLayer(marker);
    });
  };

  const filterProperties = () => {
    const result = properties.filter(filterCategory).filter(filterPrice);
    console.log(result);
    showProperties(result)
  };

  const filterCategory = (property) => {
    return filters.category
      ? property.categoryId === filters.category
      : property;
  };

  const filterPrice = (property) => {
    return filters.price ? property.priceId === filters.price : property;
  };

  getProperties();
})();
