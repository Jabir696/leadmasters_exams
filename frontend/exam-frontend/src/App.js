import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Exam from "./components/Exam";
import Result from "./components/Result";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [view, setView] = useState("login");
  const [score, setScore] = useState(0);

  return (
    <div>
      {view === "login" && <Login setToken={setToken} setView={setView} />}
      {view === "register" && <Register setView={setView} />}
      {view === "exam" && <Exam token={token} setScore={setScore} setView={setView} />}
      {view === "result" && <Result score={score} />}
    </div>
  );
}

export default App;
