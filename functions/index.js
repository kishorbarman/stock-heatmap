const functions = require("firebase-functions");

exports.quotes = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).send("");
    return;
  }

  try {
    const symbols = req.query.symbols || "";
    if (!symbols) {
      res.status(400).json({ error: "symbols parameter required" });
      return;
    }

    // Step 1: Get cookies from Yahoo
    const cookieRes = await fetch("https://fc.yahoo.com", {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const cookies = cookieRes.headers.getSetCookie();
    const cookieStr = cookies.map((c) => c.split(";")[0]).join("; ");

    // Step 2: Get crumb
    const crumbRes = await fetch(
      "https://query2.finance.yahoo.com/v1/test/getcrumb",
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Cookie: cookieStr,
        },
      }
    );
    const crumb = await crumbRes.text();

    // Step 3: Fetch quotes
    const quoteRes = await fetch(
      `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${symbols}&crumb=${encodeURIComponent(crumb)}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Cookie: cookieStr,
        },
      }
    );
    const data = await quoteRes.json();

    res.set("Cache-Control", "public, max-age=60, s-maxage=60");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});
