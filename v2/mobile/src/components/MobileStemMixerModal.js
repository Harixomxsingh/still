import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView } from 'react-native';

export const MobileStemMixerModal = ({ visible, onClose, stems, onStemChange, onResetStems }) => {
  const STEM_ITEMS = [
    { key: 'pads', label: '432 Hz Ambient Pads', desc: 'Harmonic Solfeggio synth swells' },
    { key: 'brownian', label: '1/f² Brownian Rumble', desc: 'Deep acoustic privacy mask' },
    { key: 'rain', label: 'Spatial Rainfall', desc: 'Soft bandpass raindrops' },
    { key: 'binaural', label: 'Binaural Brainwaves', desc: 'Alpha / Delta brainwave entrainment' },
    { key: 'piano', label: 'Eno Piano Drops', desc: 'Acoustic pentatonic droplets' }
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Audio Stem Layer Mixer</Text>
              <Text style={styles.subtitle}>Fine-tune each sound layer</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Stems List */}
          <ScrollView style={styles.list}>
            {STEM_ITEMS.map((item) => {
              const val = stems[item.key] ?? 0.5;
              const percent = Math.round(val * 100);

              return (
                <View key={item.key} style={styles.stemCard}>
                  <View style={styles.stemRow}>
                    <Text style={styles.stemLabel}>{item.label}</Text>
                    <Text style={styles.stemPercent}>{percent}%</Text>
                  </View>

                  {/* Level Adjustment Buttons */}
                  <View style={styles.buttonRow}>
                    {[0.1, 0.3, 0.5, 0.8, 1.0].map((level) => (
                      <TouchableOpacity
                        key={level}
                        style={[styles.levelBtn, Math.abs(val - level) < 0.12 && styles.levelBtnActive]}
                        onPress={() => onStemChange(item.key, level)}
                      >
                        <Text style={[styles.levelBtnText, Math.abs(val - level) < 0.12 && styles.levelBtnTextActive]}>
                          {Math.round(level * 100)}%
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.stemDesc}>{item.desc}</Text>
                </View>
              );
            })}
          </ScrollView>

          {/* Footer Reset */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetBtn} onPress={onResetStems}>
              <Text style={styles.resetBtnText}>↺ Reset to Calibrated</Text>
            </TouchableOpacity>
          </View>

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
    maxHeight: '80%'
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
  list: {
    marginTop: 12,
    marginBottom: 8
  },
  stemCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10
  },
  stemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  stemLabel: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600'
  },
  stemPercent: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'monospace'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
    marginBottom: 6
  },
  levelBtn: {
    flex: 1,
    paddingVertical: 5,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  levelBtnActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    borderColor: '#38bdf8'
  },
  levelBtnText: {
    color: '#94a3b8',
    fontSize: 10.5,
    fontWeight: '500'
  },
  levelBtnTextActive: {
    color: '#38bdf8',
    fontWeight: '700'
  },
  stemDesc: {
    color: '#64748b',
    fontSize: 10
  },
  footer: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center'
  },
  resetBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  resetBtnText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600'
  }
});
