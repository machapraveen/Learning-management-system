import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Load the saved API key on component mount
  React.useEffect(() => {
    const loadApiKey = async () => {
      const savedKey = await AsyncStorage.getItem('GEMINI_API_KEY');
      if (savedKey) {
        setApiKey(savedKey);
        setIsSaved(true); // Mark as saved if key exists
      }
    };
    loadApiKey();
  }, []);

  // Save the API key to AsyncStorage
  const handleSave = async () => {
    if (!apiKey) {
      Alert.alert('Error', 'Please enter a valid API key.');
      return;
    }

    try {
      await AsyncStorage.setItem('GEMINI_API_KEY', apiKey);
      setIsSaved(true); // Mark as saved
      Alert.alert('Success', 'API key saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save the API key. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gemini API Key</Text>
      {isSaved ? (
        <Text style={styles.savedMessage}>API key is saved and hidden for security.</Text>
      ) : (
        <TextInput
          style={styles.input}
          placeholder="Enter your Gemini API key"
          value={apiKey}
          onChangeText={setApiKey}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true} // Hide the API key while typing
        />
      )}
      <Pressable style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  savedMessage: {
    fontSize: 16,
    color: '#28a745',
    marginBottom: 20,
  },
});

export default SettingsScreen;