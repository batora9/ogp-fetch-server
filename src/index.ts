import { Hono } from "hono";
import * as cheerio from "cheerio";

const app = new Hono();

app.get("/", async (c) => {
  // Get the URL from the query string
  const url = c.req.query("url");

  // Check if the URL is provided
  if (!url) {
    return c.text("Bad Request: URL is required", 400);
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return c.text("Bad Request: Invalid URL", 400);
    }
    const meta = await response.text();
    const $ = cheerio.load(meta);

    const title = $('meta[property="og:title"]').attr('content');
    const description = $('meta[property="og:description"]').attr('content');
    const favicon = $('link[rel="icon"]').attr('href');
    const image = $('meta[property="og:image"]').attr('content');

    const result = {
      title,
      description,
      favicon,
      image,
    };

    return c.json(result);
  } catch (error) {
    console.error("Error fetching URL:", error);
    return c.text("Internal Server Error", 500);
  }
});

export default app;
