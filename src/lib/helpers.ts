import imageCompression from "browser-image-compression";

const defaultOptions = {
    maxSizeMB: 1,
    useWebWorker: true,
    alwaysKeepResolution: true,
};

export function compressFile(imageFile: File, options = defaultOptions) {
    return imageCompression(imageFile, options);
}

export const getCurrencySign = (currency: string | undefined) => {
    switch (currency) {
        case 'dollar':
            return '$';
        case 'riel':
            return '៛';
        default:
            return '$';
    }
}

export const getFullPrice = (currency: string | undefined, discount: number | undefined, price: number | undefined) => {
    if (price === undefined) {
        throw new Error("Price is undefined");
    }
    const fullPrice = discount ? price + discount : price;
    return `${getCurrencySign(currency)}${fullPrice}`;
}