import "./App.css";
import MainScreen from "./pages/MainScreen";
import SearchResultsPage from "./pages/SearchResultsScreen";
import BuildingDetailScreen from "./pages/BuildingDetailScreen";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/buildings/:id" element={<BuildingDetailScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
