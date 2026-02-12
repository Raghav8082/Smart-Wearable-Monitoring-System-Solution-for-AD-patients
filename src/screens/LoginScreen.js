import React, { useContext, useState } from 'react';
import { View, Text, SafeAreaView, Keyboard, Alert } from 'react-native';
import { COLORS } from '../utils/constants';
import Button from '../components/Button';
import Input from '../components/Input';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
    const [inputs, setInputs] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const { login, isLoading } = useContext(AuthContext);

    const validate = () => {
        Keyboard.dismiss();
        let isValid = true;
        if (!inputs.email) {
            handleError('Please input email', 'email');
            isValid = false;
        }
        if (!inputs.password) {
            handleError('Please input password', 'password');
            isValid = false;
        }
        if (isValid) {
            login(inputs.email, inputs.password);
        }
    };

    const handleOnchange = (text, input) => {
        setInputs((prevState) => ({ ...prevState, [input]: text }));
    };

    const handleError = (error, input) => {
        setErrors((prevState) => ({ ...prevState, [input]: error }));
    };

    return (
        <SafeAreaView style={{ backgroundColor: COLORS.background, flex: 1 }}>
            <View style={{ paddingTop: 50, paddingHorizontal: 20 }}>
                <Text style={{ color: COLORS.text, fontSize: 40, fontWeight: 'bold' }}>
                    Welcome Back,
                </Text>
                <Text style={{ color: COLORS.textSecondary, fontSize: 18, marginVertical: 10 }}>
                    Sign in to continue
                </Text>
                <View style={{ marginVertical: 20 }}>
                    <Input
                        onChangeText={(text) => handleOnchange(text, 'email')}
                        onFocus={() => handleError(null, 'email')}
                        iconName="mail-outline"
                        label="Email"
                        placeholder="Enter your email address"
                        error={errors.email}
                    />
                    <Input
                        onChangeText={(text) => handleOnchange(text, 'password')}
                        onFocus={() => handleError(null, 'password')}
                        iconName="lock-closed-outline"
                        label="Password"
                        placeholder="Enter your password"
                        error={errors.password}
                        password
                    />
                    <Button title={isLoading ? 'Loading...' : 'Log In'} onPress={validate} />
                    <Text
                        onPress={() => navigation.navigate('Register')}
                        style={{
                            color: COLORS.text,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            fontSize: 16,
                            marginTop: 10,
                        }}>
                        Don't have an account? Register
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default LoginScreen;
