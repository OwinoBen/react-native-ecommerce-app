
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import { google_map_key } from '../constants/constants';

export const googlePlacesApi = async (data, key, latLng, region) => {
    try {
        let res = await fetch(
            `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${data}&location=${latLng}&key=${key}`,
            {
                method: "GET",
            }
        );


        let response = await res.json();
        console.log("ressss", response)
        return response
    } catch (e) {
        console.log("erorr in goole place", e)
    }
}

export const getPlaceDetails = async (id, key) => {
    try {
        let res = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&key=${key}`, {
            method: 'GET',
        });
        let response = await res.json();
        return response
    } catch (e) {
        console.log("erorr in goole place", e)
    }
}

export const placesGeoCoding = async (lat, long, key) => {
    try {
        let res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${key}`, {
            method: 'GET',
        });
        let response = await res.json();
        return response
    } catch (e) {
        console.log("erorr in goole place", e)
    }
}

export const nearbySearch = async (latlng, key = google_map_key, type = "city", radius = 5000) => {
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latlng}&type=${type}&radius=${radius}&key=${key}`
    try {
        let res = await fetch(url, {
            method: 'GET',
        });
        let response = await res.json();
        return response
    } catch (e) {
        console.log("erorr in goole place", e)
    }
}
// https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670,151.1957&radius=5000&types=street&key=API_KEY

export const getCurrentLocationFromApi = () =>
    new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            position => {
                console.log("posisition", position)
                const cords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                resolve(cords);
            },
            error => {
                reject(error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        )
    })


export const getAddressFromLatLong = (latlng, mapKey) =>
    axios({
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        params: {
            latlng,
            key: mapKey,
            language: 'en',
        },
    })
        .then(response => {
            // console.log("success resp==>>", response)
            if (response.data.results && response.data.results.length > 0) {

                const dataToSend = {
                    address: response.data.results[0].formatted_address,
                };

                return dataToSend;
            }
            return '';
        })
        .catch(error => {
            error;
            console.log("error==>>>", error)
        });

export const getNearByPlacesMarker = async (lat, long, radius, places, key = 'AIzaSyDHPQM4OBs2I7ngqFOWk0Wk9Ke4AA034VI') => {

    try {
        let res = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=${radius}&type=${places}&keyword=cruise&key=${key}`, {
            method: 'GET',
        });
        let response = await res.json();
        console.log(response, "response")
        return response
    } catch (e) {
        console.log("erorr in goole place", e)
    }
    // axios({
    //     url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=${radius}&type=restaurant&keyword=cruise&key=${key}`,
    // })
    // .then(response => {
    //     console.log("success resp==>>", response)
    //     if (response.data.results && response.data.results.length > 0) {

    //         const dataToSend = {
    //             address: response.data.results[0].formatted_address,
    //         };

    //         return dataToSend;
    //     }
    //     return '';
    // })
    // .catch(error => {
    //     error;
    //     console.log("error==>>>", error)
    // });
}
