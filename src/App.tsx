import React from "react";
import "./App.css";
import MainScreen from "./components/MainScreen";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <MainScreen />
      </div>
    </BrowserRouter>
  );
}

export default App;
