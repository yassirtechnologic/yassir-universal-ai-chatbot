import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

// Tu estructura actual
import Home from "./pages/Home";
import { ChatProvider } from "./context/ChatContext";

// Panel Admin (CORREGIDO con la ruta correcta)
import AdminLayout from "../admin/AdminLayout.jsx";
import LeadsTable from "../admin/LeadsTable.jsx";
import LeadDetails from "../admin/LeadDetails.jsx";

const App = () => {
  return (
    <ChatProvider>
      <HashRouter>

        <Routes>

          {/* Chatbot principal */}
          <Route path="/" element={<Home />} />

          {/* Panel de administración */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="leads" element={<LeadsTable />} />
            <Route path="lead/:id" element={<LeadDetails />} />
          </Route>

        </Routes>

      </HashRouter>
    </ChatProvider>
  );
};

export default App;





