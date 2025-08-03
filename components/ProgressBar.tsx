import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressBarProps {
  progress: number;
  color?: string;
  showPercentage?: boolean;
  height?: number;
}

export default function ProgressBar({ 
  progress, 
  color = '#4A90E2', 
  showPercentage = true,
  height = 6 
}: ProgressBarProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.track, { height }]}>
        <View 
          style={[
            styles.fill,
            { 
              width: `${Math.min(Math.max(progress, 0), 100)}%`,
              backgroundColor: color,
              height 
            }
          ]} 
        />
      </View>
      {showPercentage && (
        <Text style={[styles.percentage, { color }]}>
          {Math.round(progress)}%
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  track: {
    flex: 1,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 3,
  },
  percentage: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 35,
    textAlign: 'right',
  },
});