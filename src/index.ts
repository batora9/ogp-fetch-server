import { Hono } from "hono";

const app = new Hono();

app.get("/welcome", async (c) => {
  const url = "https://batoran.com";
  const response = await fetch(url);
  const meta = await response.text();
  const favicon = meta.match(/<link rel="icon" href="(.*?)"/);
  const description = meta.match(/<meta name="description" content="(.*?)"/);
  const title = meta.match(/<title>(.*?)<\/title>/);
  if (title && favicon && description) {
    return c.json({
      title: title[1],
      description: description[1],
      favicon: url + favicon[1],
    });
  } else {
    console.log("Title not found");
  }
});

app.get("/", (c) => {
  return c.body("Hello, World!");
});

export default app;
