import { useState } from "react";
import style from "./App.module.scss";
import AppRoutes from "./routes/Routes";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
