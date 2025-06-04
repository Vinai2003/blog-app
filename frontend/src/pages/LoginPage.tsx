import React from 'react';
import { Container } from '@mui/material';
import LoginForm from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
    return (
        <Container maxWidth="sm">
            <LoginForm />
        </Container>
    );
};

export default LoginPage;
