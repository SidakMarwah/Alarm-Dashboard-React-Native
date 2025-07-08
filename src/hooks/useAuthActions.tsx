import { FormikHelpers } from "formik";
import { addUser, findUserByEmailAndPassword } from "../db/users";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

interface SignUpFormValues {
    name: string;
    email: string;
    password: string;
}

interface LoginFormValues {
    email: string;
    password: string;
}

export function useAuthActions() {
    const { login } = useContext(AuthContext);

    const handleSignUp = async (values: SignUpFormValues, { resetForm }: FormikHelpers<SignUpFormValues>) => {
        console.log('Sign Up Values:', values);
        try {
            let result = await addUser(values);
            console.log('User added successfully:', result);
            await login(values.email);
            resetForm();
        } catch (error) {
            console.error('Error adding user:', error);
        }
    }

    const handleLogin = async (values: LoginFormValues, { resetForm }: FormikHelpers<LoginFormValues>) => {
        // console.log('Login Values:', values);
        try {
            let result = await findUserByEmailAndPassword(values);
            if (!result) {
                console.error('User not found or invalid credentials');
                return;
            }
            // We are here that means user is legit.

            // console.log('User authenticated successfully:', result);
            await login(values.email);
            resetForm();
        } catch (error) {
            console.error('Error authenticating user:', error);
        }
    }

    return {
        handleSignUp,
        handleLogin
    };
}