import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "./components/Layout"
import RealEstate from "./components/RealEstate"
import { QueryHistory } from "./components/QueryHistory"

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<RealEstate />} />
          <Route path="history" element={<QueryHistory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
