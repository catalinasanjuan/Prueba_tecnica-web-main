const bcrypt = require('bcrypt');

const passwordIngresada = "123456".trim();
const hashAlmacenado = "$2b$10$CvlySmCDy5HohPLEP.l2SuMOik0KG9OdwuDh6T0mg.2lFPo8rRYAq";

console.log("Contraseña ingresada:", passwordIngresada);
console.log("Hash almacenado:", hashAlmacenado);
console.log("Longitud del hash almacenado:", hashAlmacenado.length);

bcrypt.compare(passwordIngresada, hashAlmacenado)
  .then(match => console.log("¿Coinciden?", match))
  .catch(err => console.error("Error en bcrypt.compare:", err));
