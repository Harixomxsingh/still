import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { SOUNDSCAPES } from '../../shared/soundscapes';

export const MobileSoundscapeModal = ({ visible, onClose, currentIndex, isPlaying, onSelect }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Neuro-Acoustic Soundscapes</Text>
              <Text style={styles.subtitle}>Research-backed frequency models</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Soundscapes List */}
          <ScrollView style={styles.list}>
            {SOUNDSCAPES.map((track, idx) => {
              const isActive = idx === currentIndex;
              return (
                <TouchableOpacity
                  key={track.id}
                  style={[styles.trackCard, isActive && styles.trackCardActive]}
                  onPress={() => {
                    onSelect(idx);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.trackContent}>
                    <View style={styles.titleRow}>
                      <Text style={[styles.trackTitle, isActive && styles.trackTitleActive]}>
                        {track.title}
                      </Text>
                      {isActive && isPlaying && <View style={styles.activeDot} />}
                    </View>
                    <Text style={styles.scienceText}>{track.science}</Text>
                    <Text style={styles.descText} numberOfLines={2}>{track.description}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
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
    maxHeight: '75%'
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
    marginTop: 12
  },
  trackCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 8
  },
  trackCardActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    borderColor: '#38bdf8'
  },
  trackContent: {
    flex: 1
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2
  },
  trackTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700'
  },
  trackTitleActive: {
    color: '#38bdf8'
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38bdf8'
  },
  scienceText: {
    color: '#38bdf8',
    fontSize: 10,
    fontFamily: 'monospace',
    marginBottom: 4
  },
  descText: {
    color: '#94a3b8',
    fontSize: 11,
    lineHeight: 15
  }
});
