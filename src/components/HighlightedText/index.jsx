import { useMemo } from 'react';
import HeadlessTippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css'; // optional

import { Wrapper as PopperWrapper } from '../Popper';
import Avatar from '../Avatar';

const HighlightedText = ({ input, mentions, data }) => {
    console.log(mentions);

    const transformedContent = useMemo(() => {
        // Thay thế định dạng #[...] và @[...]
        return input
            ?.replace(/#\[(.*?)\]\((.*?)\)/g, '#$1') // Thay thế #[Name](id)
            ?.replace(/@\[(.*?)\]\((.*?)\)/g, '@$1'); // Thay thế @[Name](id)
    }, [input]);

    const renderHighlightedText = () => {
        return transformedContent?.split(' ').map((word, index) => {
            // Kiểm tra nếu từ bắt đầu bằng '#' hoặc '@'
            console.log();
            if (word.startsWith('#')) {
                return (
                    <span
                        key={index}
                        className="text-[#1da1f2] font-semibold hover:text-primary_darken hover:underline"
                    >
                        {word + ' '}
                    </span>
                );
            } else if (word.startsWith('@')) {
                return (
                    <>
                        <HeadlessTippy
                            interactive
                            appendTo={() => document.body}
                            placement="bottom"
                            delay={[300, 0]}
                            render={(attrs) => {
                                return (
                                    <div className="w-auto h-full min-w-80" tabIndex="-1" {...attrs}>
                                        <PopperWrapper>
                                            <div className="p-3">
                                                <Avatar
                                                    userId={
                                                        mentions[
                                                            mentions.findIndex((mention) => {
                                                                return `@${mention?.username}` === word;
                                                            })
                                                        ]?._id
                                                    }
                                                />
                                                <div className="mt-2">
                                                    <p className="text-[17px] font-semibold">
                                                        {
                                                            mentions[
                                                                mentions.findIndex((mention) => {
                                                                    return `@${mention?.username}` === word;
                                                                })
                                                            ]?.name
                                                        }
                                                    </p>
                                                    <p className="text-[15px] text-dark_6 mt-1">
                                                        {`@${
                                                            mentions[
                                                                mentions.findIndex((mention) => {
                                                                    return `@${mention?.username}` === word;
                                                                })
                                                            ]?.username
                                                        }`}
                                                    </p>
                                                    <p className="text-[15px] mt-1">
                                                        {mentions[
                                                            mentions.findIndex((mention) => {
                                                                return `@${mention?.username}` === word;
                                                            })
                                                        ]?.bio !== ''
                                                            ? mentions[
                                                                  mentions.findIndex((mention) => {
                                                                      return `@${mention?.username}` === word;
                                                                  })
                                                              ]?.bio
                                                            : 'User has not updated their bio'}
                                                    </p>
                                                </div>
                                                <div className="flex flex-row items-center mt-2 gap-6">
                                                    <div className="flex flex-row items-center gap-1">
                                                        <p className="">
                                                            {
                                                                mentions[
                                                                    mentions.findIndex((mention) => {
                                                                        return `@${mention?.username}` === word;
                                                                    })
                                                                ]?.followingUsers?.length
                                                            }
                                                        </p>
                                                        <p className="text-neutral-500">Following</p>
                                                    </div>
                                                    <div className="flex flex-row items-center gap-1">
                                                        <p className="">
                                                            {
                                                                mentions[
                                                                    mentions.findIndex((mention) => {
                                                                        return `@${mention?.username}` === word;
                                                                    })
                                                                ]?.followedUsers?.length
                                                            }
                                                        </p>
                                                        <p className="text-neutral-500">Followers</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </PopperWrapper>
                                    </div>
                                );
                            }}
                        >
                            <span
                                key={index}
                                className="text-[#1da1f2] font-semibold hover:text-primary_darken hover:underline"
                            >
                                {word + ' '}
                            </span>
                        </HeadlessTippy>
                    </>
                );
            }
            return <span key={index}>{word + ' '}</span>; // Thêm khoảng trắng sau mỗi từ
        });
    };

    return <div>{renderHighlightedText()}</div>;
};

export default HighlightedText;
