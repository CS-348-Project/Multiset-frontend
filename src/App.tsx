import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Purchase } from "./pages/Purchase";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="purchase" element={<Purchase />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
