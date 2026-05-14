/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import UploadPage from "./pages/UploadPage";
import ViewPage from "./pages/ViewPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<UploadPage />} />
          <Route path="/view/:id" element={<ViewPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
