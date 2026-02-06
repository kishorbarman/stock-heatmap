# S&P 500 Stock Heatmap

A high-performance, interactive visualization of the S&P 500 index. This application provides a real-time (approximate) overview of the stock market performance using a treemap layout, where the size of each tile corresponds to its market capitalization and the color indicates its price performance over the last trading session.

![Stock Heatmap](public/screenshot.png) *(Placeholder for screenshot)*

## 🚀 Features

- **Interactive Treemap**: Visualize all S&P 500 constituents in a single view.
- **Hierarchical Grouping**: Stocks are grouped by **Sector** and **Sub-Industry** for better context.
- **Market Cap Weighted**: Tile sizes dynamically scale based on the relative market capitalization of each company.
- **Performance-Based Coloring**:
  - 🟢 **Green**: Positive price change.
  - 🔴 **Red**: Negative price change.
  - ⚪ **Gray**: No change or unavailable data.
- **Real-time Data**: Fetches the latest quotes using a custom proxy to interface with market data providers.
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
├── components/     # UI components (Heatmap, SectorGroup, StockTile, etc.)
├── data/           # Static data (S&P 500 constituents)
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

## 🧠 How it Works

1.  **Data Fetching**: The app fetches S&P 500 constituent data from a local JSON file.
2.  **Proxy API**: Since many financial APIs have CORS restrictions, a Firebase Cloud Function acts as a proxy, fetching real-time quotes from Yahoo Finance.
3.  **Layout Engine**: The `treemapLayout.ts` utility uses D3's hierarchy and treemap modules to calculate the exact coordinates for each sector and stock tile based on the available screen real estate.
4.  **Rendering**: React components render the SVG-based heatmap, using Tailwind for styling and CSS transitions for smooth updates.

## 📄 License

MIT