import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { COLORS } from '../utils/constants';
import {
  TRACKING,
  DEVICE_MODE,
  SOURCE,
  NETWORK,
} from '../utils/constants';

const OptionModal = ({ visible, title, options, onSelect, onClose }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.modalBackdrop}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <View style={styles.modalSheet}>
        <Text style={styles.modalTitle}>{title}</Text>
        <FlatList
          data={options}
          keyExtractor={(item) => String(item)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.modalRow}
              onPress={() => {
                onSelect(item);
                onClose();
              }}>
              <Text style={styles.modalRowText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  </Modal>
);

const SelectorRow = ({ label, value, onPress, disabled }) => (
  <TouchableOpacity
    style={[styles.selector, disabled && styles.selectorDisabled]}
    onPress={onPress}
    disabled={disabled}>
    <Text style={styles.selectorLabel}>{label}</Text>
    <Text style={styles.selectorValue}>{value}</Text>
  </TouchableOpacity>
);

const DeviceCommandControls = ({
  tracking,
  mode,
  source,
  network,
  onTrackingChange,
  onModeChange,
  onSourceChange,
  onNetworkChange,
  writePending,
  disabled,
}) => {
  const [modal, setModal] = useState(null);

  const trackingOn = tracking === TRACKING.ON;
  const busy = writePending || disabled;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Device controls</Text>
      {writePending ? (
        <View style={styles.pendingRow}>
          <ActivityIndicator style={styles.pendingSpinner} size="small" color={COLORS.primary} />
          <Text style={styles.pendingText}>Syncing…</Text>
        </View>
      ) : null}

      <View style={styles.card}>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Tracking</Text>
          <Switch
            value={trackingOn}
            onValueChange={(v) => onTrackingChange(v ? TRACKING.ON : TRACKING.OFF)}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={COLORS.text}
            disabled={busy}
          />
          <Text style={styles.switchHint}>{trackingOn ? TRACKING.ON : TRACKING.OFF}</Text>
        </View>

        <SelectorRow
          label="Mode"
          value={mode}
          onPress={() => setModal('mode')}
          disabled={busy}
        />
        <SelectorRow
          label="Source"
          value={source}
          onPress={() => setModal('source')}
          disabled={busy}
        />
        <SelectorRow
          label="Network"
          value={network}
          onPress={() => setModal('network')}
          disabled={busy}
        />
      </View>

      <OptionModal
        visible={modal === 'mode'}
        title="Mode"
        options={Object.values(DEVICE_MODE)}
        onSelect={onModeChange}
        onClose={() => setModal(null)}
      />
      <OptionModal
        visible={modal === 'source'}
        title="Source"
        options={Object.values(SOURCE)}
        onSelect={onSourceChange}
        onClose={() => setModal(null)}
      />
      <OptionModal
        visible={modal === 'network'}
        title="Network"
        options={Object.values(NETWORK)}
        onSelect={onNetworkChange}
        onClose={() => setModal(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  pendingSpinner: {
    marginRight: 8,
  },
  pendingText: {
    color: COLORS.textSecondary,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  switchLabel: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  switchHint: {
    color: COLORS.textSecondary,
    fontSize: 14,
    minWidth: 36,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  selectorDisabled: {
    opacity: 0.5,
  },
  selectorLabel: {
    color: COLORS.textSecondary,
    fontSize: 15,
  },
  selectorValue: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 24,
    position: 'relative',
  },
  modalSheet: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    maxHeight: '70%',
    paddingVertical: 8,
    zIndex: 1,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  modalRow: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  modalRowText: {
    color: COLORS.text,
    fontSize: 16,
  },
});

export default DeviceCommandControls;
