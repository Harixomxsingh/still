import React, { useRef, useState } from 'react';
import { StyleSheet, View, PanResponder, Text } from 'react-native';
import * as Haptics from 'expo-haptics';

export const MobileSlider = ({ value = 0.5, onValueChange, label, percent, desc, accentColor = '#38bdf8' }) => {
  const [sliderWidth, setSliderWidth] = useState(240);
  const lastHapticStep = useRef(Math.round(value * 20));

  const updateValueFromGesture = (gestureState, layoutWidth) => {
    const width = layoutWidth || sliderWidth;
    if (width <= 0) return;
    const rawRatio = Math.max(0, Math.min(1, gestureState.x / width));
    
    // Trigger subtle haptic on every 5% step change
    const currentStep = Math.round(rawRatio * 20);
    if (currentStep !== lastHapticStep.current) {
      lastHapticStep.current = currentStep;
      try {
        Haptics.selectionAsync();
      } catch (e) {}
    }

    onValueChange(rawRatio);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX } = evt.nativeEvent;
        const rawRatio = Math.max(0, Math.min(1, locationX / sliderWidth));
        lastHapticStep.current = Math.round(rawRatio * 20);
        try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch(e) {}
        onValueChange(rawRatio);
      },
      onPanResponderMove: (evt) => {
        const { locationX } = evt.nativeEvent;
        const rawRatio = Math.max(0, Math.min(1, locationX / sliderWidth));
        const currentStep = Math.round(rawRatio * 20);
        if (currentStep !== lastHapticStep.current) {
          lastHapticStep.current = currentStep;
          try { Haptics.selectionAsync(); } catch(e) {}
        }
        onValueChange(rawRatio);
      }
    })
  ).current;

  const fillPercent = `${Math.round(value * 100)}%`;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.percentText, { color: accentColor }]}>{percent}%</Text>
      </View>

      {/* Touch Track */}
      <View
        style={styles.trackContainer}
        onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
        {...panResponder.panHandlers}
      >
        <View style={styles.trackBackground}>
          <View style={[styles.trackFill, { width: fillPercent, backgroundColor: accentColor }]} />
        </View>
        <View style={[styles.thumb, { left: fillPercent, marginLeft: -12, borderColor: accentColor, shadowColor: accentColor }]} />
      </View>

      {desc && <Text style={styles.desc}>{desc}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  label: {
    color: '#ffffff',
    fontSize: 13.5,
    fontWeight: '600'
  },
  percentText: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace'
  },
  trackContainer: {
    height: 36,
    justifyContent: 'center',
    position: 'relative'
  },
  trackBackground: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden'
  },
  trackFill: {
    height: '100%',
    backgroundColor: '#38bdf8',
    borderRadius: 3
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#38bdf8',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5
  },
  desc: {
    color: '#64748b',
    fontSize: 10.5,
    marginTop: 6
  }
});
