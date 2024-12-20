import FollowBar from '../FollowBar';
import { BsSearch } from 'react-icons/bs';
import TrendingList from '../TrendingBar';
import { useEffect, useRef, useState } from 'react';
import useDebounce from '../../hooks/custom/useDebounce';
import http from '../../utils/http';
import { Wrapper as PopperWrapper } from '../Popper';
import HeadlessTippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css'; // optional
import { Link } from 'react-router-dom';
import Avatar from '../Avatar';
import { CiCircleRemove } from 'react-icons/ci';
function InformationBar({ hasSearch = false }) {
    const [searchValue, setSearchValue] = useState('');
    const [suggest, setSuggest] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const inputRef = useRef();
    const debounce = useDebounce(searchValue, 800);
    useEffect(() => {
        const fetchData = async () => {
            try {
                let response = await http.get(`/api/search/mentions?q=${debounce}&page=1&limit=6`);
                setSuggest(response.data.result.users);
            } catch (error) {
                setSuggest([]);
            }
        };
        fetchData();
    }, [debounce]);
    const handleHideResult = () => {
        setShowResults(false);
    };
    const handleClear = () => {
        setSearchValue('');
        setSuggest([]);
        setShowResults(false);
    };
    return (
        <div className="hidden lg:block w-[300px] mr-4 lg:mr-0 mt-2">
            {!hasSearch && (
                <HeadlessTippy
                    interactive
                    //
                    appendTo={() => document.body}
                    //
                    visible={showResults}
                    // trigger="click"
                    placement="bottom-start"
                    // Attribute cho phep render ra popup voi dieu kien la
                    // visible
                    render={(attrs) => {
                        return (
                            <div className="w-full max-h-4 min-w-[18.8rem]" tabIndex="-1" {...attrs}>
                                <PopperWrapper search overflow>
                                    {suggest.length > 0 ? (
                                        suggest.map((result) => {
                                            // console.log(result);
                                            return (
                                                <Link
                                                    key={result._id}
                                                    to={`/api/user/profile?user_id=${result._id}`}
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
                                        })
                                    ) : (
                                        <div className="p-3">
                                            <p className="font-semibold text-sm leading-5 overflow-hidden text-ellipsis whitespace-nowrap w-[240px]">
                                                Try searching for people, lists, or keywords
                                            </p>
                                        </div>
                                    )}
                                </PopperWrapper>
                            </div>
                        );
                    }}
                    onClickOutside={handleHideResult}
                >
                    <div className="flex gap-2 rounded-full border-gray-500 bg-white border-2 py-2 px-4 items-center text-xl sticky top-2 z-10">
                        <BsSearch />
                        <input
                            ref={inputRef}
                            className="bg-transparent w-full outline-none"
                            type="text"
                            placeholder="Search Twitter"
                            onChange={(e) => setSearchValue(e.target.value)}
                            onFocus={() => setShowResults(true)}
                            value={searchValue}
                        />
                        {!!searchValue && (
                            <button onClick={handleClear} className="text-xs text-sky-500 font-semibold ">
                                Remove
                            </button>
                        )}
                    </div>
                </HeadlessTippy>
            )}
            {/* FollowBar */}
            <div className="rounded-[20px] border border-neutral-400 mt-4 px-4 py-4">
                <h2 className="text-2xl font-medium">Who to follow</h2>
                <FollowBar />
            </div>
            <div className="rounded-[20px] border border-neutral-400 mt-4 px-4 py-4">
                <h2 className="text-2xl font-medium">Trending</h2>
                <TrendingList />
                <TrendingList />
                <TrendingList />
                <TrendingList />
                <TrendingList />
            </div>
            {/* <div className="overflow-y-auto fixed w-[300px] h-screen">
                
            </div> */}
        </div>
    );
}

export default InformationBar;
