import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import logo from '../assets/images/logo.png'
import React, { use, useContext } from 'react'
import { Formik, FormikHelpers } from 'formik'
import { useNavigation } from '@react-navigation/native'
import * as yup from 'yup';
import { useAuthActions } from '../hooks/useAuthActions'

const loginValidationSchema = yup.object().shape({
    email: yup
        .string()
        .email('Please enter a valid email')
        .required('Email is required'),
    password: yup
        .string()
        .min(6, ({ min }) => `Password must be at least ${min} characters`)
        .required('Password is required'),
});

const LoginScreen = () => {
    const navigation = useNavigation();
    const { handleLogin } = useAuthActions();

    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.title}>Login</Text>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={loginValidationSchema}
                onSubmit={handleLogin}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
                    <View style={styles.form}>
                        <TextInput
                            placeholder="Email"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            style={styles.input}
                        />
                        {errors.email && touched.email && (
                            <Text style={styles.errorText}>{errors.email}</Text>
                        )}
                        <TextInput
                            placeholder="Password"
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            secureTextEntry
                            style={styles.input}
                        />
                        {errors.password && touched.password && (
                            <Text style={styles.errorText}>{errors.password}</Text>
                        )}
                        <TouchableOpacity
                            onPress={handleSubmit}
                            style={styles.button}
                            disabled={!isValid}
                        >
                            <Text style={{ color: '#fff' }}>Login</Text>
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <Text>Don't have an account?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                                <Text style={{ color: '#007AFF', marginLeft: 4 }}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                )}
            </Formik>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAEBC4'
    },
    title: {
        fontSize: 30,
        color: '#000',
        fontWeight: 'bold',
    },
    logo: {
        width: 100,
        height: 100,
    },
    form: {
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    input: {
        height: 40,
        borderColor: '#333',
        borderWidth: 1,
        borderRadius: 5,
        marginBlockStart: 10,
        paddingHorizontal: 10,
        width: '80%',
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        marginBlockStart: 10,
        width: '80%',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 5,
        width: '80%',
        alignSelf: 'center',
    },
})