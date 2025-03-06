import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { generateQuestions } from '../utils/gemini';
import { useQuizStore } from '../data/quiz-store';
import { mainBranches } from '../data/branches';
import { useNavigation } from '@react-navigation/native';

const DAILY_QUESTION_LIMIT = 20;

export default function QuizScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    currentQuiz,
    setCurrentQuiz,
    answerQuestion,
    finishQuiz,
    attempts,
    loadAttempts,
    dailyQuestionCount,
    incrementDailyCount,
  } = useQuizStore();

  const navigation = useNavigation();  // Use navigation hook

  // Load attempts on component mount
  useEffect(() => {
    loadAttempts();
  }, [loadAttempts]);

  // Handle quiz selection
  const handleQuizSelect = async (topic: string) => {
    if (dailyQuestionCount >= DAILY_QUESTION_LIMIT) {
      Alert.alert(
        'Daily Limit Reached',
        'You have reached your daily limit of 20 questions. Please try again tomorrow!'
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const questions = await generateQuestions(topic, 5);
      if (!questions || questions.length === 0) {
        throw new Error('No questions generated. Please try again.');
      }
      setCurrentQuiz(questions, topic);
      incrementDailyCount();
    } catch (err) {
      setError(err.message || 'Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle answer selection
  const handleAnswer = async (answerIndex: number) => {
    if (!currentQuiz) return;
  
    answerQuestion(answerIndex);
  
    if (currentQuiz.currentIndex === currentQuiz.questions.length - 1) {
      const result = await finishQuiz();
  
      // Format the quiz result message
      const areasForImprovement = result.wrongAnswers
        .map(
          (wa) =>
            `• ${wa.question}\n` +
            `  Correct Answer: ${wa.correctAnswer}\n` +
            `  Explanation: ${wa.explanation}\n`
        )
        .join('\n');
  
      const message =
        `Your score: ${result.score}/${result.totalQuestions}\n\n` +
        `Areas for improvement:\n${areasForImprovement}`;
  
      Alert.alert('Quiz Complete!', message, [{ text: 'OK' }]);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Generating quiz questions...</Text>
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.button} onPress={() => setError(null)}>
          <Text style={styles.buttonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  // Render quiz selection screen if no quiz is active
  if (!currentQuiz || !currentQuiz.questions || currentQuiz.questions.length === 0) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Available Quizzes</Text>
          <Text style={styles.questionCount}>
            {DAILY_QUESTION_LIMIT - dailyQuestionCount} questions remaining today
          </Text>
        </View>

        {mainBranches.map((branch) => (
          <View key={branch.id} style={styles.branchContainer}>
            <Text style={styles.branchTitle}>{branch.title}</Text>
            {branch.subbranches.map((subbranch) => (
              <Pressable
                key={subbranch.id}
                style={styles.quizCard}
                onPress={() => handleQuizSelect(subbranch.title)}>
                <Text style={styles.quizTitle}>{subbranch.title}</Text>
                <Ionicons name="chevron-forward" size={24} color="#0066cc" />
              </Pressable>
            ))}
          </View>
        ))}

        {attempts.length > 0 && (
          <View style={styles.historyContainer}>
            <Text style={styles.historyTitle}>Recent Attempts</Text>
            {attempts.slice(0, 5).map((attempt) => (
              <View key={attempt.id} style={styles.historyCard}>
                <View>
                  <Text style={styles.historyTopic}>{attempt.topic}</Text>
                  <Text style={styles.historyDate}>
                    {new Date(attempt.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.historyScore}>
                  {attempt.score}/{attempt.totalQuestions}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Settings Button */}
        <Pressable
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.settingsButtonText}>Settings</Text>
        </Pressable>
      </ScrollView>
    );
  }

  // Get the current question
  const question = currentQuiz.questions[currentQuiz.currentIndex];

  // Render error if no question is found
  if (!question) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No question found. Please try again.</Text>
        <Pressable style={styles.button} onPress={() => setCurrentQuiz(null)}>
          <Text style={styles.buttonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  // Render the quiz question
  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.questionCount}>
          Question {currentQuiz.currentIndex + 1}/{currentQuiz.questions.length}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[ 
              styles.progressFill,
              {
                width: `${
                  (currentQuiz.currentIndex / currentQuiz.questions.length) * 100
                }%`,
              },
            ]}
          />
        </View>
      </View>

      <ScrollView style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.text}</Text>
        
        {question.options.map((option, index) => (
          <Pressable
            key={index}
            style={styles.optionButton}
            onPress={() => handleAnswer(index)}>
            <Text style={styles.optionText}>{option}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Settings Button */}
      <Pressable
        style={styles.settingsButton}
        onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.settingsButtonText}>Settings</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  branchContainer: {
    marginBottom: 24,
    padding: 16,
  },
  branchTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 12,
  },
  quizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quizTitle: {
    fontSize: 16,
    color: '#0066cc',
    flex: 1,
    marginRight: 8,
  },
  progressContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  questionCount: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0066cc',
    borderRadius: 2,
  },
  questionContainer: {
    flex: 1,
    padding: 16,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 24,
  },
  optionButton: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#495057',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c757d',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  historyContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 12,
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  historyTopic: {
    fontSize: 14,
    color: '#212529',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: '#6c757d',
  },
  historyScore: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0066cc',
  },
  settingsButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#0066cc',
    padding: 10,
    borderRadius: 8,
  },
  settingsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
