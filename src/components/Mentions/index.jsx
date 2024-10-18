import { Mention, MentionsInput } from 'react-mentions';
// import defaultStyle from './defaultStyle';
// import './index.css';
import { useCallback, useState } from 'react';
function Mentions({ placeholder }) {
    const [body, setBody] = useState('');
    console.log(body);

    const [hashtags, setHashtags] = useState([]);
    console.log(hashtags);
    const [title, setTitle] = useState('');
    const [tagNames, setTagNames] = useState([]);

    const [suggestions, setSuggestions] = useState([]);

    const handleInputChange = useCallback((e) => {
        const value = e.target.value;
        setBody(value);

        // Sử dụng regex để tách hashtag và loại bỏ các phần markup
        const hashtagRegex = /#[a-zA-Z0-9_]+/g;
        const currentHashtags = value.match(hashtagRegex) || []; // Tìm hashtag đơn giản
        setHashtags(currentHashtags); // Cập nhật mảng hashtags như ["#Jack", "#AnotherHashtag"]
        console.log(currentHashtags);

        // Gọi API nếu phát hiện có ký tự "#"
        const lastWord = value.split(' ').pop(); // Lấy từ cuối cùng đang nhập
        if (lastWord.startsWith('#')) {
            const hashtagQuery = lastWord.slice(1); // Bỏ ký tự "#"
            if (hashtagQuery) {
                // fetchHashtags(hashtagQuery); // Gọi API để lấy hashtags gợi ý
                console.log(hashtagQuery);
            }
        } else {
            setSuggestions([]); // Nếu không có ký tự "#", xóa gợi ý
        }
    }, []);
    const mentionStyle = {
        backgroundColor: '#e6f7ff', // Background color
        color: '#0056b3', // Text color for the mention
    };
    const users = [
        {
            id: 'jack',
            display: 'Jack',
        },
        {
            id: 'tan',
            display: 'Tan',
        },
    ];
    const hashtags1 = [
        {
            id: 'jack',
            display: 'Jack',
        },
        {
            id: 'tan',
            display: 'Tan',
        },
    ];
    return (
        <>
            <div className="description outline-none">
                <MentionsInput
                    className="mentions"
                    spellCheck="false"
                    placeholder="Describe everything about this post here"
                    onChange={(e) => setBody(e.target.value)}
                    value={body}
                >
                    <Mention
                        trigger="@"
                        data={users}
                        markup="@@@____id__^^^____display__@@@^^^"
                        style={{
                            backgroundColor: '#daf4fa',
                        }}
                        // onAdd={(id) => setActorIds((actorIds) => [...actorIds, id])}
                        appendSpaceOnAdd={true}
                    />
                    {/* <Mention
                  trigger="#"
                  data={asyncTags}
                  markup="$$$____id__~~~____display__$$$~~~"
                  style={{
                    backgroundColor: "#daf4fa",
                  }}
                  onAdd={(display) =>
                    setTagNames((tagNames) => [...tagNames, display])
                  }
                  appendSpaceOnAdd={true}
                /> */}
                </MentionsInput>
            </div>
        </>
    );
}

export default Mentions;
