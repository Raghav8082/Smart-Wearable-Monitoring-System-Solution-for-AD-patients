import React, { useContext } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS } from '../utils/constants';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = () => {
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', onPress: () => logout(), style: 'destructive' },
        ]);
    };

    const SettingItem = ({ title, icon, onPress }) => (
        <TouchableOpacity style={styles.item} onPress={onPress}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name={icon} size={22} color={COLORS.text} style={{ marginRight: 15 }} />
                <Text style={styles.itemText}>{title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ backgroundColor: COLORS.background, flex: 1 }}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>
            <View style={{ padding: 20 }}>
                <SettingItem title="Notifications" icon="notifications-outline" onPress={() => console.log('Notifications')} />
                <SettingItem title="Change Password" icon="lock-closed-outline" onPress={() => console.log('Change Password')} />
                <SettingItem title="Privacy Policy" icon="document-text-outline" onPress={() => console.log('Privacy Policy')} />

                <View style={styles.separator} />

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </View>
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
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    itemText: {
        color: COLORS.text,
        fontSize: 16,
    },
    separator: {
        height: 30,
    },
    logoutButton: {
        backgroundColor: COLORS.secondary,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    logoutText: {
        color: COLORS.text,
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default SettingsScreen;
