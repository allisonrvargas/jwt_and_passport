import { test, before, after } from "node:test";
import assert from "node:assert/strict";

process.env.JWT_SECRET = "secreto-de-prueba-solo-para-tests";
const { default: app } = await import("../src/app.js");
const { CAZADORES_SEMILLA } = await import("../src/models/cazador.model.js");

let servidor, base;
before(async () => {
  await new Promise((ok) => { servidor = app.listen(0, ok); });
  base = `http://localhost:${servidor.address().port}`;
});
after(() => servidor.close());

const pedir = async (metodo, ruta, { token, cuerpo } = {}) => {
  const r = await fetch(base + ruta, {
    method: metodo,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  return { status: r.status, json: await r.json().catch(() => ({})) };
};
const login = async (username, password = "Password123!") =>
  (await pedir("POST", "/api/v1/users/authenticate", { cuerpo: { username, password } }));

test("/health responde ok", async () => {
  const r = await pedir("GET", "/health");
  assert.equal(r.status, 200);
  assert.equal(r.json.estado, "ok");
});

test("las contraseñas no se guardan en texto plano", () => {
  for (const c of CAZADORES_SEMILLA) {
    assert.equal(c.password, undefined);
    assert.match(c.passwordHash, /^\$2[aby]\$/);
    assert.notEqual(c.passwordHash, "Password123!");
  }
});

test("login correcto devuelve un token Bearer", async () => {
  const r = await login("jinwoo");
  assert.equal(r.status, 200);
  assert.equal(r.json.tipo, "Bearer");
  assert.ok(r.json.token);
  assert.equal(r.json.cazador.username, "jinwoo");
});

test("login con contraseña incorrecta o usuario inexistente responde 401", async () => {
  assert.equal((await login("jinwoo", "incorrecta")).status, 401);
  assert.equal((await login("nadie", "Password123!")).status, 401);
});

test("login con datos inválidos responde 400", async () => {
  const r = await pedir("POST", "/api/v1/users/authenticate", { cuerpo: { username: "a", password: "x" } });
  assert.equal(r.status, 400);
  assert.ok(r.json.errores.length >= 1);
});

test("listar cazadores requiere token y no expone hashes", async () => {
  assert.equal((await pedir("GET", "/api/v1/user/list")).status, 401);
  const { json: { token } } = await login("cha");
  const r = await pedir("GET", "/api/v1/user/list", { token });
  assert.equal(r.status, 200);
  assert.equal(r.json.data.length, 3);
  assert.ok(!JSON.stringify(r.json).includes("passwordHash"));
  assert.ok(!JSON.stringify(r.json).includes("$2"));
});

test("un token manipulado se rechaza con 401", async () => {
  const { json: { token } } = await login("jinwoo");
  const [h, p, f] = token.split(".");
  const falso = [h, Buffer.from(JSON.stringify({ sub: "1", admin: true })).toString("base64url"), f].join(".");
  assert.equal((await pedir("GET", "/api/v1/user/list", { token: falso })).status, 401);
});

test("la bóveda es solo para administradores (403 / 201) y valida el cuerpo (400)", async () => {
  const cuerpo = { mision: "Mazmorra de nivel S", cristales: 500 };
  const regular = (await login("cha")).json.token;
  const admin = (await login("jinwoo")).json.token;
  assert.equal((await pedir("POST", "/api/v1/boveda/recompensa", { token: regular, cuerpo })).status, 403);
  const ok = await pedir("POST", "/api/v1/boveda/recompensa", { token: admin, cuerpo });
  assert.equal(ok.status, 201);
  assert.equal(ok.json.data.registradoPor, "jinwoo");
  assert.equal((await pedir("POST", "/api/v1/boveda/recompensa", { token: admin, cuerpo: { mision: "x", cristales: -1 } })).status, 400);
});

test("sin JWT_SECRET el servicio no arranca", async () => {
  const { spawnSync } = await import("node:child_process");
  const r = spawnSync(process.execPath, ["--input-type=module", "-e", 'await import("./api/src/services/cazador.service.js")'], {
    env: { ...process.env, JWT_SECRET: "" }, encoding: "utf8",
  });
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /Falta JWT_SECRET/);
});