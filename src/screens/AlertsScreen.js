import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../utils/constants';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

const AlertsScreen = () => {
    const [alerts, setAlerts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAlerts = async () => {
        // try {
        //   const response = await api.get('/alerts');
        //   setAlerts(response.data);
        // } catch (error) {
        //   console.log('Error fetching alerts', error);
        // }

        // Mock Data
        setTimeout(() => {
            setAlerts([
                { id: '1', type: 'SIM Removed', timestamp: new Date().toISOString(), severity: 'high' },
                { id: '2', type: 'Network Lost', timestamp: new Date(Date.now() - 3600000).toISOString(), severity: 'medium' },
                { id: '3', type: 'Device Offline', timestamp: new Date(Date.now() - 7200000).toISOString(), severity: 'low' },
            ]);
        }, 500);
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchAlerts().then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        fetchAlerts();
    }, []);

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return COLORS.secondary;
            case 'medium': return '#FFA500'; // Orange
            default: return COLORS.primary;
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={[styles.alertCard, { borderLeftColor: getSeverityColor(item.severity) }]}>
            <View style={{ flex: 1 }}>
                <Text style={styles.alertType}>{item.type}</Text>
                <Text style={styles.alertTime}>{new Date(item.timestamp).toLocaleString()}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ backgroundColor: COLORS.background, flex: 1 }}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Alerts</Text>
            </View>
            <FlatList
                data={alerts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 20 }}
                refreshing={refreshing}
                onRefresh={onRefresh}
                ListEmptyComponent={
                    <Text style={{ color: COLORS.textSecondary, textAlign: 'center', marginTop: 50 }}>No alerts found.</Text>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    headerTitle: {
        color: COLORS.text,
        fontSize: 28,
        fontWeight: 'bold',
    },
    alertCard: {
        backgroundColor: COLORS.surface,
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        borderLeftWidth: 5,
    },
    alertType: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    alertTime: {
        color: COLORS.textSecondary,
        fontSize: 12,
    },
});

export default AlertsScreen;
