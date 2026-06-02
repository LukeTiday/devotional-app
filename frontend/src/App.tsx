import { useEffect, useState } from "react";

function App() {
  const [apiStatus, setApiStatus] = useState("Checking API...");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setApiStatus(data.status))
      .catch(() => setApiStatus("API unreachable"));
  }, []);

  return (
    <main>
      <h1>Devotional App</h1>
      <p>Minimal reading plans with progress tracking.</p>
      <p>API status: {apiStatus}</p>
    </main>
  );
}

export default App;