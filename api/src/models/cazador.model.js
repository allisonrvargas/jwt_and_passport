import bcrypt from "bcryptjs";

// Contraseña de las cuentas de demostración (documentada en el README).
// En memoria solo se guarda su hash bcrypt; nunca el texto plano.
const CLAVE_DEMO = "Password123!";
const RONDAS = 10;
const hash = bcrypt.hashSync(CLAVE_DEMO, RONDAS);

export const CAZADORES_SEMILLA = [
  { sub: "1", username: "jinwoo", passwordHash: hash, name: "Sung Jin-Woo", rango: "S", admin: true },
  { sub: "2", username: "cha", passwordHash: hash, name: "Cha Hae-In", rango: "S", admin: false },
  { sub: "3", username: "jinho", passwordHash: hash, name: "Yoo Jin-Ho", rango: "D", admin: false },
];

// Hash falso para comparar cuando el usuario no existe y no revelar por tiempo qué cuentas hay
export const HASH_FALSO = bcrypt.hashSync("no-existe", RONDAS);