const isSeller = (userId, propertyUserId) => {
  return userId === propertyUserId;
};

const formatDate = (date) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // Convertir la fecha a formato de cadena con formato largo
  const formattedDate = new Date(date).toLocaleDateString("en-US", options);

  // Dividir la cadena en partes
  const [weekday, monthDay, year] = formattedDate.split(", ");

  // Obtener el día y el mes
  const [month, day] = monthDay.split(" ");

  // Construir la fecha en el formato deseado
  return `${weekday}, ${day} ${month} ${year}`;
};

export { isSeller, formatDate };
