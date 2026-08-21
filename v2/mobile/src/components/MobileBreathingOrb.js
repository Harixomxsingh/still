import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing } from 'react-native';
import * as Haptics from 'expo-haptics';

export const MobileBreathingOrb = ({ isPlaying, onTogglePlay, theme }) => {
  const [breathPhase, setBreathPhase] = useState('Breathe');

  // Animation values
  const coreScale = useRef(new Animated.Value(1)).current;
  const glowScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.4)).current;
  const ringScale = useRef(new Animated.Value(1)).current;
  const ringOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (!isPlaying) {
      setBreathPhase('Breathe');
      Animated.timing(coreScale, { toValue: 1, duration: 600, useNativeDriver: true }).start();
      Animated.timing(glowScale, { toValue: 1, duration: 600, useNativeDriver: true }).start();
      Animated.timing(glowOpacity, { toValue: 0.4, duration: 600, useNativeDriver: true }).start();
      Animated.timing(ringScale, { toValue: 1, duration: 600, useNativeDriver: true }).start();
      return;
    }

    let isMounted = true;

    const runCycle = () => {
      if (!isMounted) return;

      // 1. INHALE (4 Seconds)
      setBreathPhase('Inhale');
      try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch (e) {}

      Animated.parallel([
        Animated.timing(coreScale, {
          toValue: 1.16,
          duration: 4000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true
        }),
        Animated.timing(glowScale, {
          toValue: 1.48,
          duration: 4000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.95,
          duration: 4000,
          easing: Easing.linear,
          useNativeDriver: true
        }),
        Animated.timing(ringScale, {
          toValue: 1.35,
          duration: 4000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true
        }),
        Animated.timing(ringOpacity, {
          toValue: 0.85,
          duration: 4000,
          useNativeDriver: true
        })
      ]).start(() => {
        if (!isMounted) return;

        // 2. HOLD (2 Seconds)
        setBreathPhase('Hold');

        setTimeout(() => {
          if (!isMounted) return;

          // 3. EXHALE (4 Seconds)
          setBreathPhase('Exhale');
          try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch (e) {}

          Animated.parallel([
            Animated.timing(coreScale, {
              toValue: 0.95,
              duration: 4000,
              easing: Easing.bezier(0.4, 0, 0.2, 1),
              useNativeDriver: true
            }),
            Animated.timing(glowScale, {
              toValue: 0.92,
              duration: 4000,
              easing: Easing.bezier(0.4, 0, 0.2, 1),
              useNativeDriver: true
            }),
            Animated.timing(glowOpacity, {
              toValue: 0.35,
              duration: 4000,
              useNativeDriver: true
            }),
            Animated.timing(ringScale, {
              toValue: 0.95,
              duration: 4000,
              easing: Easing.bezier(0.4, 0, 0.2, 1),
              useNativeDriver: true
            }),
            Animated.timing(ringOpacity, {
              toValue: 0.25,
              duration: 4000,
              useNativeDriver: true
            })
          ]).start(() => {
            if (!isMounted) return;
            runCycle();
          });

        }, 2000); // 2s hold
      });
    };

    runCycle();

    return () => {
      isMounted = false;
    };
  }, [isPlaying]);

  const accentColor = theme?.accent || '#38bdf8';
  const glowColor = theme?.accentGlow || 'rgba(56, 189, 248, 0.4)';
  const cardBgColor = theme?.cardBg || 'rgba(13, 19, 33, 0.95)';

  return (
    <View style={styles.container}>
      {/* Expanding Outer Ring */}
      <Animated.View
        style={[
          styles.ring,
          {
            borderColor: accentColor,
            transform: [{ scale: ringScale }],
            opacity: ringOpacity
          }
        ]}
      />

      {/* Luminous Glow Disc */}
      <Animated.View
        style={[
          styles.glow,
          {
            backgroundColor: glowColor,
            shadowColor: accentColor,
            transform: [{ scale: glowScale }],
            opacity: glowOpacity
          }
        ]}
      />

      {/* Core Sphere */}
      <Animated.View
        style={[
          styles.coreWrapper,
          {
            transform: [{ scale: coreScale }]
          }
        ]}
      >
        <TouchableOpacity
          style={[
            styles.coreSphere,
            { backgroundColor: cardBgColor, borderColor: isPlaying ? accentColor : 'rgba(255, 255, 255, 0.15)' }
          ]}
          onPress={onTogglePlay}
          activeOpacity={0.85}
        >
          <Text style={styles.playIcon}>{isPlaying ? '❚❚' : '▶'}</Text>
          <Text style={styles.breathText}>{breathPhase}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 170,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    position: 'relative'
  },
  ring: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1.5,
    borderColor: '#38bdf8'
  },
  glow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(56, 189, 248, 0.4)',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 25,
    elevation: 10
  },
  coreWrapper: {
    zIndex: 10
  },
  coreSphere: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(13, 19, 33, 0.95)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 8
  },
  coreActive: {
    borderColor: '#38bdf8',
    shadowOpacity: 0.9,
    shadowRadius: 30
  },
  playIcon: {
    color: '#ffffff',
    fontSize: 22,
    marginBottom: 4,
    marginLeft: 2
  },
  breathText: {
    color: '#94a3b8',
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase'
  }
});
