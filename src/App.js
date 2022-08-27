import React from "react";
import './App.css';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RestaurantsContextProvider } from "./context/RestaurantsContext";
import Home from "./routes/Home";
import RestaurantDetailPage from "./routes/RestaurantDetailPage";
import UpdatePage from "./routes/UpdatePage";

const App = () => {
  return (
  <RestaurantsContextProvider>
    <Router>
      <div className="container appContainer">
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/restaurants/:id" element={<RestaurantDetailPage />}/>
          <Route path="/restaurants/:id/update" element={<UpdatePage />}/>
        </Routes>
      </div>
    </Router>
  </RestaurantsContextProvider>
  );
}

export default App;
