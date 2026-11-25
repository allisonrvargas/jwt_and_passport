import jwt from "jsonwebtoken";
import { CAZADORES_SEMILLA } from "../models/cazador.model.js";

// El secreto de firma es obligatorio: sin él, cualquiera podría fabricar tokens válidos.
const SECRETO = process.env.JWT_SECRET;
if (!SECRETO || SECRETO.length < 16) {
  throw new Error("Falta JWT_SECRET (mínimo 16 caracteres). Copia .env.example a .env y define un valor aleatorio.");
}
export const JWT_SECRET = SECRETO;

export const cazadorService = {
  async buscarPorUsername(username) {
    return CAZADORES_SEMILLA.find((c) => c.username === username);
  },

  async buscarPorSub(sub) {
    return CAZADORES_SEMILLA.find((c) => c.sub === String(sub));
  },

  firmarTokenJWT(cazador) {
    const payload = {
      sub: cazador.sub,
      username: cazador.username,
      name: cazador.name,
      admin: cazador.admin,
      rango: cazador.rango,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
  },

  async listarPerfiles() {
    return CAZADORES_SEMILLA.map(({ passwordHash, ...perfil }) => perfil);
  },

  async crearRecompensa(dto, autor) {
    return {
      id: Math.floor(Math.random() * 1000),
      ...dto,
      registradoPor: autor,
      fecha: new Date().toISOString(),
    };
  },
};