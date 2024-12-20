import { useEffect, useState } from 'react';
import Modal from '..';
import useAddMessage from '../../../hooks/modal/useAddMessage';
import { BsSearch } from 'react-icons/bs';
import useDebounce from '../../../hooks/custom/useDebounce';
import http from '../../../utils/http';
import Avatar from '../../Avatar';
import { Link } from 'react-router-dom';

function ModalAddMessage() {
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [suggest, setSuggest] = useState([]);
    const debounce = useDebounce(searchValue, 800);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response = await http.get(`/api/search/mentions?q=${debounce}&page=1&limit=10`);
                setSuggest(response.data.result.users);
            } catch (error) {
                setSuggest([]);
            }
        };
        fetchData();
    }, [debounce]);
    const addMessageModal = useAddMessage();
    const handleClear = () => {
        setSearchValue('');
        setSuggest([]);
        addMessageModal.onClose();
    };
    const bodyContent = (
        <div className="min-h-72">
            <div className="w-full mb-2 sticky top-4 z-10">
                <div className="flex gap-2 rounded-full border-gray-500 bg-white border-2 py-2 px-4 items-center text-sm ">
                    <BsSearch />
                    <input
                        // ref={inputRef}
                        className="bg-transparent w-full outline-none"
                        type="text"
                        placeholder="Search Direct Messages"
                        onChange={(e) => setSearchValue(e.target.value)}
                        value={searchValue}
                    />
                </div>
            </div>
            <div className=" max-h-96 overflow-auto mb-4 border-l border-gray-400">
                {suggest.length > 0 &&
                    suggest.map((result) => {
                        // console.log(result);
                        return (
                            <Link
                                key={result._id}
                                to={`api/message?receiver_id=${result._id}`}
                                onClick={() => handleClear()}
                                className="p-3 flex items-center hover:no-underline hover:bg-gray-200"
                            >
                                <Avatar userId={result._id} />
                                <div className="ml-2 flex flex-col justify-center">
                                    <p className="font-semibold text-sm leading-5 overflow-hidden text-ellipsis whitespace-nowrap w-[200px]">
                                        {result.name}
                                    </p>
                                    <p className="text-neutral-400 text-sm leading-5 overflow-hidden text-ellipsis whitespace-nowrap w-[200px]">
                                        @{result.username}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
            </div>
        </div>
    );
    return (
        <>
            <Modal
                disabled={isLoading}
                isOpen={addMessageModal.isOpen}
                title="New message"
                // actionLabel="Save"
                onClose={addMessageModal.onClose}
                // onSubmit={onSubmit}
                body={bodyContent}
                // footer={footerContent}
                redirect={true}
                // redirect={true}
            />
        </>
    );
}

export default ModalAddMessage;
