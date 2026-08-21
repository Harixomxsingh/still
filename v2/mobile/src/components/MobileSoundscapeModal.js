import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SOUNDSCAPES } from '../shared/soundscapes';

export const MobileSoundscapeModal = ({ visible, onClose, currentIndex, isPlaying, onSelect, theme }) => {
  const accent = theme?.accent || '#38bdf8';
  const cardBg = theme?.cardBg || 'rgba(13, 19, 33, 0.98)';

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={[styles.modalCard, { backgroundColor: cardBg }]}>
          
          {/* Minimalist Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Soundscapes</Text>
              <Text style={styles.subtitle}>Select the calm state you need right now</Text>
            </View>
            <TouchableOpacity 
              style={styles.closeBtn} 
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Radically Simple Purpose-Driven List */}
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {SOUNDSCAPES.map((track, idx) => {
              const isActive = idx === currentIndex;

              return (
                <TouchableOpacity
                  key={track.id}
                  style={[
                    styles.itemRow,
                    isActive && { backgroundColor: accent + '14', borderColor: accent + '40' }
                  ]}
                  onPress={() => {
                    try { Haptics.selectionAsync(); } catch(e) {}
                    onSelect(idx);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.leftCol}>
                    <View style={styles.nameRow}>
                      <Text style={[styles.trackName, isActive && { color: accent, fontWeight: '700' }]}>
                        {track.title}
                      </Text>
                      {isActive && isPlaying && (
                        <View style={[styles.activeDot, { backgroundColor: accent }]} />
                      )}
                    </View>
                    <Text style={[styles.purposeText, isActive && { color: accent }]}>
                      {track.purpose || track.science}
                    </Text>
                  </View>

                  <View style={styles.rightCol}>
                    <Text style={[styles.freqBadge, isActive && { color: accent }]}>
                      {track.science.split('•')[0].trim()}
                    </Text>
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
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    maxHeight: '74%'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)'
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600'
  },
  list: {
    marginTop: 8
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    marginVertical: 2
  },
  leftCol: {
    flex: 1
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3
  },
  trackName: {
    color: '#f8fafc',
    fontSize: 13.5,
    fontWeight: '600'
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  purposeText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '400'
  },
  rightCol: {
    marginLeft: 10,
    alignItems: 'flex-end'
  },
  freqBadge: {
    color: '#475569',
    fontSize: 10.5,
    fontFamily: 'monospace',
    fontWeight: '500'
  }
});
