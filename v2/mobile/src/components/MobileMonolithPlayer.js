import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking, SafeAreaView, Platform, StatusBar } from 'react-native';
import { MobileBreathingOrb } from './MobileBreathingOrb';

export const MobileMonolithPlayer = ({
  track,
  quote,
  isPlaying,
  sleepTimer,
  theme,
  onTogglePlay,
  onNext,
  onPrev,
  onCycleTimer,
  onCycleTheme,
  onOpenLibrary,
  onOpenMixer,
  onOpenAbout,
  onOpenNote
}) => {
  const accent = theme?.accent || '#38bdf8';
  const cardBg = theme?.cardBg || 'rgba(13, 19, 33, 0.88)';
  const themeBg = theme?.bg || '#05070d';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeBg }]}>
      <View style={styles.container}>
        
        {/* 1. Brand Header & Daily Quote */}
        <View style={styles.topSection}>
          <View style={styles.brandRow}>
            <Text style={styles.brandTitle}>STILL</Text>
            <View style={[styles.freqPill, { borderColor: accent + '4D', backgroundColor: accent + '1A' }]}>
              <Text style={[styles.freqText, { color: accent }]}>0.1 HZ</Text>
            </View>
          </View>

          {quote && (
            <View style={styles.quoteBox}>
              <Text style={styles.quoteText}>“{quote.text}”</Text>
              <Text style={[styles.quoteAuthor, { color: accent }]}>— {quote.author}</Text>
            </View>
          )}
        </View>

        {/* 2. Resonant Animated Breathing Halo */}
        <MobileBreathingOrb isPlaying={isPlaying} onTogglePlay={onTogglePlay} theme={theme} />

        {/* 3. Track Details & Science Section */}
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle}>{track.title}</Text>
          <View style={[styles.sciencePill, { borderColor: accent + '33' }]}>
            <Text style={[styles.scienceText, { color: accent }]}>{track.science}</Text>
          </View>
          <Text style={styles.trackDesc} numberOfLines={2}>{track.description}</Text>
        </View>

        {/* 4. Monolith Console Glass Box */}
        <View style={[styles.consoleCard, { backgroundColor: cardBg }]}>
          
          {/* Playback Row */}
          <View style={styles.playbackRow}>
            <TouchableOpacity style={styles.roundBtn} onPress={onPrev}>
              <Text style={styles.btnIcon}>⏮</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.masterPlayBtn} onPress={onTogglePlay} activeOpacity={0.8}>
              <Text style={styles.masterPlayIcon}>{isPlaying ? '❚❚' : '▶'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.roundBtn} onPress={onNext}>
              <Text style={styles.btnIcon}>⏭</Text>
            </TouchableOpacity>
          </View>

          {/* Unified Utility Row (Library, Mixer, Timer, About, Note, Theme) */}
          <View style={styles.utilityRow}>
            <TouchableOpacity style={styles.pillBtn} onPress={onOpenLibrary}>
              <Text style={styles.pillBtnText}>Library</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.pillBtn} onPress={onOpenMixer}>
              <Text style={styles.pillBtnText}>Mixer</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.pillBtn, 
                styles.timerBtn, 
                sleepTimer !== null && { borderColor: accent, backgroundColor: accent + '26' }
              ]} 
              onPress={onCycleTimer}
            >
              <Text style={[styles.pillBtnText, sleepTimer !== null && { color: accent, fontWeight: '700' }]}>
                🕒 {sleepTimer !== null 
                  ? `${Math.floor(sleepTimer / 60)}:${sleepTimer % 60 < 10 ? '0' : ''}${sleepTimer % 60}` 
                  : '∞'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconBtn} onPress={onOpenAbout}>
              <Text style={styles.iconBtnText}>ℹ️</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconBtn} onPress={onOpenNote}>
              <Text style={styles.iconBtnText}>✉️</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.iconBtn, { borderColor: accent + '66' }]} onPress={onCycleTheme}>
              <Text style={styles.iconBtnText}>{theme?.icon || '🌙'}</Text>
            </TouchableOpacity>
          </View>

        </View>

        {/* 5. Creator Signature */}
        <TouchableOpacity onPress={() => Linking.openURL('https://github.com/Harixomxsingh')}>
          <Text style={styles.creatorCredit}>
            made by <Text style={{ color: accent, fontWeight: '600' }}>hari</Text> with ❤️ & care
          </Text>
        </TouchableOpacity>

        {/* 6. Discreet Bottom-Right Version Watermark */}
        <Text style={styles.versionWatermark}>v2.0.0</Text>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#05070d',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 12 : 0
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingBottom: Platform.OS === 'android' ? 24 : 16,
    paddingHorizontal: 20
  },
  topSection: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 2,
    marginBottom: 4
  },
  brandTitle: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2
  },
  freqPill: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  freqText: {
    color: '#38bdf8',
    fontSize: 9.5,
    fontWeight: '600',
    fontFamily: 'monospace'
  },
  quoteBox: {
    marginTop: 8,
    paddingHorizontal: 15,
    alignItems: 'center'
  },
  quoteText: {
    color: '#94a3b8',
    fontSize: 11,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 15
  },
  quoteAuthor: {
    color: '#38bdf8',
    fontSize: 9.5,
    fontWeight: '600',
    marginTop: 2
  },
  orbWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10
  },
  orbCore: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(13, 19, 33, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 6
  },
  orbActive: {
    borderColor: '#38bdf8',
    shadowOpacity: 0.8,
    shadowRadius: 30
  },
  playIconText: {
    color: '#ffffff',
    fontSize: 22,
    marginBottom: 4
  },
  breathText: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1.5
  },
  trackInfo: {
    alignItems: 'center',
    paddingHorizontal: 15
  },
  trackTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4
  },
  sciencePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 6
  },
  scienceText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '500'
  },
  trackDesc: {
    color: '#94a3b8',
    fontSize: 11.5,
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: 300
  },
  consoleCard: {
    width: '100%',
    backgroundColor: 'rgba(13, 19, 33, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    padding: 16,
    gap: 12
  },
  playbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20
  },
  roundBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnIcon: {
    color: '#ffffff',
    fontSize: 14
  },
  masterPlayBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8
  },
  masterPlayIcon: {
    color: '#09090b',
    fontSize: 18
  },
  utilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)'
  },
  pillBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5
  },
  pillBtnText: {
    color: '#ffffff',
    fontSize: 10.5,
    fontWeight: '500'
  },
  timerBtn: {
    minWidth: 50,
    alignItems: 'center'
  },
  timerBtnActive: {
    borderColor: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.15)'
  },
  timerTextActive: {
    color: '#38bdf8',
    fontWeight: '700'
  },
  iconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconBtnText: {
    fontSize: 11
  },
  creatorCredit: {
    color: '#64748b',
    fontSize: 10.5
  },
  versionWatermark: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    fontSize: 9.5,
    fontFamily: 'monospace',
    color: '#334155',
    opacity: 0.35
  }
});
