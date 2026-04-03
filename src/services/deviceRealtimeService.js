import { ref, onValue, update, set } from 'firebase/database';
import { database } from '../../firebaseConfig';

export const DEVICE_ID = 'device_001';
export const deviceBasePath = `devices/${DEVICE_ID}`;
const commandPath = `${deviceBasePath}/command`;

/** Copy canonical device paths to legacy root keys (`/command`, `/gps`, …) so they stay in sync with `devices/device_001/*`. Disable if rules forbid root writes. */
export const LEGACY_ROOT_SYNC = true;

function mirrorLegacyRoot(rootKey, value) {
  if (!LEGACY_ROOT_SYNC) return;
  set(ref(database, rootKey), value).catch((err) => {
    console.warn(`[Firebase] legacy root mirror "${rootKey}" skipped:`, err?.message || err);
  });
}

function logSnapshot(label, snap) {
  console.log(`[Firebase] ${label}:`, snap.exists() ? snap.val() : null);
}

export function subscribeFirebaseConnection(callback) {
  const r = ref(database, '.info/connected');
  return onValue(
    r,
    (snap) => {
      logSnapshot('connection', snap);
      callback(!!snap.val());
    },
    (err) => {
      console.error('[Firebase] connection listener error:', err);
      callback(false);
    }
  );
}

export function subscribeGps(callback, onError) {
  const r = ref(database, `${deviceBasePath}/gps`);
  return onValue(
    r,
    (snap) => {
      logSnapshot('gps', snap);
      callback(snap.val());
    },
    (err) => {
      console.error('[Firebase] gps onValue error:', err);
      onError?.(err);
    }
  );
}

export function subscribeData(callback, onError) {
  const r = ref(database, `${deviceBasePath}/data`);
  return onValue(
    r,
    (snap) => {
      logSnapshot('data', snap);
      const v = snap.val();
      mirrorLegacyRoot('data', v);
      callback(v);
    },
    (err) => {
      console.error('[Firebase] data onValue error:', err);
      onError?.(err);
    }
  );
}

export function subscribeStatus(callback, onError) {
  const r = ref(database, `${deviceBasePath}/status`);
  return onValue(
    r,
    (snap) => {
      logSnapshot('status', snap);
      const v = snap.val();
      mirrorLegacyRoot('status', v);
      callback(v);
    },
    (err) => {
      console.error('[Firebase] status onValue error:', err);
      onError?.(err);
    }
  );
}

export function subscribeCommand(callback, onError) {
  const r = ref(database, commandPath);
  return onValue(
    r,
    (snap) => {
      logSnapshot('command', snap);
      const v = snap.val();
      mirrorLegacyRoot('command', v);
      callback(v);
    },
    (err) => {
      console.error('[Firebase] command onValue error:', err);
      onError?.(err);
    }
  );
}

export async function updateTracking(tracking) {
  console.log('[Firebase] write tracking →', tracking);
  await update(ref(database, commandPath), { tracking });
}

export async function updateMode(mode) {
  console.log('[Firebase] write config.mode →', mode);
  await update(ref(database, commandPath), { 'config/mode': mode });
}

export async function updateSource(source) {
  console.log('[Firebase] write config.source →', source);
  await update(ref(database, commandPath), { 'config/source': source });
}

export async function updateNetwork(network) {
  console.log('[Firebase] write config.network →', network);
  await update(ref(database, commandPath), { 'config/network': network });
}
