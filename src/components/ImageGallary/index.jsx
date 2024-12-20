import LightGallery from 'lightgallery/react';
import lgZoom from 'lightgallery/plugins/zoom';
import lgVideo from 'lightgallery/plugins/video';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-share.css';
import 'lightgallery/css/lg-rotate.css';
// import './lightGallary.css';
function ImageGallary({ images = [], video = [] }) {
    return (
        <div className="w-full h-auto mt-3">
            <LightGallery
                plugins={[lgZoom, lgVideo, lgThumbnail]}
                speed={500}
                elementClassNames={`${
                    images.length === 3 || images.length === 4
                        ? 'grid grid-cols-2 gap-1 h-[200px] sm:h-[300px]'
                        : 'flex justify-center items-center gap-1'
                } bg-neutral-100 rounded-lg`}
                itemSelector="a" // Sử dụng <a> làm selector
                controls={true}
            >
                {/* Xử lý trường hợp có 3 hình ảnh */}
                {images.length === 3 ? (
                    <>
                        {/* Hình thứ nhất chiếm 2 hàng */}
                        <a href={images[0]} className="block col-span-1 row-span-2 overflow-hidden rounded-lg">
                            <img
                                className="object-cover w-full h-full cursor-pointer transition duration-200 hover:scale-105 rounded-lg"
                                src={images[0]}
                                data-src={images[0]}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </a>
                        {/* Hình thứ hai */}
                        <a href={images[1]} className="block overflow-hidden rounded-lg">
                            <img
                                className="object-cover w-full cursor-pointer transition duration-200 hover:scale-105 rounded-lg"
                                src={images[1]}
                                data-src={images[1]}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </a>
                        {/* Hình thứ ba */}
                        <a href={images[2]} className="block overflow-hidden rounded-lg">
                            <img
                                className="object-cover w-full cursor-pointer transition duration-200 hover:scale-105 rounded-lg"
                                src={images[2]}
                                data-src={images[2]}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </a>
                    </>
                ) : images.length === 4 ? (
                    <>
                        <a href={images[0]} className="block overflow-hidden rounded-lg">
                            <img
                                className="object-cover w-full h-full cursor-pointer transition duration-200 hover:scale-105 rounded-lg"
                                src={images[0]}
                                data-src={images[0]}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </a>
                        {/* Hình thứ hai */}
                        <a href={images[1]} className="block overflow-hidden rounded-lg">
                            <img
                                className="object-cover w-full h-full cursor-pointer transition duration-200 hover:scale-105 rounded-lg"
                                src={images[1]}
                                data-src={images[1]}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </a>
                        {/* Hình thứ ba */}
                        <a href={images[2]} className="block overflow-hidden rounded-lg">
                            <img
                                className="object-cover w-full h-full cursor-pointer transition duration-200 hover:scale-105 rounded-lg"
                                src={images[2]}
                                data-src={images[2]}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </a>
                        <a href={images[3]} className="block overflow-hidden rounded-lg">
                            <img
                                className="object-cover w-full cursor-pointer transition duration-200 hover:scale-105 rounded-lg"
                                src={images[3]}
                                data-src={images[3]}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </a>
                    </>
                ) : (
                    images.map((img, key) => (
                        <a href={img} key={key} className="inline-block w-full">
                            <img
                                className="object-cover w-full h-full cursor-pointer transition duration-200 hover:scale-105 rounded-lg"
                                src={img}
                                data-src={img}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </a>
                    ))
                )}
            </LightGallery>
        </div>
    );
}

export default ImageGallary;
