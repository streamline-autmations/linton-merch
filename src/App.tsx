import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { BasketProvider } from '@/context/BasketContext'
import { Layout } from '@/components/Layout'
import { Home } from '@/pages/Home'
import { Catalogue } from '@/pages/Catalogue'
import { Quote } from '@/pages/Quote'
import { About } from '@/pages/About'
import { ProductPage } from '@/pages/Product'
import { Button } from '@/components/ui/button'

export default function App() {
  return (
    <BrowserRouter>
      <BasketProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="catalogue" element={<Catalogue />} />
            <Route path="quote" element={<Quote />} />
            <Route path="about" element={<About />} />
            <Route path="product/:slug" element={<ProductPage />} />
            <Route
              path="*"
              element={
                <section className="container-wide py-20 lg:py-28">
                  <span className="stitch mb-6 w-20 text-brand-teal" aria-hidden="true" />
                  <p className="eyebrow mb-5">Page not found</p>
                  <h1 className="page-title mb-6">That page doesn’t exist.</h1>
                  <p className="mb-8 max-w-md text-base leading-7 text-muted-foreground">
                    Find your way back to the catalogue or start again from home.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild>
                      <Link to="/">Back to home</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to="/catalogue">Browse the catalogue</Link>
                    </Button>
                  </div>
                </section>
              }
            />
          </Route>
        </Routes>
      </BasketProvider>
    </BrowserRouter>
  )
}
