import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';
import { Ionicons } from '@expo/vector-icons';

const StatusCard = ({ title, status, icon, isGood }) => {
    return (
        <View style={styles.card}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={24} color={isGood ? COLORS.primary : COLORS.secondary} />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={[styles.status, { color: isGood ? COLORS.primary : COLORS.secondary }]}>
                    {status}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.inputBackground,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    infoContainer: {
        flex: 1,
    },
    title: {
        color: COLORS.textSecondary,
        fontSize: 14,
        marginBottom: 5,
    },
    status: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default StatusCard;
