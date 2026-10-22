import jwt from "jsonwebtoken";
import { CAZADORES_SEMILLA } from "../models/cazador.model.js";

export const JWT_SECRET = process.env.JWT_SECRET || "tu_clave_secreta_super_segura";

export const cazadorService = {
  async buscarPorUsername(username) {
    return CAZADORES_SEMILLA.find((c) => c.username === username);
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
    return CAZADORES_SEMILLA.map(({ password, ...perfil }) => perfil);
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