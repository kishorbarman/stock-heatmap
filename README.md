# Global Stock Heatmap

A high-performance, interactive visualization for major stock indices. The app currently supports **S&P 500 (US)** and **Nifty 100 (India)** via index tabs. It provides a real-time (approximate) overview using a treemap layout, where the size of each tile corresponds to market capitalization and the color indicates price performance over the last trading session.

![Stock Heatmap](public/screenshot.png) *(Placeholder for screenshot)*

## 🚀 Features

- **Multi-Index Tabs**: Switch between S&P 500 and Nifty 100 in one interface.
- **NIFTY 100 Support**: Includes India market constituents with Yahoo `.NS` quote mapping.
- **Interactive Treemap**: Visualize all constituents for the selected index in a single view.
- **Hierarchical Grouping**: Stocks are grouped by **Sector** and **Sub-Industry** for better context.
- **Market Cap Weighted**: Tile sizes dynamically scale based on the relative market capitalization of each company.
- **Performance-Based Coloring**:
  - 🟢 **Green**: Positive price change.
  - 🔴 **Red**: Negative price change.
  - ⚪ **Gray**: No change or unavailable data.
- **Real-time Data**: Fetches the latest quotes using a custom proxy to interface with market data providers.
- **Resilient Quote Fetching**: If Yahoo returns partial batch results (common with larger symbol lists), the app retries missing symbols in smaller chunks to reduce gray `0%` tiles.
- **Responsive Design**: Automatically adjusts layout based on screen size using D3 and ResizeObserver.
- **Detailed Tooltips**: Hover over any stock to see its full name, price, and percentage change.

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Data Visualization**: [D3.js](https://d3js.org/) (for treemap tiling and color scales)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Backend**: [Firebase Functions](https://firebase.google.com/docs/functions) (Node.js) acting as a CORS proxy for financial data.
- **Deployment**: [Firebase Hosting](https://firebase.google.com/docs/hosting)

## 📁 Project Structure

```text
src/
├── api/            # Data fetching logic and API integration
├── components/     # UI components (Heatmap, StockTile, Header, etc.)
├── data/           # Static index constituent data + index configs
├── hooks/          # Custom React hooks (useStockData, useResizeObserver)
├── types/          # TypeScript definitions
└── utils/          # Treemap layout algorithms and formatters
functions/          # Firebase Cloud Functions (Proxy server)
```

## 🏃 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- Firebase CLI (`npm install -g firebase-tools`)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd stock_heatmap
   ```

2. Install dependencies:
   ```bash
   npm install
   cd functions && npm install && cd ..
   ```

### Running Locally

1. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The project includes a custom Vite plugin (`yahoo-finance-proxy`) that automatically proxies requests to `/api/quotes` during development, so you don't need to run the backend functions locally.

2. (Optional) Run Firebase Functions locally to test the production proxy:
   ```bash
   firebase emulators:start
   ```

Note: By default, the app is configured to point to the production API or a local proxy. Ensure your `.env` (if applicable) is set up correctly.

### Deployment

To deploy the entire project to Firebase:

```bash
firebase deploy
```

If you changed the quote proxy logic, deploy both hosting and function together:

```bash
firebase deploy --only hosting,functions:quotes
```

## 🧠 How it Works

1.  **Data Fetching**: The app fetches the selected index's constituent data from local JSON files via a shared index configuration model. For NIFTY 100, symbols are mapped with the `.NS` suffix for Yahoo quotes.
2.  **Proxy API**: Since many financial APIs have CORS restrictions, a Firebase Cloud Function acts as a proxy, fetching real-time quotes from Yahoo Finance.
3.  **Retry Safety Net**: When batch quote responses are incomplete, the client retries only missing symbols in smaller batches before rendering.
4.  **Layout Engine**: The `treemapLayout.ts` utility uses D3's hierarchy and treemap modules to calculate the exact coordinates for each sector and stock tile based on the available screen real estate.
5.  **Rendering**: React components render the SVG-based heatmap, using Tailwind for styling and CSS transitions for smooth updates.

## ➕ Adding a New Market Tab

To add a market (for example, Japan):

1. Add a constituents file in `src/data/` (for example, `japan225-constituents.json`) with the same shape as existing market files.
2. Add a new config entry in `src/data/indexConfigs.ts` with:
   - `id`
   - `label`
   - `heatmapTitle`
   - `constituents`
   - Optional `excludedSymbols`
   - Optional `quoteSymbolTransformer` (for example, `withSuffix('.T')` for Yahoo Japan symbols)
3. Rebuild and deploy.

No UI code changes are needed for new tabs because the header tabs are generated from `MARKET_INDICES`.

## 🧾 Agent Notes (Implementation Summary)

This section is a compact memory aid for future agents making market/index changes.

- Tabs are config-driven from `MARKET_INDICES` in `src/data/indexConfigs.ts`.
- Quote symbol mapping is centralized in `getQuoteSymbol(...)` and can be customized per market via `quoteSymbolTransformer`.
- NIFTY uses `withSuffix('.NS')` as the reference example.
- Data loading is protected against stale async responses in `useStockData` using a request id guard.
- Loading copy is market-aware (`Loading {marketLabel} data...`) and should stay generic.
- If quote/proxy behavior changes, deploy both hosting and function:
  - `firebase deploy --only hosting,functions:quotes`

### New Market Checklist (Future Agent)

1. Add constituents JSON to `src/data/`.
2. Add one `MARKET_INDICES` entry in `src/data/indexConfigs.ts`.
3. Configure `quoteSymbolTransformer` if exchange suffix/rules are needed.
4. Run `npm run build` and verify the new tab loads quotes.
5. Deploy with functions when backend/proxy behavior is touched.

## 📄 License

MIT
