import { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../Api/api';
import { Input, Button, Spacer } from "@nextui-org/react";
import { Link } from 'react-router-dom';

const img_hosting_token = import.meta.env.VITE_ImageUpload_Token; // Add your imgbb token in `.env` file
const img_hosting_url = `https://api.imgbb.com/1/upload?key=${img_hosting_token}`;

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        profilePicture: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'profilePicture') {
            setFormData({ ...formData, profilePicture: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { name, email, password, profilePicture } = formData;

        if (!profilePicture) {
            setError('Profile picture is required.');
            setLoading(false);
            return;
        }

        // Upload the image to imgbb
        const imgFormData = new FormData();
        imgFormData.append('image', profilePicture);

        try {
            const imgResponse = await fetch(img_hosting_url, {
                method: 'POST',
                body: imgFormData,
            }).then((res) => res.json());

            if (imgResponse.success) {
                const imgURL = imgResponse.data.display_url;

                // Send registration data to the backend
                const response = await api.post('/register', {
                    name,
                    email,
                    password,
                    profilePicture: imgURL, // Use the imgbb URL
                });

                setSuccess(response.data.message);
                Swal.fire('Success!', 'Registration successful!', 'success');
                setError('');
                setFormData({ name: '', email: '', password: '', profilePicture: null });
            } else {
                setError('Image upload failed.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full">
            <div className="absolute inset-0 -z-10 h-full w-full bg-[#212121] bg-[linear-gradient(to_right,#323232_1px,transparent_1px),linear-gradient(to_bottom,#323232_1px,transparent_1px)] bg-[size:6rem_4rem]"><div className="absolute bottom-0 left-0 right-0 top-0 "></div></div>
            <div className="bg-[#212121b8] shadow-md rounded-lg w-full md:w-7/12 mx-2 md:mx-auto p-6 border-2 border-[#656565]">
                <h1 className="text-4xl font-bold mb-10 text-center g_text">Sign Up</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">{success}</p>}
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Input
                        clearable
                        underlined
                        fullWidth
                        labelPlaceholder="Name"
                        name="name"
                        label="Name"
                        placeholder='Enter you name'
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <Spacer y={2} />
                    <Input
                        isRequired
                        clearable
                        underlined
                        fullWidth
                        type="email"
                        label="Email"
                        placeholder="Enter you email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <Spacer y={2} />
                    <Input
                        clearable
                        underlined
                        fullWidth
                        type="password"
                        labelPlaceholder="Password"
                        name="password"
                        label="Password"
                        placeholder='Enter you password'
                        value={formData.password}
                        onChange={handleChange}
                        isRequired
                    />
                    <Spacer y={2} />
                    <input
                        type="file"
                        name="profilePicture"
                        onChange={handleChange}
                        label="Enter your image"
                        className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
                        accept="image/*"
                        required
                    />
                    <Spacer y={2} />
                    <p className='text-white mb-3'>Are you new? Please login <Link className='text-primary' to="/auth/login">Click here</Link></p>
                    <Button
                        type="submit"
                        color="primary"
                        auto
                        css={{ width: "100%", borderRadius: "8px" }}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Sign Up'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Register;
