import { useForm } from 'react-hook-form';
import useCurrentUser from '../../../hooks/auth/useCurrentUser';
import useUser from '../../../hooks/auth/useUser';
import useEditModal from '../../../hooks/modal/useEditModal';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useState } from 'react';
import http from '../../../utils/http';
import toast from 'react-hot-toast';
import Modal from '..';
import Input from '../../Input';

function ModalEdit() {
    const { data: currentUser } = useCurrentUser();
    const { mutate: mutateFetchedUser } = useUser(currentUser?.result?._id);
    const editModal = useEditModal();
    const [isFormDirty, setIsFormDirty] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const schema = yup
        .object()
        .shape({
            name: yup.string().required('You need to fill this field!'),
            date_of_birth: yup.string().required('You need to fill this field!'),
            bio: yup.string().required('You need to fill this field!'),
            location: yup.string().required('You need to fill this field!'),
            website: yup.string().required('You need to fill this field!'),
            username: yup.string().required('You need to fill this field!'),
            avatar: yup.string().required('You need to fill this field!'),
            cover_photo: yup.string().required('You need to fill this field!'),
        })
        .required();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, dirtyFields },
    } = useForm({
        defaultValues: {
            userName: '',
            email: '',
            phoneNumber: '',
        },
        resolver: yupResolver(schema),
    });
    // const defaultValues = useMemo(() => {
    //     return {
    //         name: currentUser?.result?.name,
    //         date_of_birth: currentUser?.result?.date_of_birth,
    //         bio: currentUser?.result?.bio,
    //         location: currentUser?.result?.location,
    //         website: currentUser?.result?.website,
    //         username: currentUser?.result?.username,
    //         avatar: currentUser?.result?.avatar,
    //         cover_photo: currentUser?.result?.cover_photo,
    //     };
    // }, [currentUser]);
    const defaultValues = {
        name: currentUser?.result?.name,
        date_of_birth: currentUser?.result?.date_of_birth,
        bio: currentUser?.result?.bio,
        location: currentUser?.result?.location,
        website: currentUser?.result?.website,
        username: currentUser?.result?.username,
        avatar: currentUser?.result?.avatar,
        cover_photo: currentUser?.result?.cover_photo,
    };
    // const currentValues = useMemo(() => {
    //     return {
    //         name: watch('name', defaultValues.name),
    //         date_of_birth: watch('date_of_birth', defaultValues.date_of_birth),
    //         bio: watch('bio', defaultValues.bio),
    //         location: watch('location', defaultValues.location),
    //         website: watch('website', defaultValues.website),
    //         username: watch('username', defaultValues.username),
    //         avatar: watch('avatar', defaultValues.avatar),
    //         cover_photo: watch('cover_photo', defaultValues.cover_photo),
    //     };
    // }, [defaultValues, watch]);
    // console.log(currentValues);
    const currentValues = {
        name: watch('name', defaultValues.name),
        date_of_birth: watch('date_of_birth', defaultValues.date_of_birth),
        bio: watch('bio', defaultValues.bio),
        location: watch('location', defaultValues.location),
        website: watch('website', defaultValues.website),
        username: watch('username', defaultValues.username),
        avatar: watch('avatar', defaultValues.avatar),
        cover_photo: watch('cover_photo', defaultValues.cover_photo),
    };
    console.log(currentValues);

    useEffect(() => {
        const isDirty = Object.keys(dirtyFields).some(
            (fieldName) => currentValues[fieldName] !== defaultValues[fieldName],
        );
        setIsFormDirty(isDirty);
    }, [dirtyFields, currentValues, defaultValues]);

    const onSubmit = async (data) => {
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const dataPost = {
            fullname: data.fullname,
            name: data.name,
            email: data.email,
            phone: data.phoneNumber,
            address: data.address,
        };
        try {
            setIsLoading(true);
            // console.log(dataPost);
            await delay(2000); // Chờ 2 giây
            const res = await http.put(`/api/user/me`, dataPost);
            mutateFetchedUser();
            toast.success('Updated');
            editModal.onClose();
        } catch (error) {
            // Xử lý lỗi nếu có
            console.log(error);
            toast.error('Something went wrong!');
        } finally {
            setIsLoading(false);
        }
    };
    const bodyContent = (
        <div className="flex flex-col gap-4">
            <input
                className="w-full text-black py-2 my-2 bg-transparent pl-6 border-b border-black outline-none focus:outline-none"
                type="text"
                value={currentValues.name}
                {...register('name')}
            />
            {errors.name && <span className="form-message text-sm text-red-500">{errors.name.message}</span>}
            <input
                className="w-full text-black py-2 my-2 bg-transparent pl-6 border-b border-black outline-none focus:outline-none"
                type="date"
                value={currentValues.date_of_birth}
                {...register('date_of_birth')}
            />
            {errors.date_of_birth && (
                <span className="form-message text-sm text-red-500">{errors.date_of_birth.message}</span>
            )}
            <input
                className="w-full text-black py-2 my-2 bg-transparent pl-6 border-b border-black outline-none focus:outline-none"
                type="text"
                value={currentValues.bio}
                {...register('bio')}
            />
            {errors.bio && <span className="form-message text-sm text-red-500">{errors.bio.message}</span>}
        </div>
    );
    return (
        <Modal
            disabled={isLoading}
            isOpen={editModal.isOpen}
            title="Edit your profile"
            actionLabel="Save"
            onClose={editModal.onClose}
            onSubmit={onSubmit}
            body={bodyContent}
            redirect={true}
        />
    );
}

export default ModalEdit;
