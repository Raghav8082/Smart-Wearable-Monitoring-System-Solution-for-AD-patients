import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

const Button = ({ title, onPress = () => { }, style = {} }) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[styles.button, style]}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 50,
        width: '100%',
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginVertical: 10,
    },
    text: {
        color: COLORS.background,
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default Button;
