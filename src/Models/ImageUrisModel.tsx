class ImageUrisModel{
    small: string = "";
    normal: string = "";
    large: string = "";
    png: string = "";
    art_crop: string = "";
    border_crop: string = "";

    constructor(imageUrisModel?: ImageUrisModel) {
        Object.assign(this, imageUrisModel);
    }

    static fromJSON(json: ImageUrisJSON): ImageUrisModel{
        let uris = Object.create(ImageUrisModel.prototype);
        return Object.assign(uris, json);
    }
}

export default ImageUrisModel;


interface  ImageUrisJSON{
    small: string,
    normal: string,
    large: string,
    png: string,
    art_crop: string,
    border_crop: string,
}