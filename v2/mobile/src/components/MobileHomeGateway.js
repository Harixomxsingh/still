import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking, SafeAreaView } from 'react-native';

export const MobileHomeGateway = ({ onEnter, onOpenAbout }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity 
        style={styles.fullScreenTouch} 
        activeOpacity={1} 
        onPress={onEnter}
      >
        
        {/* Top Badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>∞ NEURO-ACOUSTIC SANCTUARY</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Still</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          A distraction-free space for your mind and room. Zero algorithms. Instant peace.
        </Text>

        {/* Center Glowing Breathing Aura */}
        <View style={styles.auraWrapper}>
          <View style={styles.auraGlow} />
          <View style={styles.auraRing} />
          <View style={styles.auraCore}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity 
          style={styles.enterBtn} 
          onPress={onEnter}
          activeOpacity={0.8}
        >
          <Text style={styles.enterBtnText}>〰  Enter Calm Space</Text>
        </TouchableOpacity>

        {/* Tap hint */}
        <Text style={styles.hintText}>Tap anywhere to begin audio</Text>

        {/* About Button */}
        <TouchableOpacity 
          style={styles.aboutBtn} 
          onPress={onOpenAbout}
          activeOpacity={0.7}
        >
          <Text style={styles.aboutBtnText}>ℹ️  About & Science</Text>
        </TouchableOpacity>

        {/* Footer Credit */}
        <TouchableOpacity onPress={() => Linking.openURL('https://github.com/Harixomxsingh')}>
          <Text style={styles.footerCredit}>
            made by <Text style={styles.footerName}>hari</Text> with ❤️ & care
          </Text>
        </TouchableOpacity>

      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#05070d'
  },
  fullScreenTouch: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 25,
    paddingHorizontal: 20
  },
  badge: {
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 10
  },
  badgeText: {
    color: '#38bdf8',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.5
  },
  title: {
    color: '#ffffff',
    fontSize: 50,
    fontWeight: '800',
    letterSpacing: -1,
    marginTop: 4
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '300',
    maxWidth: 320
  },
  auraWrapper: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15
  },
  auraGlow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(56, 189, 248, 0.15)'
  },
  auraRing: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.35)'
  },
  auraCore: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(13, 19, 33, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 6
  },
  playIcon: {
    color: '#ffffff',
    fontSize: 18,
    marginLeft: 3
  },
  enterBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 28,
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 4
  },
  enterBtnText: {
    color: '#ffffff',
    fontSize: 13.5,
    fontWeight: '600'
  },
  hintText: {
    color: '#64748b',
    fontSize: 10.5,
    fontFamily: 'monospace',
    marginTop: -8
  },
  aboutBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6
  },
  aboutBtnText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '500'
  },
  footerCredit: {
    color: '#64748b',
    fontSize: 11,
    marginBottom: 5
  },
  footerName: {
    color: '#38bdf8',
    fontWeight: '600'
  }
});
