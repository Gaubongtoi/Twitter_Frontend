import { useForm } from 'react-hook-form';
import useCurrentUser from '../../../hooks/auth/useCurrentUser';
import useEditModal from '../../../hooks/modal/useEditModal';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import http from '../../../utils/http';
import toast from 'react-hot-toast';
import Modal from '..';
import { dateToISOString, getCurrentDate, ISOStringToDate } from '../../../utils/currentDate';
import Button from '../../Button';
import ImageUpload from '../../ImageUpload';

function ModalEdit() {
    const { data: currentUser, mutate: mutateFetchedUser } = useCurrentUser();
    const editModal = useEditModal();
    const [isLoading, setIsLoading] = useState(false);
    const [profileImage, setProfileImage] = useState('');
    const [coverImage, setCoverImage] = useState('');
    // console.log(typeof profileImage?.files[0]);
    // console.log(profileImage);

    const defaultValues = {
        name: currentUser?.result?.name || '',
        date_of_birth: currentUser?.result?.date_of_birth || '',
        bio: currentUser?.result?.bio || '',
        location: currentUser?.result?.location || '',
        website: currentUser?.result?.website || '',
        username: currentUser?.result?.username || '',
    };
    const schema = yup
        .object()
        .shape({
            name: yup.string().required('This field is required!'),
            date_of_birth: yup
                .date()
                .nullable()
                .transform((value, originalValue) => {
                    // Chuyển chuỗi rỗng thành null
                    return originalValue === '' ? null : value;
                })
                .max(new Date(), 'Date of birth cannot be in the future')
                .min(new Date(1900, 0, 1), 'Date of birth cannot be before January 1, 1900'),
            bio: yup.string().nullable(),
            location: yup.string().nullable(),
            website: yup.string().nullable(),
            username: yup.string().required('This field is required!'),
        })
        .required();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, dirtyFields, isDirty },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: defaultValues,
    });
    useEffect(() => {
        if (currentUser) {
            reset({
                name: currentUser?.result?.name || '',
                date_of_birth: ISOStringToDate(currentUser?.result?.date_of_birth) || '',
                bio: currentUser?.result?.bio || '',
                location: currentUser?.result?.location || '',
                website: currentUser?.result?.website || '',
                username: currentUser?.result?.username || '',
            });
        }
    }, [currentUser, reset]);
    const onSubmit = async (data) => {
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const loadingToast = toast.loading('Waiting...');
        const dataPatch = Object.fromEntries(
            Object.entries({
                ...data,
                date_of_birth: data.date_of_birth === null ? '' : dateToISOString(data.date_of_birth),
            }).filter(([key, value]) => value !== ''),
        );
        const formdata_avatar = new FormData();
        formdata_avatar.append('image', profileImage);
        const formdata_cover_photo = new FormData();
        formdata_cover_photo.append('image', coverImage);
        try {
            setIsLoading(true);
            await delay(import.meta.env.VITE_DELAY_REQUEST);
            if (profileImage !== '' && coverImage !== '') {
                const [avatarRes, coverPhotoRes] = await Promise.all([
                    http.post('/api/medias/upload-image', formdata_avatar, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }),
                    http.post('/api/medias/upload-image', formdata_cover_photo, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }),
                ]);
                const res = await http.patch(`/api/user/me`, {
                    ...dataPatch,
                    date_of_birth: data.date_of_birth === null ? '' : dateToISOString(data.date_of_birth),
                    avatar: avatarRes.data.result[0].cloudinary_url,
                    cover_photo: coverPhotoRes.data.result[0].cloudinary_url,
                });
                mutateFetchedUser();
                toast.success(`${res.data.message}`, {
                    id: loadingToast,
                });
                editModal.onClose();
            } else if (profileImage !== '' && coverImage === '') {
                const avatarRes = await http.post('/api/medias/upload-image', formdata_avatar, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const res = await http.patch(`/api/user/me`, {
                    ...dataPatch,
                    date_of_birth: data.date_of_birth === null ? '' : dateToISOString(data.date_of_birth),
                    avatar: avatarRes.data.result[0].cloudinary_url,
                });
                mutateFetchedUser();
                toast.success(`${res.data.message}`, {
                    id: loadingToast,
                });
                editModal.onClose();
            } else if (profileImage === '' && coverImage !== '') {
                const coverPhotoRes = await http.post('/api/medias/upload-image', formdata_cover_photo, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const res = await http.patch(`/api/user/me`, {
                    ...dataPatch,
                    date_of_birth: data.date_of_birth === null ? '' : dateToISOString(data.date_of_birth),
                    cover_photo: coverPhotoRes.data.result[0].cloudinary_url,
                });
                mutateFetchedUser();
                toast.success(`${res.data.message}`, {
                    id: loadingToast,
                });
                editModal.onClose();
            } else {
                const res = await http.patch(`/api/user/me`, {
                    ...dataPatch,
                    date_of_birth: data.date_of_birth === null ? '' : dateToISOString(data.date_of_birth),
                });
                mutateFetchedUser();
                toast.success(`${res.data.message}`, {
                    id: loadingToast,
                });
                editModal.onClose();
            }
        } catch (error) {
            // Xử lý lỗi nếu có
            toast.error(`${error.response.data.message}`, {
                id: loadingToast,
            });
        } finally {
            setIsLoading(false);
            toast.dismiss(loadingToast);
        }
    };
    const bodyContent = (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-3">
                <ImageUpload
                    value={profileImage}
                    disabled={isLoading}
                    onChange={(image) => setProfileImage(image)}
                    label="Upload Avatar"
                />
                <ImageUpload
                    value={coverImage}
                    disabled={isLoading}
                    onChange={(image) => setCoverImage(image)}
                    label="Upload Cover Background"
                />
            </div>
            <div className="flex flex-row gap-6">
                <div className="w-1/2">
                    <p className="text-xs">Your name:</p>
                    <input
                        className="w-full text-black pb-[10px] mt-2 bg-transparent border-b border-black outline-none focus:outline-none"
                        type="text"
                        defaultValue={currentUser?.result?.name}
                        placeholder="Your Name"
                        {...register('name')}
                    />
                    {errors.name && <span className="form-message text-xs text-red-500">{errors.name.message}</span>}
                </div>
                <div className="w-1/2">
                    <p className="text-xs">Date of birth:</p>
                    <input
                        className="w-full text-black pb-2 mt-2 bg-transparent border-b border-black outline-none focus:outline-none"
                        type="date"
                        defaultValue={ISOStringToDate(currentUser?.result?.date_of_birth)}
                        {...register('date_of_birth')}
                    />
                    {errors.date_of_birth && (
                        <span className="form-message text-xs text-red-500">{errors.date_of_birth.message}</span>
                    )}
                </div>
            </div>
            <div>
                <p className="text-xs">Bio:</p>
                <textarea
                    className="w-full text-black pb-3 mt-2 bg-transparent border-b border-black outline-none focus:outline-none resize-none"
                    defaultValue={currentUser?.result?.bio}
                    placeholder="Your Bio"
                    {...register('bio')}
                />
                {errors.bio && <span className="form-message text-xs text-red-500">{errors.bio.message}</span>}
            </div>
            <div>
                <p className="text-xs">Website:</p>
                <input
                    className="w-full text-black pb-3 mt-2 bg-transparent border-b border-black outline-none focus:outline-none"
                    type="text"
                    defaultValue={currentUser?.result?.website}
                    placeholder="Your Website"
                    {...register('website')}
                />
                {errors.website && <span className="form-message text-xs text-red-500">{errors.website.message}</span>}
            </div>
            <div>
                <p className="text-xs">Username:</p>

                <input
                    className="w-full text-black pb-3 mt-2 bg-transparent border-b border-black outline-none focus:outline-none"
                    type="text"
                    defaultValue={currentUser?.result?.username}
                    placeholder="Your Username"
                    {...register('username')}
                />
                {errors.username && (
                    <span className="form-message text-xs text-red-500">{errors.username.message}</span>
                )}
            </div>
        </div>
    );
    const footerContent = !isLoading ? (
        <Button primary rounded onClick={(e) => handleSubmit(onSubmit)(e)}>
            Save
        </Button>
    ) : (
        <Button disabled primary rounded>
            Save
        </Button>
    );
    return (
        <>
            <Modal
                disabled={isLoading}
                isOpen={editModal.isOpen}
                title="Edit your profile"
                actionLabel="Save"
                onClose={editModal.onClose}
                // onSubmit={onSubmit}
                body={bodyContent}
                footer={footerContent}
                redirect={true}
                // redirect={true}
            />
        </>
    );
}

export default ModalEdit;
