import React, { useState } from 'react';
import type { Question } from '../cases/dolMotor';
import type { LadderElement, UserAnswer } from '../store/userStore';
import LadderEditor from './LadderEditor';
import { validateAnswer } from '../engine/ladderEngine';
import './QuestionPanel.css';

interface QuestionPanelProps {
  question: Question;
  savedAnswer?: UserAnswer;
  onSubmit: (answer: UserAnswer) => void;
  onHint: () => void;
}

const QuestionPanel: React.FC<QuestionPanelProps> = ({
  question,
  savedAnswer,
  onSubmit,
  onHint,
}) => {
  const [elements, setElements] = useState<LadderElement[]>(
    savedAnswer?.ladder || []
  );
  const [result, setResult] = useState<{
    correct: boolean;
    score: number;
    feedback: string;
  } | null>(savedAnswer ? { correct: savedAnswer.correct, score: savedAnswer.score, feedback: '' } : null);
  const [showHint, setShowHint] = useState(false);

  const handleCheck = () => {
    const validation = validateAnswer(elements, question.expectedAnswer);
    setResult(validation);
    onSubmit({
      ladder: elements,
      correct: validation.correct,
      score: validation.score,
    });
  };

  const handleReset = () => {
    setElements([]);
    setResult(null);
    setShowHint(false);
  };

  const handleShowHint = () => {
    setShowHint(true);
    onHint();
  };

  return (
    <div className="question-panel">
      <div className="question-header">
        <h3>{question.title}</h3>
        <div className="question-meta">
          <span>Max Rungs: {question.maxRungs}</span>
        </div>
      </div>

      <div className="question-description">
        <p>{question.description}</p>
      </div>

      {showHint && (
        <div className="hint-box">
          <strong>Hint:</strong> {question.hint}
        </div>
      )}

      <LadderEditor
        elements={elements}
        onChange={setElements}
        maxRungs={question.maxRungs}
        highlightedRungs={result?.correct ? Array.from({ length: question.maxRungs }, (_, i) => i) : []}
      />

      <div className="question-actions">
        <button className="btn-primary" onClick={handleCheck}>
          Check Answer
        </button>
        <button className="btn-secondary" onClick={handleReset}>
          Reset
        </button>
        <button className="btn-hint" onClick={handleShowHint}>
          Hint
        </button>
      </div>

      {result && (
        <div className={`result-box ${result.correct ? 'correct' : 'incorrect'}`}>
          <div className="result-score">Score: {result.score}%</div>
          <div className="result-feedback">{result.feedback}</div>
          {result.correct && <div className="result-icon">✓</div>}
        </div>
      )}
    </div>
  );
};

export default QuestionPanel;
