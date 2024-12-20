import { useCallback, useMemo } from 'react';
import HeadlessTippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css'; // optional

import { Wrapper as PopperWrapper } from '../Popper';
import Avatar from '../Avatar';
import { useNavigate } from 'react-router-dom';
import useCurrentUser from '../../hooks/auth/useCurrentUser';

const HighlightedText = ({ input, mentions }) => {
    const transformedContent = useMemo(() => {
        // Thay thế định dạng #[...] và @[...] thành chuỗi đơn giản
        return input
            ?.replace(/#\[(.*?)\]\((.*?)\)/g, '#$1') // Thay thế #[Name](id)
            ?.replace(/@\[(.*?)\]\((.*?)\)/g, '@$1'); // Thay thế @[Name](id)
    }, [input]);

    const navigator = useNavigate();
    const { data: currentUser } = useCurrentUser();

    const renderHighlightedText = () => {
        return transformedContent
            ?.split(/(\s+|\n)/) // Tách các từ bằng khoảng trắng hoặc xuống dòng
            .map((word, index) => {
                if (word.startsWith('#')) {
                    // Hashtags
                    return (
                        <span
                            key={index}
                            className="text-[#1da1f2] font-semibold hover:text-primary_darken hover:underline"
                        >
                            {word}
                        </span>
                    );
                } else if (word.startsWith('@')) {
                    // Mentions
                    return (
                        <HeadlessTippy
                            key={index}
                            interactive
                            appendTo={() => document.body}
                            placement="bottom"
                            delay={[300, 0]}
                            render={(attrs) => {
                                const mention = mentions.find((mention) => `@${mention?.username}` === word);
                                return mention ? (
                                    <div className="w-auto h-auto min-w-64 max-w-80" tabIndex="-1" {...attrs}>
                                        <PopperWrapper>
                                            <div className="p-3">
                                                <Avatar userId={mention._id} />
                                                <div className="mt-2">
                                                    <p className="text-[17px] font-semibold">{mention.name}</p>
                                                    <p className="text-[15px] text-dark_6 mt-1">@{mention.username}</p>
                                                    <p className="text-[15px] mt-1 break-words">
                                                        {mention.bio || 'User has not updated their bio'}
                                                    </p>
                                                </div>
                                                <div className="flex flex-row items-center mt-2 gap-6">
                                                    <div className="flex flex-row items-center gap-1">
                                                        <p>{mention.followingUsers?.length || 0}</p>
                                                        <p className="text-neutral-500">Following</p>
                                                    </div>
                                                    <div className="flex flex-row items-center gap-1">
                                                        <p>{mention.followedUsers?.length || 0}</p>
                                                        <p className="text-neutral-500">Followers</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </PopperWrapper>
                                    </div>
                                ) : null;
                            }}
                        >
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const mention = mentions.find((mention) => `@${mention?.username}` === word);
                                    if (mention?._id === currentUser.result._id) {
                                        navigator(`/api/user/me`);
                                    } else {
                                        navigator(`/api/user/profile?user_id=${mention?._id}`);
                                    }
                                }}
                                className="text-[#1da1f2] font-semibold hover:text-primary_darken hover:underline"
                            >
                                {word}
                            </span>
                        </HeadlessTippy>
                    );
                } else if (word === '\n') {
                    // Xuống dòng
                    return <br key={index} />;
                }
                // Văn bản thông thường
                return <span key={index}>{word}</span>;
            });
    };

    return <div className="whitespace-pre-wrap">{renderHighlightedText()}</div>;
};

export default HighlightedText;

// function HighlightedTextOnly(input) {
//     const transformedContent = useMemo(() => {
//         // Thay thế định dạng #[...] và @[...]
//         return input
//             ?.replace(/#\[(.*?)\]\((.*?)\)/g, '#$1') // Thay thế #[Name](id)
//             ?.replace(/@\[(.*?)\]\((.*?)\)/g, '@$1'); // Thay thế @[Name](id)
//     }, [input]);
//     const renderHighlightedTextOnly = () => {
//         return transformedContent?.split(' ').map((word, index) => {
//             if (word.startsWith('#') || word.startsWith('@')) {
//                 return (
//                     <span
//                         key={index}
//                         className="text-[#1da1f2] font-semibold hover:text-primary_darken hover:underline"
//                     >
//                         {word + ' '}
//                     </span>
//                 );
//             }
//             return <span key={index}>{word + ' '}</span>; // Thêm khoảng trắng sau mỗi từ
//         });
//     };
//     return <div>{renderHighlightedTextOnly()}</div>;
// }
