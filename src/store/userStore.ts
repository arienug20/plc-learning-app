export interface UserProgress {
  completed: number;
  total: number;
  score: number;
}

export interface UserAnswer {
  ladder: LadderElement[];
  correct: boolean;
  score: number;
}

export interface LadderElement {
  type: 'contact_no' | 'contact_nc' | 'coil' | 'timer_ton' | 'timer_tof' | 'counter_ctu';
  address: string;
  rung: number;
  position: number;
}

export interface UserProfile {
  id: string;
  name: string;
  createdAt: number;
  progress: Record<string, UserProgress>;
  answers: Record<string, UserAnswer>;
}

export interface AppData {
  users: Record<string, UserProfile>;
  activeUserId: string | null;
}

const STORAGE_KEY = 'plc_learning_app_data';

function generateId(): string {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function loadFromStorage(): AppData {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
  }
  return { users: {}, activeUserId: null };
}

function saveToStorage(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

let appData: AppData = loadFromStorage();

export const userStore = {
  getData(): AppData {
    return appData;
  },

  getActiveUser(): UserProfile | null {
    if (!appData.activeUserId || !appData.users[appData.activeUserId]) {
      return null;
    }
    return appData.users[appData.activeUserId];
  },

  createUser(name: string): UserProfile {
    const id = generateId();
    const user: UserProfile = {
      id,
      name,
      createdAt: Date.now(),
      progress: {},
      answers: {},
    };
    appData.users[id] = user;
    appData.activeUserId = id;
    saveToStorage(appData);
    return user;
  },

  switchUser(userId: string): boolean {
    if (appData.users[userId]) {
      appData.activeUserId = userId;
      saveToStorage(appData);
      return true;
    }
    return false;
  },

  deleteUser(userId: string): boolean {
    if (appData.users[userId]) {
      delete appData.users[userId];
      if (appData.activeUserId === userId) {
        const remainingIds = Object.keys(appData.users);
        appData.activeUserId = remainingIds.length > 0 ? remainingIds[0] : null;
      }
      saveToStorage(appData);
      return true;
    }
    return false;
  },

  updateUserProgress(caseId: string, progress: UserProgress): void {
    const user = this.getActiveUser();
    if (user) {
      user.progress[caseId] = progress;
      saveToStorage(appData);
    }
  },

  saveAnswer(questionId: string, answer: UserAnswer): void {
    const user = this.getActiveUser();
    if (user) {
      user.answers[questionId] = answer;
      saveToStorage(appData);
    }
  },

  getAnswer(questionId: string): UserAnswer | undefined {
    const user = this.getActiveUser();
    return user?.answers[questionId];
  },

  getAllUsers(): UserProfile[] {
    return Object.values(appData.users).sort((a, b) => a.createdAt - b.createdAt);
  },

  getTotalScore(): number {
    const user = this.getActiveUser();
    if (!user) return 0;
    return Object.values(user.progress).reduce((sum, p) => sum + p.score, 0);
  },

  getOverallProgress(): { completed: number; total: number } {
    const user = this.getActiveUser();
    if (!user) return { completed: 0, total: 0 };
    const completed = Object.values(user.progress).reduce((sum, p) => sum + p.completed, 0);
    const total = Object.values(user.progress).reduce((sum, p) => sum + p.total, 0);
    return { completed, total };
  },
};
