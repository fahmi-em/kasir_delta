import FormLogin from '@/components/ui/auth/form-login';
import React from 'react';


const LoginPage: React.FC = () => {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <FormLogin/>
        </div>
    );
};

export default LoginPage;
