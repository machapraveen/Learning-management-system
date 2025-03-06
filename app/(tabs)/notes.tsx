import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function NotesScreen() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const saveNote = async () => {
    if (!newNote.trim()) return;

    const note = {
      id: Date.now().toString(),
      text: newNote,
      branch: selectedBranch,
      timestamp: new Date().toISOString(),
    };

    const updatedNotes = [...notes, note];
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
      setNewNote('');
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const deleteNote = async (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const filteredNotes = selectedBranch === 'all'
    ? notes
    : notes.filter((note) => note.branch === selectedBranch);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView style={styles.notesContainer}>
        <Text style={styles.header}>My Notes</Text>
        
        <View style={styles.branchSelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Pressable
              style={[
                styles.branchButton,
                selectedBranch === 'all' && styles.selectedBranch,
              ]}
              onPress={() => setSelectedBranch('all')}>
              <Text
                style={[
                  styles.branchButtonText,
                  selectedBranch === 'all' && styles.selectedBranchText,
                ]}>
                All
              </Text>
            </Pressable>
            {['Business Understanding', 'Data Understanding', 'Data Preparation'].map(
              (branch) => (
                <Pressable
                  key={branch}
                  style={[
                    styles.branchButton,
                    selectedBranch === branch && styles.selectedBranch,
                  ]}
                  onPress={() => setSelectedBranch(branch)}>
                  <Text
                    style={[
                      styles.branchButtonText,
                      selectedBranch === branch && styles.selectedBranchText,
                    ]}>
                    {branch}
                  </Text>
                </Pressable>
              )
            )}
          </ScrollView>
        </View>

        {filteredNotes.map((note) => (
          <View key={note.id} style={styles.noteCard}>
            <View style={styles.noteHeader}>
              <Text style={styles.noteBranch}>{note.branch}</Text>
              <Pressable
                onPress={() => deleteNote(note.id)}
                style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={20} color="#dc3545" />
              </Pressable>
            </View>
            <Text style={styles.noteText}>{note.text}</Text>
            <Text style={styles.noteTimestamp}>
              {new Date(note.timestamp).toLocaleString()}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newNote}
          onChangeText={setNewNote}
          placeholder="Add a new note..."
          multiline
        />
        <Pressable style={styles.addButton} onPress={saveNote}>
          <Ionicons name="send" size={24} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  notesContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#212529',
  },
  branchSelector: {
    marginBottom: 16,
  },
  branchButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginRight: 8,
  },
  selectedBranch: {
    backgroundColor: '#0066cc',
  },
  branchButtonText: {
    color: '#495057',
  },
  selectedBranchText: {
    color: '#fff',
  },
  noteCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteBranch: {
    fontSize: 14,
    color: '#6c757d',
  },
  deleteButton: {
    padding: 4,
  },
  noteText: {
    fontSize: 16,
    color: '#212529',
    marginBottom: 8,
  },
  noteTimestamp: {
    fontSize: 12,
    color: '#6c757d',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
});