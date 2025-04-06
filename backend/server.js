require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const NodeCache = require("node-cache");
const cors = require("cors");

const app = express();
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

const puppeteer = require("puppeteer");

app.use(express.json());
app.use(cors());

async function fetchMetadata(url) {
  try {
    const cachedData = cache.get(url);
    if (cachedData) return cachedData;

    const { data } = await axios.get(url, { timeout: 5000 });
    const $ = cheerio.load(data);

    const title = $("meta[property='og:title']").attr("content") || $("title").text();
    console.log("title", title)
    const description = $("meta[property='og:description']").attr("content") || $("meta[name='description']").attr("content") || "No description available.";
    console.log("description", description)
    const image = $("meta[property='og:image']").attr("content") || "";

    const previewData = { url, title, description, image };
    cache.set(url, previewData);
    return previewData;
  } catch (error) {
    console.error(`Error fetching metadata for ${url}:`, error.message);
    return { url, title: "Unavailable", description: "Could not fetch metadata.", image: "" };
  }
}

app.post("/previews", async (req, res) => {
  const { urls } = req.body;
  if (!Array.isArray(urls) || urls.length === 0) return res.status(400).json({ error: "Invalid URLs" });

  const results = await Promise.all(urls.map(fetchMetadata));
  res.json(results);
});


async function captureScreenshot(url) {
  const cachedData = cache.get(url);
  if (cachedData) return {url: url, screenshot: `data:image/png;base64,${cachedData}`};;

  let browser;
  try {
    // Launch Puppeteer
    browser = await puppeteer.launch({
      headless: "new", // Use "new" headless mode for better rendering
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 15000 });

    // Take screenshot
    const screenshot = await page.screenshot({ encoding: "base64", fullPage: false });

    await browser.close();
    cache.set(url, screenshot);
    return {url: url, screenshot: `data:image/png;base64,${screenshot}`};
  } catch (error) {
    if (browser) await browser.close();
    console.error(`Screenshot failed for ${url}:`, error.message);
    return null;
  }
}

// API Route: Generate Website Screenshot
app.post("/screenshot", async (req, res) => {
  const urls = req.body.urls;

  if (!urls || urls.length === 0 ) return res.status(400).json({ error: "URL is required" });

  // const promises = []
  const result = []
  for (const url of urls) {
    const screenshot = await captureScreenshot(url);
    result.push(screenshot);
  }

  if (!result || result.length === 0) {
    return res.status(500).json({ error: "Failed to capture screenshot" });
  }
  res.json(result);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`📸 Screenshot API running on port ${PORT}`));

app.get("/", (req, res) => {
  res.send("Backend is running! Use POST /previews to fetch website previews.");
});