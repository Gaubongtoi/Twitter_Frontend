import { useState } from 'react';
import images from '../../assets/images';
import Button from '../../components/Button';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import http from '../../utils/http';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useLoginState from '../../hooks/state/useLoginState';
import useLoading from '../../hooks/state/useLoading';
// Dang nhap
function Signin() {
    const navigate = useNavigate();
    const { login } = useLoginState();
    const { isOpen, open, close } = useLoading();
    const [errorDisplay, setErrorDisplay] = useState(true);
    const [errorMes, setErrorMes] = useState();
    const schema = yup
        .object()
        .shape({
            email: yup
                .string()
                .required('You need to fill this field!')
                .email('Invalid Email!')
                .matches(/@gmail\.com$/, 'Email must end with @gmail.com'),
            password: yup.string().required('You need to fill this field!'),
        })
        .required();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            userName: '',
            email: '',
            phoneNumber: '',
        },
        resolver: yupResolver(schema),
    });
    const handleLogin = async (data) => {
        const loadingToast = toast.loading('Waiting...');
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        open();
        try {
            await delay(import.meta.env.VITE_DELAY_REQUEST);
            let response = await http.post('/api/user/login', data);
            localStorage.setItem('accessToken', response.data.result.access_token);
            localStorage.setItem('refreshToken', response.data.result.refresh_token);
            login();
            setErrorDisplay(false);
            toast.success(`${response.data.msg}! Welcome ${response.data.result.user.name}`, {
                id: loadingToast,
                style: {
                    border: '1px solid #1E82BF',
                    padding: '16px',
                    color: '#1E82BF',
                },
                iconTheme: {
                    primary: '#1E82BF',
                    secondary: '#FFFAEE',
                },
            });
            close();
            navigate('/');
        } catch (error) {
            toast.error(`${error.response?.data?.errors?.email?.msg || 'Unknown error'}`, {
                id: loadingToast,
            });
            setErrorDisplay(true);
            setErrorMes(() => {
                return {
                    msg: error.response?.data?.errors?.email?.msg || 'Unknown error',
                    status: error.response?.status || 500,
                };
            });
            close();
        }
        // setTimeout(async () => {
        //     try {
        //         let response = await http.post('/api/user/login', data);
        //         console.log(response);
        //         localStorage.setItem('accessToken', response.data.result.access_token);
        //         localStorage.setItem('refreshToken', response.data.result.refresh_token);
        //         login();
        //         setErrorDisplay(false);
        //         toast.success(`${response.data.msg}! Welcome ${response.data.result.user.name}`, {
        //             id: loadingToast,
        //             style: {
        //                 border: '1px solid #1E82BF',
        //                 padding: '16px',
        //                 color: '#1E82BF',
        //             },
        //             iconTheme: {
        //                 primary: '#1E82BF',
        //                 secondary: '#FFFAEE',
        //             },
        //         });
        //         close();
        //         navigate('/');
        //     } catch (error) {
        //         toast.error(`${error.response?.data?.errors?.email?.msg || 'Unknown error'}`, {
        //             id: loadingToast,
        //         });
        //         setErrorDisplay(true);
        //         setErrorMes(() => {
        //             return {
        //                 msg: error.response?.data?.errors?.email?.msg || 'Unknown error',
        //                 status: error.response?.status || 500,
        //             };
        //         });
        //         close();
        //     }
        // }, import.meta.env.VITE_DELAY_REQUEST);
        // ...
    };
    return (
        <>
            <div className="w-full max-w-md mx-auto flex flex-col">
                <div className="w-full flex flex-col mb-6 text-center ">
                    <h3 className="text-2xl md:text-4xl font-bold mb-4 text-[#269BEB]">Login</h3>
                    <p className="text-sm md:text-base mb-2">Welcome back! Stay connected with your friends.</p>
                </div>
                {errorDisplay && errorMes && (
                    <div
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                        role="alert"
                    >
                        <strong className="font-bold">Error {errorMes.status}:</strong>
                        <span className="block sm:inline"> {errorMes.msg}.</span>
                        {/* <p className="mt-2 text-sm">Please re-enter!!</p> */}
                    </div>
                )}
                <div className="w-full flex flex-col mb-4">
                    <input
                        className="w-full text-black py-2 my-2 bg-transparent pl-6 border-b border-black outline-none focus:outline-none"
                        type="email"
                        placeholder="Email"
                        {...register('email')}
                    />
                    {errors.email && <span className="form-message text-sm text-red-500">{errors.email.message}</span>}
                    <input
                        className="w-full text-black py-2 my-2 bg-transparent pl-6 border-b border-black outline-none focus:outline-none"
                        type="password"
                        placeholder="Password"
                        {...register('password')}
                    />
                    {errors.password && (
                        <span className="form-message text-sm text-red-500">{errors.password.message}</span>
                    )}
                </div>
                <div className="w-full flex flex-row justify-end items-center mb-4">
                    <div className="flex items-center">
                        <p className="font-medium text-sm cursor-pointer underline underline-offset-2 hover:text-primary">
                            Forgot Password!
                        </p>
                    </div>
                </div>
                <div className="w-full flex items-center justify-center mb-4">
                    {isOpen ? (
                        <Button primary rounded disabled>
                            Login
                        </Button>
                    ) : (
                        <Button
                            primary
                            rounded
                            onClick={(e) => {
                                handleSubmit(handleLogin)(e);
                            }}
                        >
                            Login
                        </Button>
                    )}
                </div>
                <div className="w-full flex items-center justify-center mb-4">
                    {isOpen ? (
                        <Button rounded disabled>
                            <img src={images.icons_google} alt="Google" className="w-6 h-6" />
                        </Button>
                    ) : (
                        <Button rounded>
                            <img src={images.icons_google} alt="Google" className="w-6 h-6" />
                        </Button>
                    )}
                </div>
                {/* Button mạng xã hội */}
                {/* <div className="w-full flex flex-wrap justify-center gap-4 mb-8">
                    <Button rounded>
                        <img src={images.icons_google} alt="Google" className="w-6 h-6" />
                    </Button>
                    <Button rounded disabled>
                        <img src={images.icons_github} alt="GitHub" className="w-6 h-6" />
                    </Button>
                    <Button rounded disabled>
                        <img src={images.icons_facebook} alt="Facebook" className="w-6 h-6" />
                    </Button>
                </div> */}
                <div className="w-full flex items-center justify-center pb-3">
                    <p className="text-sm font-normal">
                        Don&apos;t have an account?{' '}
                        <span
                            onClick={() => {
                                navigate('/signup');
                            }}
                            className="font-semibold underline underline-offset-2 cursor-pointer hover:text-primary"
                        >
                            Signup for free!
                        </span>
                    </p>
                </div>
            </div>
        </>
    );
}

export default Signin;
