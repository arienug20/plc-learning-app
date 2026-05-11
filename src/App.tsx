import { useState, useEffect } from 'react';
import { allCases } from './cases/allCases';
import { userStore } from './store/userStore';
import Sidebar from './components/Sidebar';
import QuestionPanel from './components/QuestionPanel';
import IOPanel from './components/IOPanel';
import UserProfile from './components/UserProfile';
import './App.css';

function App() {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [inputs, setInputs] = useState<Record<string, boolean>>({});
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!userStore.getActiveUser()) {
      userStore.createUser('User 1');
      setRefreshKey((k) => k + 1);
    }
  }, []);

  const currentCase = allCases.find((c) => c.id === selectedCase);
  const currentQuestion = currentCase?.questions[selectedQuestionIndex];
  const savedAnswer = currentQuestion ? userStore.getAnswer(currentQuestion.id) : undefined;

  const handleUserChange = () => {
    setRefreshKey((k) => k + 1);
  };

  const handleSelectCase = (caseId: string) => {
    setSelectedCase(caseId);
    setSelectedQuestionIndex(0);
  };

  const handleSubmitAnswer = (answer: { ladder: any[]; correct: boolean; score: number }) => {
    if (!currentCase || !currentQuestion) return;

    userStore.saveAnswer(currentQuestion.id, answer);

    const user = userStore.getActiveUser();
    if (user) {
      const caseProgress = user.progress[currentCase.id] || {
        completed: 0,
        total: currentCase.questions.length,
        score: 0,
      };

      if (answer.correct && !user.answers[currentQuestion.id]?.correct) {
        caseProgress.completed = Math.min(caseProgress.completed + 1, caseProgress.total);
      }

      caseProgress.score += answer.score;
      userStore.updateUserProgress(currentCase.id, caseProgress);
      setRefreshKey((k) => k + 1);
    }
  };

  const handleHint = () => {
  };

  const handleInputChange = (address: string, value: boolean) => {
    setInputs((prev) => ({ ...prev, [address]: value }));
  };

  const handleNextQuestion = () => {
    if (currentCase && selectedQuestionIndex < currentCase.questions.length - 1) {
      setSelectedQuestionIndex((i) => i + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (selectedQuestionIndex > 0) {
      setSelectedQuestionIndex((i) => i - 1);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>PLC Learning App</h1>
        <UserProfile onUserChange={handleUserChange} />
      </header>

      <div className="app-body">
        <Sidebar
          cases={allCases}
          selectedCase={selectedCase}
          onSelectCase={handleSelectCase}
          key={refreshKey}
        />

        <main className="app-main">
          {currentCase && currentQuestion ? (
            <>
              <div className="case-header">
                <h2>{currentCase.title}</h2>
                <p>{currentCase.description}</p>
              </div>

              <div className="question-navigation">
                <button
                  onClick={handlePrevQuestion}
                  disabled={selectedQuestionIndex === 0}
                >
                  ← Sebelumnya
                </button>
                <span>
                  Soal {selectedQuestionIndex + 1} / {currentCase.questions.length}
                </span>
                <button
                  onClick={handleNextQuestion}
                  disabled={
                    selectedQuestionIndex === currentCase.questions.length - 1
                  }
                >
                  Selanjutnya →
                </button>
              </div>

              <div className="content-grid">
                <div className="question-section">
                  <QuestionPanel
                    question={currentQuestion}
                    savedAnswer={savedAnswer}
                    onSubmit={handleSubmitAnswer}
                    onHint={handleHint}
                  />
                </div>

                <div className="io-section">
                  <IOPanel
                    ioAssignment={currentCase.ioAssignment}
                    inputs={inputs}
                    outputs={{}}
                    onInputChange={handleInputChange}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="welcome-screen">
              <h2>Selamat Datang di PLC Learning App</h2>
              <p>Pilih studi kasus di sidebar untuk mulai belajar.</p>
              <div className="features">
                <div className="feature">
                  <h3>📚 5 Studi Kasus Industri</h3>
                  <p>Motor DOL, Star-Delta, Traffic Light, Conveyor, Tank Level</p>
                </div>
                <div className="feature">
                  <h3>✏️ 50 Soal Latihan</h3>
                  <p>Susun ladder diagram dengan validasi otomatis</p>
                </div>
                <div className="feature">
                  <h3>👥 Multi-User</h3>
                  <p>Setiap user punya progress terpisah</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
