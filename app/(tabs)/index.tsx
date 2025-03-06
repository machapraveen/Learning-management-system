import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { mainBranches } from '../data/branches';

export default function LearnScreen() {
  const [expandedBranch, setExpandedBranch] = useState<string | null>(null);
  const [expandedSubBranch, setExpandedSubBranch] = useState<string | null>(null);

  const toggleBranch = (branchId: string) => {
    setExpandedBranch(expandedBranch === branchId ? null : branchId);
    setExpandedSubBranch(null);
  };

  const toggleSubBranch = (subBranchId: string) => {
    setExpandedSubBranch(expandedSubBranch === subBranchId ? null : subBranchId);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Project Management Methodology</Text>

      {mainBranches.map((branch) => (
        <View key={branch.id} style={styles.branchContainer}>
          <Pressable
            style={[
              styles.branchButton,
              expandedBranch === branch.id && styles.activeBranch,
            ]}
            onPress={() => toggleBranch(branch.id)}>
            <View style={styles.branchTitleContainer}>
              <Text
                style={[
                  styles.branchTitle,
                  expandedBranch === branch.id && styles.activeBranchText,
                ]}>
                {branch.title}
              </Text>
              {branch.description && (
                <Text
                  style={[
                    styles.branchDescription,
                    expandedBranch === branch.id && styles.activeBranchText,
                  ]}>
                  {branch.description}
                </Text>
              )}
            </View>
            <Ionicons
              name={expandedBranch === branch.id ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={expandedBranch === branch.id ? '#fff' : '#0066cc'}
            />
          </Pressable>

          {expandedBranch === branch.id && (
            <View style={styles.subbranches}>
              {branch.subbranches.map((subbranch) => (
                <View key={subbranch.id}>
                  <Pressable
                    style={[
                      styles.subbranchButton,
                      expandedSubBranch === subbranch.id && styles.activeSubbranch,
                    ]}
                    onPress={() => toggleSubBranch(subbranch.id)}>
                    <Text
                      style={[
                        styles.subbranchTitle,
                        expandedSubBranch === subbranch.id && styles.activeSubbranchText,
                      ]}>
                      {subbranch.title}
                    </Text>
                    {subbranch.subbranches && (
                      <Ionicons
                        name={
                          expandedSubBranch === subbranch.id
                            ? 'chevron-up'
                            : 'chevron-down'
                        }
                        size={20}
                        color={
                          expandedSubBranch === subbranch.id ? '#fff' : '#495057'
                        }
                      />
                    )}
                  </Pressable>

                  {expandedSubBranch === subbranch.id && subbranch.subbranches && (
                    <View style={styles.nestedSubbranches}>
                      {subbranch.subbranches.map((nested) => (
                        <View key={nested.id} style={styles.nestedSubbranchItem}>
                          <View style={styles.dot} />
                          <Text style={styles.nestedSubbranchText}>
                            {nested.title}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    padding: 16,
    paddingBottom: 8,
  },
  branchContainer: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  branchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  activeBranch: {
    backgroundColor: '#0066cc',
  },
  branchTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  branchTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0066cc',
    marginBottom: 4,
  },
  branchDescription: {
    fontSize: 14,
    color: '#6c757d',
  },
  activeBranchText: {
    color: '#fff',
  },
  subbranches: {
    marginTop: 8,
    paddingLeft: 16,
  },
  subbranchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  activeSubbranch: {
    backgroundColor: '#0066cc',
  },
  subbranchTitle: {
    fontSize: 16,
    color: '#495057',
    flex: 1,
    marginRight: 8,
  },
  activeSubbranchText: {
    color: '#fff',
  },
  nestedSubbranches: {
    marginTop: 8,
    paddingLeft: 12,
  },
  nestedSubbranchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6c757d',
    marginRight: 8,
  },
  nestedSubbranchText: {
    fontSize: 15,
    color: '#495057',
  },
});