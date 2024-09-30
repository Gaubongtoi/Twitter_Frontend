import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

function ImageUpload({ onChange, label, value, disabled }) {
    const [file, setFile] = useState(value);
    // console.log(!file);

    const handleDrop = useCallback(
        (files) => {
            const uploadedFile = files[0];
            // console.log(files);
            uploadedFile.preview = URL.createObjectURL(uploadedFile);
            setFile(uploadedFile); // Generate a local URL for the uploaded file
            onChange(uploadedFile); // Pass the file directly
        },
        [onChange],
    );

    const { getRootProps, getInputProps } = useDropzone({
        maxFiles: 3,
        onDrop: handleDrop,
        disabled,
        accept: {
            'image/jpeg': [],
            'image/png': [],
        },
    });

    return (
        <div
            {...getRootProps({
                className: 'w-full p-4 text-center border-2 border-dotted rounded-md border-neutral-700',
            })}
        >
            <input {...getInputProps()} />
            <div className="flex justify-center items-center h-full">
                {file ? (
                    file?.preview && (
                        <div className="flex items-center justify-center">
                            <img src={file.preview} alt="Upload Image" className="w-[70px] h-auto" />
                        </div>
                    )
                ) : (
                    <p>{label}</p>
                )}
            </div>
        </div>
    );
}

export default ImageUpload;
