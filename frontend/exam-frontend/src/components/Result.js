export default function Result({ score }) {
  return (
    <div className="result-container">
      <div className="result-card">
        <h2>Exam Finished</h2>
        <p>Your Score: <strong>{score}</strong></p>
      </div>

      <style>
        {`
          .result-container {
            display: flex; justify-content: center; align-items: center;
            height: 100vh; background-color: #f4f6f8;
          }
          .result-card {
            background: white; padding: 2rem; border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1); text-align: center;
          }
          .result-card h2 { font-size: 1.8rem; margin-bottom: 1rem; }
          .result-card p { font-size: 1.2rem; }
        `}
      </style>
    </div>
  );
}
