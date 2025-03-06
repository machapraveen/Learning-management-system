import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Question } from '../utils/gemini';
import { format } from 'date-fns';

interface QuizAttempt {
  id: string;
  date: string;
  topic: string;
  score: number;
  totalQuestions: number;
  wrongAnswers: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    explanation: string;
  }[];
}

interface QuizStore {
  currentQuiz: {
    questions: Question[];
    currentIndex: number;
    answers: number[];
    topic: string;
  } | null;
  attempts: QuizAttempt[];
  dailyQuestionCount: number;
  lastQuizDate: string;
  setCurrentQuiz: (questions: Question[], topic: string) => void;
  answerQuestion: (answerIndex: number) => void;
  finishQuiz: () => Promise<QuizAttempt>;
  loadAttempts: () => Promise<void>;
  resetDailyCount: () => void;
  incrementDailyCount: () => void;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  currentQuiz: null,
  attempts: [],
  dailyQuestionCount: 0,
  lastQuizDate: '',

  setCurrentQuiz: (questions, topic) => {
    set({
      currentQuiz: {
        questions,
        currentIndex: 0,
        answers: [],
        topic,
      },
    });
  },

  answerQuestion: (answerIndex) => {
    const { currentQuiz } = get();
    if (!currentQuiz) return;

    const newAnswers = [...currentQuiz.answers, answerIndex];
    set({
      currentQuiz: {
        ...currentQuiz,
        currentIndex: currentQuiz.currentIndex + 1,
        answers: newAnswers,
      },
    });
  },

  finishQuiz: async () => {
    const { currentQuiz } = get();
    if (!currentQuiz) throw new Error('No active quiz');

    const wrongAnswers = currentQuiz.questions
      .map((q, idx) => ({
        question: q.text,
        userAnswer: q.options[currentQuiz.answers[idx]],
        correctAnswer: q.options[q.correctAnswer],
        explanation: q.explanation,
      }))
      .filter((_, idx) => currentQuiz.answers[idx] !== currentQuiz.questions[idx].correctAnswer);

    const score = currentQuiz.questions.reduce(
      (acc, q, idx) => (currentQuiz.answers[idx] === q.correctAnswer ? acc + 1 : acc),
      0
    );

    const attempt: QuizAttempt = {
      id: `quiz-${Date.now()}`,
      date: new Date().toISOString(),
      topic: currentQuiz.topic,
      score,
      totalQuestions: currentQuiz.questions.length,
      wrongAnswers,
    };

    const { attempts } = get();
    const newAttempts = [attempt, ...attempts];
    await AsyncStorage.setItem('quiz-attempts', JSON.stringify(newAttempts));
    
    set({
      attempts: newAttempts,
      currentQuiz: null,
    });

    return attempt;
  },

  loadAttempts: async () => {
    try {
      const [attemptsData, lastDate, count] = await Promise.all([
        AsyncStorage.getItem('quiz-attempts'),
        AsyncStorage.getItem('last-quiz-date'),
        AsyncStorage.getItem('daily-question-count'),
      ]);

      const today = format(new Date(), 'yyyy-MM-dd');
      const attempts = attemptsData ? JSON.parse(attemptsData) : [];
      
      if (lastDate !== today) {
        await AsyncStorage.setItem('last-quiz-date', today);
        await AsyncStorage.setItem('daily-question-count', '0');
        set({ lastQuizDate: today, dailyQuestionCount: 0 });
      } else {
        set({
          lastQuizDate: lastDate,
          dailyQuestionCount: count ? parseInt(count, 10) : 0,
        });
      }

      set({ attempts });
    } catch (error) {
      console.error('Error loading quiz attempts:', error);
    }
  },

  resetDailyCount: () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    AsyncStorage.setItem('last-quiz-date', today);
    AsyncStorage.setItem('daily-question-count', '0');
    set({ lastQuizDate: today, dailyQuestionCount: 0 });
  },

  incrementDailyCount: () => {
    const { dailyQuestionCount } = get();
    const newCount = dailyQuestionCount + 1;
    AsyncStorage.setItem('daily-question-count', newCount.toString());
    set({ dailyQuestionCount: newCount });
  },
}));