import Button from '../../components/Button';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import http from '../../utils/http';
import { useNavigate } from 'react-router-dom';
function Signup() {
    const navigate = useNavigate();
    const schema = yup
        .object()
        .shape({
            name: yup.string().required('You need to fill this field!'),
            email: yup
                .string()
                .required('You need to fill this field!')
                .email('Invalid Email!')
                .matches(/@gmail\.com$/, 'Email must end with @gmail.com'),
            password: yup
                .string()
                .required('You need to fill this field!')
                .min(6, 'Password must be at least 6 characters long')
                .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
                .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
                .matches(/\d/, 'Password must contain at least one number')
                .matches(/[@$!%*?&]/, 'Password must contain at least one symbol'),
            confirm_password: yup
                .string()
                .required('You need to fill this field!')
                .oneOf([yup.ref('password')], `Password don't matched`),
            date_of_birth: yup
                .date()
                .required('Date of birth is required')
                .max(new Date(), 'Date of birth cannot be in the future')
                .min(new Date(1900, 0, 1), 'Date of birth cannot be before January 1, 1900'),
        })
        .required();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            // userName: '',
            // email: '',
            // phoneNumber: '',
        },
        resolver: yupResolver(schema),
    });
    const handleLogin = async (data) => {
        // Fix a date reduce when reverse ISOString
        const localDateISOString = new Date(
            data.date_of_birth.getTime() - data.date_of_birth.getTimezoneOffset() * 60000,
        ).toISOString();
        let dataBody = {
            ...data,
            date_of_birth: localDateISOString,
        };
        try {
            let response = await http.post(`/api/user/register`, dataBody);
            // console.log(response);
        } catch (error) {
            // console.log(error.response.data);
        }
    };
    return (
        <>
            <div className="w-full max-w-md mx-auto flex flex-col">
                {/* Tiêu đề */}
                <div className="w-full flex flex-col mb-6 text-center ">
                    <h3 className="text-2xl md:text-4xl font-bold mb-4 text-[#269BEB]">Signup</h3>
                    <p className="text-sm md:text-base mb-2">Join the community. It only takes a moment!</p>
                </div>
                {/* Các input */}
                <div className="w-full flex flex-col mb-4">
                    <input
                        className="w-full text-black py-2 my-2 bg-transparent pl-6 border-b border-black outline-none focus:outline-none"
                        type="text"
                        placeholder="Your name"
                        {...register('name')}
                    />
                    {errors.name && <span className="form-message text-sm text-red-500">{errors.name.message}</span>}

                    <input
                        className="w-full text-black py-2 my-2 bg-transparent pl-6 border-b border-black outline-none focus:outline-none"
                        type="text"
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

                    <input
                        className="w-full text-black py-2 my-2 bg-transparent pl-6 border-b border-black outline-none focus:outline-none"
                        type="password"
                        placeholder="Confirm Password"
                        {...register('confirm_password')}
                    />
                    {errors.confirm_password && (
                        <span className="form-message text-sm text-red-500">{errors.confirm_password.message}</span>
                    )}

                    <input
                        className="w-full text-black py-2 my-2 bg-transparent pl-6 border-b border-black outline-none focus:outline-none"
                        type="date"
                        placeholder="Date of birth"
                        {...register('date_of_birth')}
                    />
                    {errors.date_of_birth && (
                        <span className="form-message text-sm text-red-500">{errors.date_of_birth.message}</span>
                    )}
                </div>
                {/* Button login */}
                <div className="w-full flex items-center justify-center mb-4">
                    <Button
                        primary
                        rounded
                        onClick={(e) => {
                            handleSubmit(handleLogin)(e);
                        }}
                    >
                        Signup
                    </Button>
                </div>
                {/* Đăng nhập */}
                <div className="w-full flex items-center justify-center pb-3">
                    <p className="text-sm font-normal">
                        Already have an account?{' '}
                        <span
                            onClick={() => {
                                navigate('/signin');
                            }}
                            className="font-semibold underline underline-offset-2 cursor-pointer hover:text-primary"
                        >
                            Log in here!
                        </span>
                    </p>
                </div>
            </div>
        </>
    );
}

export default Signup;
