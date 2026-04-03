import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { COLORS, TRACKING, DEVICE_MODE, SOURCE, NETWORK } from '../utils/constants';
import { AuthContext } from '../context/AuthContext';
import DeviceTelemetryPanel from '../components/DeviceTelemetryPanel';
import DeviceCommandControls from '../components/DeviceCommandControls';
import {
  subscribeGps,
  subscribeData,
  subscribeStatus,
  subscribeCommand,
  subscribeFirebaseConnection,
  updateTracking,
  updateMode,
  updateSource,
  updateNetwork,
} from '../services/deviceRealtimeService';

const defaultGps = () => ({ latitude: 0, longitude: 0 });
const defaultData = () => ({ mcc: 0, mnc: 0, tac: 0, cellId: 0 });
const defaultStatus = () => ({
  online: false,
  mode: DEVICE_MODE.NORMAL,
  source: SOURCE.CELL,
  network: NETWORK.WIFI,
  signal: 0,
});
const defaultCommand = () => ({
  tracking: TRACKING.OFF,
  config: {
    mode: DEVICE_MODE.NORMAL,
    source: SOURCE.CELL,
    network: NETWORK.WIFI,
  },
});

const DashboardScreen = () => {
  const { userInfo } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const [listenerError, setListenerError] = useState(null);
  const [initialSync, setInitialSync] = useState(false);
  const [writePending, setWritePending] = useState(false);

  const [gps, setGps] = useState(defaultGps);
  const [data, setData] = useState(defaultData);
  const [status, setStatus] = useState(defaultStatus);
  const [command, setCommand] = useState(defaultCommand);

  const mergeGps = useCallback((val) => {
    setGps({ ...defaultGps(), ...val });
  }, []);
  const mergeData = useCallback((val) => {
    setData({ ...defaultData(), ...val });
  }, []);
  const mergeStatus = useCallback((val) => {
    setStatus({ ...defaultStatus(), ...val });
  }, []);
  const mergeCommand = useCallback((val) => {
    if (!val) {
      setCommand(defaultCommand());
      return;
    }
    const cfg = val.config || {};
    setCommand({
      tracking: val.tracking ?? TRACKING.OFF,
      config: {
        mode: cfg.mode ?? DEVICE_MODE.NORMAL,
        source: cfg.source ?? SOURCE.CELL,
        network: cfg.network ?? NETWORK.WIFI,
      },
    });
  }, []);

  useEffect(() => {
    const unsubConn = subscribeFirebaseConnection(setFirebaseConnected);

    const first = { gps: false, data: false, status: false, command: false };
    const markReady = (key) => {
      if (first[key]) return;
      first[key] = true;
      if (first.gps && first.data && first.status && first.command) {
        setInitialSync(true);
      }
    };

    const unsubGps = subscribeGps(
      (v) => {
        setListenerError(null);
        mergeGps(v);
        markReady('gps');
      },
      (e) => setListenerError(e)
    );
    const unsubData = subscribeData(
      (v) => {
        setListenerError(null);
        mergeData(v);
        markReady('data');
      },
      (e) => setListenerError(e)
    );
    const unsubStatus = subscribeStatus(
      (v) => {
        setListenerError(null);
        mergeStatus(v);
        markReady('status');
      },
      (e) => setListenerError(e)
    );
    const unsubCmd = subscribeCommand(
      (v) => {
        setListenerError(null);
        mergeCommand(v);
        markReady('command');
      },
      (e) => setListenerError(e)
    );

    const safetyTimer = setTimeout(() => setInitialSync(true), 12000);

    return () => {
      clearTimeout(safetyTimer);
      unsubConn();
      unsubGps();
      unsubData();
      unsubStatus();
      unsubCmd();
    };
  }, [mergeGps, mergeData, mergeStatus, mergeCommand]);

  const runWrite = async (fn) => {
    if (!firebaseConnected) {
      Alert.alert('Offline', 'Cannot reach Firebase. Check your connection.');
      return;
    }
    setWritePending(true);
    setListenerError(null);
    try {
      await fn();
    } catch (e) {
      console.error('[Firebase] write failed:', e);
      setListenerError(e);
      Alert.alert('Update failed', e?.message || 'Could not write to Firebase.');
    } finally {
      setWritePending(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  const controlsDisabled = !firebaseConnected || !!listenerError;

  const deviceOffline = status?.online === false;
  const showOfflineBanner = !firebaseConnected || deviceOffline;

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.background, flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>Hello, {userInfo?.name || 'User'}</Text>
        </View>

        {!initialSync ? (
          <View style={styles.loadingBanner}>
            <ActivityIndicator color={COLORS.primary} />
            <Text style={styles.bannerText}>Loading device data…</Text>
          </View>
        ) : null}

        {listenerError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorTitle}>Connection issue</Text>
            <Text style={styles.errorText}>
              Real-time updates may be unavailable. Pull to refresh after fixing the network.
            </Text>
          </View>
        ) : null}

        {showOfflineBanner && initialSync ? (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineTitle}>
              {!firebaseConnected ? 'Firebase disconnected' : 'Device offline'}
            </Text>
            <Text style={styles.offlineText}>
              {!firebaseConnected
                ? 'Waiting for a network path to Firebase.'
                : 'The wearable reports offline. Telemetry may be stale.'}
            </Text>
          </View>
        ) : null}

        <DeviceTelemetryPanel gps={gps} data={data} status={status} loading={!initialSync} />

        <DeviceCommandControls
          tracking={command.tracking}
          mode={command.config.mode}
          source={command.config.source}
          network={command.config.network}
          onTrackingChange={(v) => runWrite(() => updateTracking(v))}
          onModeChange={(v) => runWrite(() => updateMode(v))}
          onSourceChange={(v) => runWrite(() => updateSource(v))}
          onNetworkChange={(v) => runWrite(() => updateNetwork(v))}
          writePending={writePending}
          disabled={controlsDisabled}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
    marginTop: 20,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 18,
    marginTop: 5,
  },
  loadingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  bannerText: {
    color: COLORS.textSecondary,
    marginLeft: 12,
    flex: 1,
  },
  errorBanner: {
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  errorTitle: {
    color: COLORS.secondary,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  errorText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  offlineBanner: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
  },
  offlineTitle: {
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  offlineText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});

export default DashboardScreen;
