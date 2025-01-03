import { Hono } from "hono";

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

    // Extract the favicon, description, and title from the HTML
    const faviconMatch = meta.match(/<link rel="icon" href="(.*?)"/);
    const descriptionMatch = meta.match(/<meta name="description" content="(.*?)"/);
    const titleMatch = meta.match(/<title>(.*?)<\/title>/);
    const imageMatch = meta.match(/<meta property="og:image" content="(.*?)"/);

    // Get the base URL
    const baseUrl = new URL(url);
    const faviconUrl = faviconMatch ? new URL(faviconMatch[1], baseUrl).toString() : null;
    const imageUrl = imageMatch ? new URL(imageMatch[1], baseUrl).toString() : null;

    const result = {
      title: titleMatch ? titleMatch[1] : null,
      description: descriptionMatch ? descriptionMatch[1] : null,
      favicon: faviconUrl,
      image: imageUrl,
    };

    return c.json(result);
  } catch (error) {
    console.error("Error fetching URL:", error);
    return c.text("Internal Server Error", 500);
  }
});

export default app;
