import { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../Api/api';
import { Input, Button, Spacer } from "@nextui-org/react";
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/login', { email, password });
            console.log(response);
            localStorage.setItem('token', response.data.token);
            Swal.fire('Success!', 'Login successful!', 'success');
            // Redirect based on role
            if (response.data.role === 'Admin') {
                window.location.href = '/dashboard';
            } else {
                window.location.href = '/';
            }
        } catch (error) {
            console.log(error);
            Swal.fire('Error!', 'Login failed!', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full">
            <div className="absolute inset-0 -z-10 h-full w-full bg-[#212121] bg-[linear-gradient(to_right,#323232_1px,transparent_1px),linear-gradient(to_bottom,#323232_1px,transparent_1px)] bg-[size:6rem_4rem]">
                <div className="absolute bottom-0 left-0 right-0 top-0 "></div>
            </div>
            <div className="bg-[#212121b8] shadow-md rounded-lg w-full md:w-7/12 mx-2 md:mx-auto p-6 border-2 border-[#656565]">
                <h1 className="text-4xl font-bold mb-10 text-center g_text">Log In</h1>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Input
                        isRequired
                        clearable
                        underlined
                        fullWidth
                        type="email"
                        label="Email"
                        placeholder="Enter your email"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Spacer y={2} />
                    <Input
                        clearable
                        underlined
                        fullWidth
                        type="password"
                        label="Password"
                        placeholder="Enter your password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        isRequired
                    />
                    <Spacer y={2} />
                    <p className="text-white mb-3">New here? Please sign up <Link className="text-success" to="/auth/register">here</Link></p>
                    <Button
                        type="submit"
                        color="success"
                        auto
                        css={{ width: "100%", borderRadius: "8px" }}
                        disabled={loading}
                        className='font-bold font-sans text-md text-white'
                    >
                        {loading ? 'Loading...' : 'Log In'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Login;
