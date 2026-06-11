/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import UploadPage from "./pages/UploadPage";
import ViewPage from "./pages/ViewPage";
import HistoryPage from "./pages/HistoryPage";
import InfoPage from "./pages/InfoPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<UploadPage />} />
          <Route path="/view/:id" element={<ViewPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/info" element={<InfoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
