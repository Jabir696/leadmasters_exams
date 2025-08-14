import { useEffect, useState, useRef } from "react";

export default function Exam({ token, setScore, setView }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [time, setTime] = useState(30 * 60);
  const answersRef = useRef(answers);
  useEffect(() => { answersRef.current = answers; }, [answers]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/questions", {
      headers: { "Authorization": "Bearer " + token }
    })
      .then(res => res.json())
      .then(data => setQuestions(data.questions || []))
      .catch(() => setQuestions([]));
  }, [token]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(t => {
        if (t <= 1) {
          handleSubmit(answersRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (finalAnswers = answers) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ answers: finalAnswers })
      });
      const data = await res.json();
      setScore(data.score ?? 0);
      setView("result");
    } catch {
      alert("Submit failed. Please try again.");
    }
  };

  if (questions.length === 0) return <div>Loading...</div>;
  const q = questions[current];

  return (
    <div className="exam-container">
      <div className="exam-card">
        <div className="exam-header">
          <h3>Time Remaining: {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}</h3>
          <h4>{q.question_text}</h4>
        </div>
        <div className="options">
          {["option_a", "option_b", "option_c", "option_d"].map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            return (
              <label key={opt} className="option-label">
                <input
                  type="radio"
                  name={`q_${q.id}`}
                  onChange={() => setAnswers({ ...answers, [q.id]: letter })}
                  checked={answers[q.id] === letter}
                />
                <span>{q[opt]}</span>
              </label>
            );
          })}
        </div>
        <div className="buttons">
          <button disabled={current === 0} onClick={() => setCurrent(c => c - 1)}>Previous</button>
          <button disabled={current === questions.length - 1} onClick={() => setCurrent(c => c + 1)}>Next</button>
          <button onClick={() => handleSubmit()}>Submit Exam</button>
        </div>
      </div>

      <style>
        {`
          .exam-container {
            display: flex; justify-content: center; padding: 2rem;
            background-color: #f8fafc; min-height: 100vh;
          }
          .exam-card {
            background: white; padding: 2rem; border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 600px;
          }
          .exam-header h3 { color: #ef4444; margin-bottom: 1rem; }
          .exam-header h4 { font-size: 1.2rem; margin-bottom: 1rem; }
          .options { margin: 1rem 0; }
          .option-label {
            display: block; background: #f1f5f9; padding: 0.5rem;
            border-radius: 5px; margin-bottom: 0.5rem; cursor: pointer;
          }
          .option-label:hover { background: #e2e8f0; }
          .buttons button {
            margin-right: 0.5rem; padding: 0.5rem 1rem; border: none;
            border-radius: 5px; cursor: pointer; color: white;
          }
          .buttons button:nth-child(1) { background: #6b7280; }
          .buttons button:nth-child(2) { background: #2563eb; }
          .buttons button:nth-child(3) { background: #16a34a; }
          .buttons button:disabled { opacity: 0.5; cursor: not-allowed; }
        `}
      </style>
    </div>
  );
}
