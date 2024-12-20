import images from '../../assets/images';

const TrendingList = () => {
    return (
        <div className="mt-4 flex items-center">
            <div>
                <p className="text-gray-500 text-[14px] mb-1">Entertainment · LIVE</p>
                <h1 className="font-medium pr-2">Bigg Boss 16: Salman Khan returns with a brand new season</h1>
            </div>

            <div className="w-36 h-auto">
                <img className="rounded-3xl object-cover w-full h-auto" src={images.placeholderAvatar} />
            </div>
        </div>
    );
};

export default TrendingList;
