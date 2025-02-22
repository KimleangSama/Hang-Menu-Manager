import { CreateMenuFormData } from "@/types/request/create-menu-request";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { getCurrencySign, getFullPrice } from "@/lib/helpers";
import { Card } from "../ui/card";

const PreviewMenu = ({ menu, image, images }: { menu: CreateMenuFormData, image: File, images: File[] }) => {
    return (
        <Card className="flex items-center justify-center py-4">
            <div className="bg-white p-4 rounded-lg shadow-md w-[95%] max-w-lg">
                <h2 className="text-xl font-semibold mb-2">{menu.name}</h2>
                <Swiper
                    style={{ "--swiper-navigation-color": "red", "--swiper-pagination-color": "red" } as React.CSSProperties}
                    lazyPreloaderClass="swiper-lazy-preloader"
                    lazyPreloadPrevNext={1}
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation={true}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    modules={[Navigation, Pagination]}
                    className="mySwiper"
                >
                    {image &&
                        <SwiperSlide key={'menu'} className="relative">
                            <img loading="lazy" src={URL.createObjectURL(image)} alt={menu.name} className="rounded-md object-cover" />
                        </SwiperSlide>
                    }
                    {images?.map((image, index) => (
                        <SwiperSlide key={index} className="relative">
                            <img
                                loading="lazy"
                                src={URL.createObjectURL(image)}
                                alt={menu.name}
                                className="rounded-md object-cover"
                            />
                            <div className="swiper-lazy-preloader swiper-lazy-preloader-red"></div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="my-2 flex flex-col">
                    {menu.discount && Number(menu.discount) > 0 && <p className='text-red-500 line-through'>{getFullPrice(menu.currency, Number(menu.discount), Number(menu.price))}</p>}
                    <p>{getCurrencySign(menu.currency)}{menu.price}</p>
                </div>
                <div className="mb-2">
                    <p className="text-gray-600 text-sm">{menu.description}</p>
                </div>
            </div>
        </Card>
    )
}

export default PreviewMenu;