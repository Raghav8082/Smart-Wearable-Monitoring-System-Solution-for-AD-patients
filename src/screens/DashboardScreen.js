import React, { useState, useEffect, useContext } from 'react';
import { View, Text, SafeAreaView, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { COLORS, STATUS, SIM_STATUS } from '../utils/constants';
import StatusCard from '../components/StatusCard';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const DashboardScreen = ({ navigation }) => {
    const { userInfo } = useContext(AuthContext);
    const [refreshing, setRefreshing] = useState(false);
    const [deviceStatus, setDeviceStatus] = useState({
        online: true,
        simStatus: SIM_STATUS.INSERTED,
        signalStrength: 85,
        lastUpdated: new Date().toISOString(),
    });

    const fetchStatus = async () => {
        // try {
        //   const response = await api.get('/device/status');
        //   setDeviceStatus(response.data);
        // } catch (error) {
        //   console.log('Error fetching status', error);
        // }

        // Mock Data for Demo
        setTimeout(() => {
            setDeviceStatus({
                online: Math.random() > 0.5,
                simStatus: Math.random() > 0.2 ? SIM_STATUS.INSERTED : SIM_STATUS.REMOVED,
                signalStrength: Math.floor(Math.random() * 100),
                lastUpdated: new Date().toISOString(),
            });
        }, 1000);
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchStatus().then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        fetchStatus();
    }, []);

    return (
        <SafeAreaView style={{ backgroundColor: COLORS.background, flex: 1 }}>
            <ScrollView
                contentContainerStyle={{ padding: 20 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                }>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Dashboard</Text>
                    <Text style={styles.headerSubtitle}>
                        Hello, {userInfo?.name || 'User'}
                    </Text>
                </View>

                <View style={styles.statusContainer}>
                    <StatusCard
                        title="Device Status"
                        status={deviceStatus.online ? STATUS.ONLINE : STATUS.OFFLINE}
                        icon={deviceStatus.online ? 'wifi' : 'wifi-outline'}
                        isGood={deviceStatus.online}
                    />
                    <StatusCard
                        title="SIM Card"
                        status={deviceStatus.simStatus}
                        icon="card-outline"
                        isGood={deviceStatus.simStatus === SIM_STATUS.INSERTED}
                    />
                    <StatusCard
                        title="Signal Strength"
                        status={`${deviceStatus.signalStrength}%`}
                        icon="cellular-outline"
                        isGood={deviceStatus.signalStrength > 30}
                    />
                </View>

                <View style={styles.updateInfo}>
                    <Text style={{ color: COLORS.textSecondary }}>
                        Last Updated: {new Date(deviceStatus.lastUpdated).toLocaleString()}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        marginBottom: 30,
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
    statusContainer: {
        marginBottom: 20,
    },
    updateInfo: {
        alignItems: 'center',
        marginTop: 20,
    },
});

export default DashboardScreen;
