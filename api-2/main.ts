import { Application, Router } from "https://deno.land/x/oak@v12.5.0/mod.ts";

const serviceURL = Deno.env.get("SERVICE_URL") || "http://app-1:3000";
const secret = Deno.env.get("SECRET") || "secret";

const app = new Application();

const router = new Router();

router.get("/status", (ctx) => {
  ctx.response.body = "OK";
  ctx.response.status = 200;
});

const whitelist = [] as string[];

async function randomWhitelistOperation() {
  if (Math.random() > 0.5) {
    const uuid = crypto.randomUUID();

    await fetch(`${serviceURL}/whitelist/${uuid}`, {
      method: "POST",
      headers: {
        Authorization: secret,
      },
    });

    whitelist.push(uuid);
  } else {
    const uuid = whitelist.shift();

    await fetch(`${serviceURL}/whitelist/${uuid}`, {
      method: "DELETE",
      headers: {
        Authorization: secret,
      },
    });
  }
}

// Randomly add or remove from the whitelist every second
setInterval(randomWhitelistOperation, 1000);

app.use(router.routes());

await app.listen({ port: 3000 });
