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

    // Extract the favicon, description, and title from the HTML
    const faviconMatch = meta.match(/<link rel="icon" href="(.*?)"/);
    const descriptionMatch = meta.match(
      /<meta name="description" content="(.*?)"/
    );
    const titleMatch = meta.match(/<title>(.*)<\/title>/);
    const imageMatch = meta.match(/<meta property="og:image" content="(.*?)"/);

    const ogTitle = $('meta[property="og:title"]').attr("content");
    const ogDescription = $('meta[property="og:description"]').attr("content");
    const ogFavicon = $('link[rel="icon"]').attr("href");
    const ogImage = $('meta[property="og:image"]').attr("content");

    const result = {
      title: ogTitle || (titleMatch ? titleMatch[1] : null),
      description: ogDescription || (descriptionMatch ? descriptionMatch[1] : null),
      favicon: ogFavicon || (faviconMatch ? faviconMatch[1] : null),
      image: ogImage || (imageMatch ? imageMatch[1] : null)
    };

    return c.json(result);
  } catch (error) {
    console.error("Error fetching URL:", error);
    return c.text("Internal Server Error", 500);
  }
});

export default app;
