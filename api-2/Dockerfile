FROM denoland/deno:1.39.4

WORKDIR /app

RUN chown deno:deno /app

USER 1993

COPY . .

RUN deno cache main.ts

CMD ["run", "-A", "main.ts"]