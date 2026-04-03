import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, STATUS } from '../utils/constants';
import StatusCard from './StatusCard';

const Row = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const DeviceTelemetryPanel = ({ gps, data, status, loading }) => {
  const lat = gps?.latitude ?? '—';
  const lon = gps?.longitude ?? '—';
  const mcc = data?.mcc ?? '—';
  const mnc = data?.mnc ?? '—';
  const tac = data?.tac ?? '—';
  const cellId = data?.cellId ?? '—';

  const online = status?.online === true;
  const mode = status?.mode ?? '—';
  const source = status?.source ?? '—';
  const network = status?.network ?? '—';
  const signal = status?.signal != null ? `${status.signal}` : '—';

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Live telemetry</Text>
      {loading ? (
        <Text style={styles.muted}>Waiting for first update…</Text>
      ) : null}

      <View style={styles.block}>
        <Text style={styles.blockTitle}>GPS</Text>
        <Row label="Latitude" value={lat} />
        <Row label="Longitude" value={lon} />
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Cellular</Text>
        <Row label="MCC" value={mcc} />
        <Row label="MNC" value={mnc} />
        <Row label="TAC" value={tac} />
        <Row label="Cell ID" value={cellId} />
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Device status</Text>
        <StatusCard
          title="Connection"
          status={online ? STATUS.ONLINE : STATUS.OFFLINE}
          icon={online ? 'wifi' : 'wifi-outline'}
          isGood={online}
        />
        <Row label="Mode" value={mode} />
        <Row label="Source" value={source} />
        <Row label="Network" value={network} />
        <Row label="Signal" value={signal} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  muted: {
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  block: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  blockTitle: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  rowLabel: {
    color: COLORS.textSecondary,
    fontSize: 15,
  },
  rowValue: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default DeviceTelemetryPanel;
