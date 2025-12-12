import React from "react";
import { Outlet, Link } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Panel de Administración</h1>
      <nav>
        <Link to="/admin/leads">Leads</Link>
      </nav>
      <div style={{ marginTop: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
