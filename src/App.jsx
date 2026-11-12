import { useState } from "react";
import Dashboard from "./components/Dashboard.jsx";

export default function App() {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const toggleForm = (value) =>
    setIsFormVisible((current) =>
      typeof value === "boolean" ? value : !current,
    );

  return <Dashboard isFormVisible={isFormVisible} toggleForm={toggleForm} />;
}
