import React, { useEffect, useState } from "react";

const LeadsTable = () => {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/leads")
      .then((res) => res.json())
      .then((data) => setLeads(data));
  }, []);

  return (
    <div>
      <h2>Leads Recibidos</h2>
      <pre>{JSON.stringify(leads, null, 2)}</pre>
    </div>
  );
};

export default LeadsTable;
