import { Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import PlanPage from "./pages/PlanPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/plans/:slug" element={<PlanPage />} />
      </Route>
    </Routes>
  );
}

export default App;