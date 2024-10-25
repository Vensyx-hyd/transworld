import APIConfig from './constants';
import { loadUserState, clearUserState } from "../Pages/Auth/+state/loadUserState";

const privateEndPoints = APIConfig.privateEndPoints;
const publicEndPoints = APIConfig.publicEndPoints;
const HOSTNAME = APIConfig.hostname;

const AppAPI = {
};

publicEndPoints.forEach((element, key) => {
    AppAPI[key] = {};
    element.methods.forEach((method) => {
        AppAPI[key][method] = (params, payload) => fetcher(method, key, element.path, params, payload)
    })
});

privateEndPoints.forEach((element, key) => {
    AppAPI[key] = {};
    element.methods.forEach((method) => {
        AppAPI[key][method] = (params, payload) => fetcher(method, key, element.path, params, payload)
    })
});

function fetcher(method, key, inputEndpoint, inputParams, body) {
    let endpoint = inputEndpoint;
    const params = inputParams;

    return new Promise(async (resolve, reject) => {
        // Build request
        const req = {
            method: method.toUpperCase(),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
        };

        if (privateEndPoints.get(key)) {
            let accessToken = loadUserState().token;
            console.log(accessToken, "TOKEN");
            if (accessToken) {
                req.headers.Authorization = `${accessToken}`;
            }
            else if (accessToken === "" || null) {
                clearUserState()
                window.location.pathname = '/login'
            }
        }

        if (body) {
            req.body = JSON.stringify(body);
        }

        let thisUrl = HOSTNAME + endpoint;

        if (params) {
            thisUrl = thisUrl + params;
        }
        // Make the request
        return fetch(thisUrl, req)
            .then(async (response) => {
                console.log(response, "Response1");
                let responseJson = {};
                try {
                    responseJson = await response.json();
                } catch (e) {
                    throw response;
                }

                if (response && (response.status === 200 || response.status === 201 || response.status === 400)) {
                    responseJson.status = response.status;
                    return responseJson
                }                
                throw responseJson;
            })
            .then((res) => {
                console.log(res, "Response2");
                if (res.error === "User session is inactive") {
                    clearUserState()                
                    window.location.pathname = '/login'
                }
                resolve(res)
            })
            .catch((err) => {
                console.log(err, "FIND ERROR");
                reject({
                    code: err.status,
                    serverMessage: err.statusText
                })
                // Testing Session Time out
                if (err.status === 401 || err.status === undefined) {
                    clearUserState()
                    window.location.pathname = '/login'
                }                
            });
    });
}

export default AppAPI;