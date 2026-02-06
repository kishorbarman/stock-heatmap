import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { Plugin } from 'vite'

function yahooFinanceProxy(): Plugin {
  return {
    name: 'yahoo-finance-proxy',
    configureServer(server) {
      server.middlewares.use('/api/quotes', async (req, res) => {
        try {
          const url = new URL(req.url!, `http://${req.headers.host}`)
          const symbols = url.searchParams.get('symbols') || ''

          // Step 1: Get cookies from Yahoo
          const cookieRes = await fetch('https://fc.yahoo.com', {
            headers: { 'User-Agent': 'Mozilla/5.0' },
          })
          const cookies = cookieRes.headers.getSetCookie()
          const cookieStr = cookies.map((c) => c.split(';')[0]).join('; ')

          // Step 2: Get crumb
          const crumbRes = await fetch(
            'https://query2.finance.yahoo.com/v1/test/getcrumb',
            {
              headers: {
                'User-Agent': 'Mozilla/5.0',
                Cookie: cookieStr,
              },
            }
          )
          const crumb = await crumbRes.text()

          // Step 3: Fetch quotes
          const quoteRes = await fetch(
            `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${symbols}&crumb=${encodeURIComponent(crumb)}`,
            {
              headers: {
                'User-Agent': 'Mozilla/5.0',
                Cookie: cookieStr,
              },
            }
          )
          const data = await quoteRes.json()

          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(data))
        } catch (err) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: String(err) }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), yahooFinanceProxy()],
})
