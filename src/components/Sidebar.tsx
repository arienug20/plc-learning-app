import React from 'react';
import type { CaseStudy } from '../cases/dolMotor';
import { userStore } from '../store/userStore';
import './Sidebar.css';

interface SidebarProps {
  cases: CaseStudy[];
  selectedCase: string | null;
  onSelectCase: (caseId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  cases,
  selectedCase,
  onSelectCase,
}) => {
  const user = userStore.getActiveUser();
  const overallProgress = userStore.getOverallProgress();
  const totalScore = userStore.getTotalScore();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>PLC Learning</h2>
        {user && (
          <div className="user-stats">
            <div className="stat">
              <span className="stat-value">{overallProgress.completed}</span>
              <span className="stat-label">Soal Selesai</span>
            </div>
            <div className="stat">
              <span className="stat-value">{totalScore}</span>
              <span className="stat-label">Total Score</span>
            </div>
          </div>
        )}
      </div>

      <div className="case-list">
        {cases.map((caseStudy) => {
          const progress = user?.progress[caseStudy.id];
          const completed = progress?.completed || 0;
          const total = progress?.total || caseStudy.questions.length;
          const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <div
              key={caseStudy.id}
              className={`case-item ${selectedCase === caseStudy.id ? 'selected' : ''}`}
              onClick={() => onSelectCase(caseStudy.id)}
            >
              <div className="case-info">
                <h3>{caseStudy.title}</h3>
                <div className="case-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="progress-text">
                    {completed}/{total} ({percentage}%)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
