import { Hono } from "hono";

const app = new Hono();

app.get("/welcome", async (c) => {
  // http://zenn.dev/ の情報を取得
  // metaデータを取得
  const response = await fetch("http://zenn.dev/");
  const body = await response.text();
  const meta = body.match(/<meta.*?>/g);
  return c.body(meta ? meta.join("\n") : "No meta tags found");
});

app.get("/", (c) => {
  return c.body("Hello, World!");
});

export default app;
