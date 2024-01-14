import { Application, Router } from "https://deno.land/x/oak@v12.5.0/mod.ts";

await Deno.writeTextFile("whitelist", "sautax\n", { create: true });

const serviceURL = Deno.env.get("SERVICE_URL") || "http://app-2:3000";
const secret = Deno.env.get("SECRET") || "secret";

const app = new Application();

const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = "Hello world!";
});

// GET /whitelist/{id}
router.get("/whitelist/:id", async (ctx) => {
  const id = ctx.params.id;

  const command = new Deno.Command("/bin/sh", {
    args: ["-c", `cat whitelist | grep ${id}`],
  });
  const res = await command.output();
  if (res.code === 0) {
    ctx.response.body = "Whitelisted";
    ctx.response.status = 200;
  } else {
    ctx.response.body = "Not Whitelisted";
    ctx.response.status = 404;
  }
});

// POST /whitelist/{id}
router.post("/whitelist/:id", async (ctx) => {
  const auth = ctx.request.headers.get("Authorization");
  if (auth !== secret) {
    ctx.response.body = "Not Authorized";
    ctx.response.status = 401;
    return;
  }

  const id = ctx.params.id;

  await Deno.writeTextFile("whitelist", `${id}\n`, { append: true });

  ctx.response.body = "OK";
  ctx.response.status = 200;
});

// DELETE /whitelist/{id}
router.delete("/whitelist/:id", async (ctx) => {
  const auth = ctx.request.headers.get("Authorization");
  if (auth !== secret) {
    ctx.response.body = "Not Authorized";
    ctx.response.status = 401;
    return;
  }
  const id = ctx.params.id;

  const command = new Deno.Command("/bin/sh", {
    args: [
      "-c",
      `cat whitelist | grep -v ${id} > whitelist.tmp && mv whitelist.tmp whitelist`,
    ],
  });
  const res = await command.output();
  if (res.code === 0) {
    ctx.response.body = "OK";
    ctx.response.status = 200;
  } else {
    ctx.response.body = "Not OK";
    ctx.response.status = 500;
  }
});

router.get("/service/status", async (ctx) => {
  const res = await fetch(`${serviceURL}/status`);

  if (res.status === 200) {
    ctx.response.body = "OK";
    ctx.response.status = 200;
  } else {
    ctx.response.body = "Not OK";
    ctx.response.status = 500;
  }
});

app.use(router.routes());

await app.listen({ port: 3000 });
