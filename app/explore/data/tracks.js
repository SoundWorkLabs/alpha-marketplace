import axios from "axios";

// const audioUrl = "https://uc9fa80d10d17336f1f556f891c0.dl.dropboxusercontent.com/cd/0/get/CFICUnqJaUa_tSz9HFk8ySjIFa5aegiQhkbnU-VTeDXEktw3wXNGEb0MswhqAW8Nm5z-zSGJLcGKlJVlRNgQfFSXbgtsPm5vOJPpRZg8LR6ofVYtN0pp5UPEsxxf3J-94ZYy-Be3MmfWPa3Q99eqlFhyxPWBd68Cx4POX23Ji15cCQ/file?_download_id=02870604041999192803582490117973319203400415350388580192510161095&_notify_domain=www.dropbox.com&dl=1";

// this should be in the netlify function when backend data is provided

const audioUrl = "./sunella.mp3";
const coverArtUrl = "https://i.imgur.com/5fPwIQr.jpeg";

// TODO use interface
export const tracks = [
    {
        // should later change this to get from backend
        title: "sunella",
        src: audioUrl,
        author: "ktwofresh97",
        thumbnail: coverArtUrl,
        collection: ""
    }
];

// // to align data from db
// export const collection = {
//     collection_address: "",
//     title: "",
//     metadata_uri: "",
//     seller_fee_basis_points: "",
//     image_uri: "",
//     available_for_lease: "",
//     description: "",
//     creator: "",
//     items_in_collection: ""
// };

// export const nft = {
//     nft_address: "",
//     collection_address: "",
//     title: "",
//     token_standard: "",
//     current_owner: "",
//     description: "",
//     seller_fee_basis_points: "",
//     image_url: "",
//     metadata_uri: "",
//     type: "",
//     available_for_lease: ""
// };

// const db = "https://ageless-period-400708.uc.r.appspot.com/";
// const getData = async () => {
//     const res = await axios.get(db);
//     console.log(res);
// };

// getData();
