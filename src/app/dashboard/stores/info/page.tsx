"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Phone, Mail, CreditCard, Store, Globe, MapPinIcon, ShoppingCart, SquareArrowOutUpRight } from "lucide-react";
import { IoLogoFacebook, IoLogoInstagram } from "react-icons/io";
import { FaTelegramPlane } from "react-icons/fa";
import { Language, OperatingHour, OrderOption, PaymentMethod } from "../../../../types/store-response";
import { useStoreResponse } from "@/hooks/use-store";
import { API_IMAGE_URL } from "@/constants/auth";
import { GOOGLE_MAPS_API_KEY } from "@/constants/api";
import { AdvancedMarker, APIProvider, ControlPosition, Map } from "@vis.gl/react-google-maps";
import { CustomZoomControl } from "@/components/map-control";
import { useState } from "react";
import NoStore from "@/components/no-store";

export default function StoreInfoPage() {
    const store = useStoreResponse((state) => state.store);
    const [zoom, setZoom] = useState(15);

    if (!store) {
        return (
            <NoStore />
        );
    }

    const {
        name,
        slug,
        description,
        logo,
        physicalAddress,
        virtualAddress,
        phone,
        email,
        website,
        facebook,
        instagram,
        telegram,
        color,
        lat,
        lng,
        storeInfoResponse
    } = store;
    const { operatingHours, orderOptions, paymentMethods, languages } = storeInfoResponse;

    const isValidLatLng = typeof lat === 'number' && typeof lng === 'number';

    const STORE_URL = process.env.NEXT_PUBLIC_UI_BASE_URL + "/s/" + slug;

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold">Store Information</h1>
            {STORE_URL && (
                <div className="flex items-center gap-2">
                    <SquareArrowOutUpRight className="w-4 h-4 dark:text-gray-300 text-gray-800" />
                    <a href={STORE_URL} target="_blank" className="text-blue-500">
                        {STORE_URL}
                    </a>
                </div>
            )}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold">{name}</CardTitle>
                            {description && <p className="dark:text-gray-300 text-gray-800 mt-2">{description}</p>}
                        </div>
                        {logo && (
                            <img
                                src={API_IMAGE_URL + logo}
                                alt="Store logo"
                                className="w-16 h-16 rounded-lg object-cover"
                                onError={(e) => e.currentTarget.src = 'https://placehold.co/400x400'}
                            />
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {physicalAddress && (
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4 dark:text-gray-300 text-gray-800" />
                            <span>{physicalAddress}</span>
                        </div>
                    )}
                    {virtualAddress && (
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 dark:text-gray-300 text-gray-800" />
                            <span>{virtualAddress}</span>
                        </div>
                    )}
                    {phone && (
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 dark:text-gray-300 text-gray-800" />
                            <span>{phone}</span>
                        </div>
                    )}
                    {email && (
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 dark:text-gray-300 text-gray-800" />
                            <span>{email}</span>
                        </div>
                    )}
                    {website && (
                        <a href={website} target="_blank" className="flex items-center gap-2">
                            <Globe className="w-4 h-4 dark:text-gray-300 text-gray-800" />
                            <span>{website}</span>
                        </a>
                    )}
                    {facebook && (
                        <a href={facebook} target="_blank" className="flex items-center gap-2">
                            <IoLogoFacebook />
                            <span>{facebook}</span>
                        </a>
                    )}
                    {instagram && (
                        <a href={instagram} target="_blank" className="flex items-center gap-2">
                            <IoLogoInstagram />
                            <span>{instagram}</span>
                        </a>
                    )}
                    {telegram && (
                        <a href={telegram} target="_blank" className="flex items-center gap-2">
                            <FaTelegramPlane />
                            <span>{telegram}</span>
                        </a>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold">Customization</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {color && (
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full" style={{ backgroundColor: color }}></div>
                            <span>{color}</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Operating Hours */}
            {operatingHours.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Clock className="w-5 h-5" />
                            Operating Hours
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                            {operatingHours.map((hours: OperatingHour) => (
                                <div key={hours.id || `hours-${hours.day}`} className="flex justify-between items-center">
                                    <span className="font-medium">{hours.day}</span>
                                    <span>{hours.openTime} - {hours.closeTime}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Order Options */}
            {orderOptions.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Store className="w-5 h-5" />
                            Order Options
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {orderOptions.map((option: OrderOption) => (
                                <div key={option.id || `option-${option.name}`} className="space-y-3">
                                    <h3 className="font-semibold text-lg">{option.name}</h3>
                                    {option.description && (
                                        <p className="text-gray-500">{option.description}</p>
                                    )}
                                    {option.feeRanges && option.feeRanges.length > 0 && (
                                        <div className="grid grid-cols-2 gap-2">
                                            {option.feeRanges.map((fee) => (
                                                <div key={fee.id || `fee-${fee.condition}`} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-black rounded">
                                                    <span>{fee.condition}</span>
                                                    <Badge className="text-sm" variant="secondary">
                                                        ${typeof fee.fee === 'number' ? fee.fee : '0.00'}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Payment Methods */}
            {paymentMethods.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <CreditCard className="w-5 h-5" />
                            Payment Methods
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {paymentMethods.map((payment: PaymentMethod) => (
                                <Badge className="text-md" key={payment.id || `payment-${payment.method}`}>
                                    {payment.method}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Languages */}
            {languages?.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <CreditCard className="w-5 h-5" />
                            Language
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {languages.map((language: Language) => (
                                <Badge className="text-md" key={language.id || `language-${language.id}`}>
                                    {language.language}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
            {isValidLatLng && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <MapPin className="w-5 h-5" />
                            Google Map
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['marker']}>
                            <Map
                                mapId="8688fdcc01587e0f"
                                style={{ width: '100%', height: '400px' }}
                                defaultCenter={{ lat, lng }}
                                gestureHandling={'greedy'}
                                disableDefaultUI={true}
                                zoom={zoom}
                                onZoomChanged={ev => setZoom(ev.detail.zoom)}
                            >
                                <AdvancedMarker
                                    title={'Store Location'}
                                    position={{ lat, lng }}
                                    draggable={false}
                                >
                                    <div className="custom-pin">
                                        <MapPinIcon className="w-10 h-10 text-red-500" />
                                    </div>
                                </AdvancedMarker>
                                <CustomZoomControl
                                    controlPosition={ControlPosition.RIGHT_BOTTOM}
                                    zoom={zoom}
                                    onZoomChange={zoom => setZoom(zoom)}
                                />
                            </Map>
                        </APIProvider>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}