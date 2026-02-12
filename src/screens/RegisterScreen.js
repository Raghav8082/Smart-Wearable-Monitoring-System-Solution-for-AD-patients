import React, { useState } from 'react';
import { View, Text, SafeAreaView, Keyboard, Alert, ScrollView } from 'react-native';
import { COLORS } from '../utils/constants';
import Button from '../components/Button';
import Input from '../components/Input';

const RegisterScreen = ({ navigation }) => {
    const [inputs, setInputs] = useState({
        email: '',
        fullname: '',
        phone: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        Keyboard.dismiss();
        let isValid = true;
        if (!inputs.email) {
            handleError('Please input email', 'email');
            isValid = false;
        }
        if (!inputs.fullname) {
            handleError('Please input fullname', 'fullname');
            isValid = false;
        }
        if (!inputs.phone) {
            handleError('Please input phone number', 'phone');
            isValid = false;
        }
        if (!inputs.password) {
            handleError('Please input password', 'password');
            isValid = false;
        }
        if (isValid) {
            register();
        }
    };

    const register = () => {
        setLoading(true);
        setTimeout(() => {
            try {
                setLoading(false);
                Alert.alert('Success', 'Registration Successful', [
                    { text: 'OK', onPress: () => navigation.navigate('Login') },
                ]);
            } catch (error) {
                Alert.alert('Error', 'Something went wrong');
                setLoading(false);
            }
        }, 1000);
    };

    const handleOnchange = (text, input) => {
        setInputs((prevState) => ({ ...prevState, [input]: text }));
    };
    const handleError = (error, input) => {
        setErrors((prevState) => ({ ...prevState, [input]: error }));
    };

    return (
        <SafeAreaView style={{ backgroundColor: COLORS.background, flex: 1 }}>
            <ScrollView contentContainerStyle={{ paddingTop: 50, paddingHorizontal: 20 }}>
                <Text style={{ color: COLORS.text, fontSize: 40, fontWeight: 'bold' }}>
                    Register
                </Text>
                <Text style={{ color: COLORS.textSecondary, fontSize: 18, marginVertical: 10 }}>
                    Enter Your Details to Register
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
                        onChangeText={(text) => handleOnchange(text, 'fullname')}
                        onFocus={() => handleError(null, 'fullname')}
                        iconName="person-outline"
                        label="Full Name"
                        placeholder="Enter your full name"
                        error={errors.fullname}
                    />
                    <Input
                        keyboardType="numeric"
                        onChangeText={(text) => handleOnchange(text, 'phone')}
                        onFocus={() => handleError(null, 'phone')}
                        iconName="call-outline"
                        label="Phone Number"
                        placeholder="Enter your phone no"
                        error={errors.phone}
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
                    <Button title={loading ? 'Registering...' : 'Register'} onPress={validate} />
                    <Text
                        onPress={() => navigation.navigate('Login')}
                        style={{
                            color: COLORS.text,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            fontSize: 16,
                            marginTop: 10,
                        }}>
                        Already have an account? Login
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default RegisterScreen;
