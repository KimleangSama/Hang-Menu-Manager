"use client";;
import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { menuService } from '@/services/menu-service';
import { toast } from 'sonner';

import { useParams } from 'next/navigation';
import { MenuResponse } from '../../../../../types/menu-response';
import { API_IMAGE_URL } from '@/constants/auth';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { BADGES } from '@/constants/badges';
import { getCurrencySign, getFullPrice } from '@/lib/helpers';
import { useStoreResponse } from '@/hooks/use-store';
import { FaFacebook, FaInstagram, FaTelegram } from 'react-icons/fa';

const ViewPage = () => {
    const store = useStoreResponse(state => state.store);
    const params = useParams<{ id: string }>();
    const [menuResponse, setMenuResponse] = useState<MenuResponse>();

    useEffect(() => {
        async function fetchTable() {
            const response = await menuService.getMenuById(params.id);
            if (response.success) {
                setMenuResponse(response.payload);
            } else {
                toast.error(response.error);
            }
        }
        fetchTable();
    }, [params.id]);

    if (!menuResponse) {
        return (
            <Card>
                <p>Loading...</p>
            </Card>
        );
    }

    return (
        <div className='mx-auto max-w-6xl grid grid-cols-3 gap-4'>
            <div className="p-4 space-y-6">
                <div className="sticky top-1 z-10 flex justify-between items-center backdrop:blur-sm">
                    <h1 className="text-3xl font-bold">Menu Details</h1>
                </div>
                <div className="grid grid-cols-2 gap-4 px-4">
                    <div>
                        <p className="font-medium text-lg">Code:</p>
                        <p>{menuResponse.code}</p>
                    </div>
                    <div>
                        <p className="font-medium text-lg">Name:</p>
                        <p>{menuResponse.name}</p>
                    </div>
                    <div className='col-span-2'>
                        <p className="font-medium text-lg">Description:</p>
                        <p>{menuResponse.description}</p>
                    </div>
                    <div>
                        <p className="font-medium text-lg">Price:</p>
                        <p>
                            {menuResponse.currency === 'dollar' ? 'USD ' : 'KHR '}
                            {typeof menuResponse.price === 'number' && !isNaN(menuResponse.price)
                                ? menuResponse.price.toFixed(2)
                                : menuResponse.price}
                        </p>
                    </div>
                    <div>
                        <p className="font-medium text-lg">Discount:</p>
                        <p>
                            {menuResponse.currency === 'dollar' ? 'USD ' : 'KHR '}
                            {typeof menuResponse.discount === 'number' && !isNaN(menuResponse.discount)
                                ? menuResponse.discount.toFixed(2)
                                : menuResponse.discount}
                        </p>
                    </div>
                    <div>
                        <p className="font-medium text-lg">Category:</p>
                        <p>{menuResponse.categoryName}</p>
                    </div>
                </div>
            </div>
            <div className='col-span-2'>
                <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[8px] rounded-t-xl h-[172px] max-w-[301px] md:h-[540px] md:max-w-[512px]">
                    <div className="rounded-lg overflow-hidden h-[156px] md:h-[530px] bg-white dark:bg-gray-800 items-center w-full justify-center">
                        <div>
                            <div className="absolute top-2 left-2 flex flex-wrap gap-y-1 items-center z-[9999]">
                                {menuResponse?.badges?.map((badge, index) => (
                                    <div key={index} className="text-white text-[10px] px-1.5 py-0.5 rounded-md mr-1"
                                        style={{ backgroundColor: BADGES.find(b => b.name === badge)?.color }}
                                    >
                                        {BADGES.find(b => b.name === badge)?.name}
                                    </div>
                                ))}
                            </div>
                            <div className='w-full'>
                                <Swiper
                                    style={{ "--swiper-navigation-color": "red", "--swiper-pagination-color": "red", "--swiper-pagination-bullet-inactive-color": "blue;", "--swiper-navigation-size": '24px' } as React.CSSProperties}
                                    lazyPreloaderClass="swiper-lazy-preloader"
                                    lazyPreloadPrevNext={1}
                                    spaceBetween={30}
                                    slidesPerView={1}
                                    navigation={true}
                                    pagination={{ clickable: true, dynamicBullets: true }}
                                    modules={[Navigation, Pagination]}
                                    className="mySwiper"
                                >
                                    <SwiperSlide className='relative'>
                                        {menuResponse.image ? <img src={API_IMAGE_URL + menuResponse.image} alt="menu" className="w-full h-[300px] object-cover" /> : <img src="https://placehold.co/40x30" alt="menu" className="w-full h-[200px] object-cover" />}
                                    </SwiperSlide>
                                    {menuResponse?.images?.map((file, index) => (
                                        <SwiperSlide className='relative' key={index}>
                                            <img src={API_IMAGE_URL + file.name} alt="menu" className="w-full h-[300px] object-cover" />
                                            <div className="swiper-lazy-preloader swiper-lazy-preloader-red"></div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                            <div className="px-4 py-2">
                                {menuResponse.code && <h6 className="text-xs text-gray-500">Code: {menuResponse.code}</h6>}
                                <h3 className="font-semibold">{menuResponse.name}</h3>
                                <article className='text-pretty overflow-auto'>
                                    <p className="text-gray-500 text-xs">{menuResponse.description}</p>
                                </article>
                                {(Number(menuResponse.discount) > 0) && <p className='text-red-500 line-through'>{getFullPrice(menuResponse.currency, Number(menuResponse.discount), Number(menuResponse.price))}</p>}
                                <p style={{ color: store?.color }}>{getCurrencySign(menuResponse.currency)}{Number(menuResponse.price)}</p>
                            </div>
                            <div className='pt-2 flex flex-col items-center justify-center'>
                                <div className='flex items-center justify-center gap-1'>
                                    <img src={store ? store.logo : "https://placehold.co/600x400"}
                                        onError={(e) => { e.currentTarget.src = "https://placehold.co/600x400" }}
                                        alt="store"
                                        className="w-6 h-6 rounded-full object-cover" />
                                    <p className="text-xs text-gray-500">{store?.name}</p>
                                </div>
                                <div className="flex justify-center items-center px-4 py-2 gap-2">
                                    <FaFacebook className="text-blue-500 ml-2" />
                                    <FaTelegram className="text-blue-500" />
                                    <FaInstagram className="text-blue-500" />
                                    <p className="text-xs text-gray-500">Tel: {store?.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative mx-auto bg-gray-900 dark:bg-gray-700 rounded-b-xl rounded-t-sm h-[17px] max-w-[700px] md:h-[21px]">
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[56px] h-[5px] md:w-[96px] md:h-[8px] bg-gray-800"></div>
                </div>
            </div>
        </div>
    );
};

export default ViewPage;
