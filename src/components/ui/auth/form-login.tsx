"use client"

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LoginButton } from '@/components/ui/buttonform';
import { useActionState } from 'react';
import { signInCredentials } from '@/lib/actions';
import { faTimesCircle, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FormLogin = () => {
    const [state, formAction] = useActionState(signInCredentials, null);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Login</CardTitle>
                        <CardDescription>Please enter your account and password below.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="flex flex-col gap-4">
                    <div>

                        <label className="block text-sm font-medium text-black-700 mb-5">Email</label>
                        <input
                            type="text"
                            name='email'
                            placeholder="email"
                            className={`w-full border ${state?.error?.email ? "border-red-500" : "border-gray-300 bg-white text-left text-gray-800 focus:outline-none dark:bg-[#1a1a1a] dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                                } rounded-md p-3`}
                        />
                        {state?.error?.email && (
                            <div className="border border-red-500 rounded-md p-4 mb-4 mt-4 flex items-center">
                                <FontAwesomeIcon icon={faTimesCircle} className="text-red-600 mr-4 text-xl" />
                                <div>
                                    <div className="font-bold text-red-700">Error</div>
                                    <div className="text-sm text-red-600" role="alert">
                                        {state.error.email}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <label htmlFor="Password" className='block text-sm font-medium text-black-700 mb-1'>Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name='password'
                            className={`w-full border ${state?.error?.password ? "border-red-500" : "border-gray-300 bg-white text-left text-gray-800 focus:outline-none dark:bg-[#1a1a1a] dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                } rounded-md p-3`}
                            placeholder='password'
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 items-center justify-center h-full pr-3 text-gray-500"
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </button>
                    </div>


                    {state?.error?.password && (
                        <div className="border border-red-500 rounded-md p-4 mb-4 flex items-center">
                            <FontAwesomeIcon icon={faTimesCircle} className="text-red-600 mr-4 text-xl" />
                            <div>
                                <div className="font-bold text-red-700">Error</div>
                                <div className="text-sm text-red-600" role="alert">
                                    {state.error.password}
                                </div>
                            </div>
                        </div>
                    )}

                    <LoginButton/>
                </form>
            </CardContent>
        </Card>
    )
}

export default FormLogin