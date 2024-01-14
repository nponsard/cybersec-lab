FROM denoland/deno:1.39.4

WORKDIR /app

COPY . .

RUN deno cache main.ts

CMD ["run", "-A", "src/index.ts"]