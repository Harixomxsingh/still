import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Linking } from 'react-native';

export const MobileWelcomeModal = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          
          {/* Close button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          {/* Badge */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🌿 A Note From the Creator</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>Welcome to Still</Text>

          {/* Note body */}
          <Text style={styles.body}>
            I built this quiet space to help you calm your mind and room with research-backed soundscapes. No logins. No tracking. No ads. No algorithms. Just pure peace.
          </Text>

          {/* Signature */}
          <TouchableOpacity onPress={() => Linking.openURL('https://github.com/Harixomxsingh')}>
            <Text style={styles.signature}>
              — <Text style={styles.signName}>hari</Text>
            </Text>
          </TouchableOpacity>

          {/* Action button */}
          <TouchableOpacity style={styles.actionBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.actionBtnText}>Continue to Still ➔</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(4, 6, 12, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: 'rgba(13, 19, 33, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 10
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600'
  },
  badge: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 12
  },
  badgeText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '600'
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10
  },
  body: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '300',
    marginBottom: 12
  },
  signature: {
    color: '#64748b',
    fontSize: 13,
    marginBottom: 16
  },
  signName: {
    color: '#38bdf8',
    fontWeight: '600'
  },
  actionBtn: {
    width: '100%',
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionBtnText: {
    color: '#09090b',
    fontSize: 13,
    fontWeight: '600'
  }
});
