import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';
import { Ionicons } from '@expo/vector-icons';

const Input = ({
    label,
    iconName,
    error,
    password,
    onFocus = () => { },
    ...props
}) => {
    const [hidePassword, setHidePassword] = React.useState(password);
    const [isFocused, setIsFocused] = React.useState(false);

    return (
        <View style={{ marginBottom: 20 }}>
            <Text style={styles.label}>{label}</Text>
            <View
                style={[
                    styles.inputContainer,
                    {
                        borderColor: error
                            ? COLORS.secondary
                            : isFocused
                                ? COLORS.primary
                                : COLORS.inputBackground,
                        alignItems: 'center',
                    },
                ]}>
                <Ionicons
                    name={iconName}
                    style={{ color: COLORS.textSecondary, fontSize: 22, marginRight: 10 }}
                />
                <TextInput
                    autoCorrect={false}
                    onFocus={() => {
                        onFocus();
                        setIsFocused(true);
                    }}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={hidePassword}
                    style={{ color: COLORS.text, flex: 1 }}
                    placeholderTextColor={COLORS.textSecondary}
                    {...props}
                />
                {password && (
                    <Ionicons
                        onPress={() => setHidePassword(!hidePassword)}
                        name={hidePassword ? 'eye-off-outline' : 'eye-outline'}
                        style={{ color: COLORS.textSecondary, fontSize: 22 }}
                    />
                )}
            </View>
            {error && (
                <Text style={{ marginTop: 7, color: COLORS.secondary, fontSize: 12 }}>
                    {error}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        marginVertical: 5,
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    inputContainer: {
        height: 55,
        backgroundColor: COLORS.inputBackground,
        flexDirection: 'row',
        paddingHorizontal: 15,
        borderWidth: 0.5,
        borderRadius: 10,
    },
});

export default Input;
