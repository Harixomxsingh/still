import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { MobileSlider } from './MobileSlider';

export const MobileStemMixerModal = ({ visible, onClose, stems, onStemChange, onResetStems, theme }) => {
  const accent = theme?.accent || '#38bdf8';
  const cardBg = theme?.cardBg || 'rgba(13, 19, 33, 0.98)';
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
        <View style={[styles.modalCard, { backgroundColor: cardBg }]}>
          
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Audio Stem Layer Mixer</Text>
              <Text style={styles.subtitle}>Drag sliders with physical tactile feedback</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Stems Sliders List */}
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {STEM_ITEMS.map((item) => {
              const val = stems[item.key] ?? 0.5;
              const percent = Math.round(val * 100);

              return (
                <MobileSlider
                  key={item.key}
                  label={item.label}
                  percent={percent}
                  desc={item.desc}
                  value={val}
                  accentColor={accent}
                  onValueChange={(newVal) => onStemChange(item.key, newVal)}
                />
              );
            })}
          </ScrollView>

          {/* Footer Reset */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetBtn} onPress={onResetStems} activeOpacity={0.8}>
              <Text style={styles.resetBtnText}>↺  Reset to Calibrated</Text>
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
    maxHeight: '82%'
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
  footer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center'
  },
  resetBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingVertical: 9,
    paddingHorizontal: 20
  },
  resetBtnText: {
    color: '#94a3b8',
    fontSize: 11.5,
    fontWeight: '600'
  }
});
