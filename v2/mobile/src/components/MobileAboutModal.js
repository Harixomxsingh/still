import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView, Linking } from 'react-native';

export const MobileAboutModal = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>About Still v2</Text>
              <Text style={styles.subtitle}>Origin, purpose & the science of calm</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Body */}
          <ScrollView style={styles.body}>
            
            {/* 1. Origin & Purpose */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>💬 Why I Built Still</Text>
              <Text style={styles.bodyText}>
                Recently, while sitting in my room working on my computer, I realized that calming ambient music had a profound ability to settle my racing thoughts and completely transform the room's atmosphere.
              </Text>
              <Text style={styles.bodyText}>
                Naturally, I’d open YouTube to connect my speaker and put on ambient music. But the moment I opened the app, I was instantly bombarded by algorithmic feeds, clickbait thumbnails, and recommendations. Before I knew it, an hour had evaporated—I went in seeking peace, but walked away distracted.
              </Text>
              <Text style={styles.bodyText}>
                The modern internet is engineered to capture your attention, not to give you stillness. I built Still to solve this single problem: a distraction-free space where calming your nervous system is the sole purpose.
              </Text>
              <TouchableOpacity onPress={() => Linking.openURL('https://github.com/Harixomxsingh')}>
                <Text style={styles.authorSign}>
                  — <Text style={{ color: '#38bdf8', fontWeight: '600' }}>hari</Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* 2. Neuro-Acoustic Science */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>🧠 Neuro-Acoustic Science</Text>
              <Text style={styles.bulletText}>• <Text style={styles.bold}>432 Hz Solfeggio Tuning:</Text> Acoustic resonance that encourages lower cortisol.</Text>
              <Text style={styles.bulletText}>• <Text style={styles.bold}>1/f² Brownian Noise:</Text> Masks distracting room noises and settles amygdala alarm responses.</Text>
              <Text style={styles.bulletText}>• <Text style={styles.bold}>0.1 Hz Resonant Breathing:</Text> Visual & haptic pacing at 6 breaths/min for peak HRV.</Text>
              <Text style={styles.bulletText}>• <Text style={styles.bold}>Binaural Entrainment:</Text> Guides brainwaves toward calm alpha and deep delta states.</Text>
            </View>

            {/* 3. Daily Rituals */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>🧭 3 Simple Daily Rituals</Text>
              <Text style={styles.bulletText}>💼 <Text style={styles.bold}>Focus Block:</Text> Put on headphones with Deep Flow to enter deep work.</Text>
              <Text style={styles.bulletText}>🌙 <Text style={styles.bold}>Sleep Wind Down:</Text> Set a 30m Sleep Timer with Deep Delta before bed.</Text>
              <Text style={styles.bulletText}>🫁 <Text style={styles.bold}>2-Min Reset:</Text> Inhale 4s, Hold 2s, Exhale 4s with the center halo.</Text>
            </View>

            {/* 4. Privacy Pledge */}
            <View style={styles.privacyRow}>
              <Text style={styles.privacyText}>🛡️ 100% Offline • Zero Trackers • Zero Ads</Text>
              <TouchableOpacity onPress={() => Linking.openURL('https://github.com/Harixomxsingh/still')}>
                <Text style={styles.gitLink}>GitHub ➔</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(4, 6, 12, 0.85)',
    justifyContent: 'flex-end'
  },
  modalCard: {
    backgroundColor: 'rgba(13, 19, 33, 0.98)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: 20,
    maxHeight: '85%'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700'
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600'
  },
  body: {
    marginTop: 12
  },
  sectionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8
  },
  bodyText: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '300',
    marginBottom: 6
  },
  authorSign: {
    color: '#64748b',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4
  },
  bulletText: {
    color: '#94a3b8',
    fontSize: 11.5,
    lineHeight: 17,
    marginBottom: 6
  },
  bold: {
    color: '#ffffff',
    fontWeight: '600'
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 20
  },
  privacyText: {
    color: '#64748b',
    fontSize: 11
  },
  gitLink: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '600'
  }
});
