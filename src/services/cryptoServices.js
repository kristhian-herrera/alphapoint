import axios from "axios";

import { 
    EP_GET_CRYPTO_LIST,
    EP_GET_CRYPTO_DETAIL
} from "../resources/constants";

import helpers from "../resources/helpers";

const getCryptoList = async (global) => {
    try {
        //Axios call
        const response = await axios.get(EP_GET_CRYPTO_LIST);

        if (helpers.validateStatus200(response)) {
            //Return data
            return response.data.data;
        } else {
            //Throw error
            throw new Error(String(response) + '||CS-CLO02');
        }
    } catch(error) {
        //Reset session variables
        global.setUser(null);
        global.setIsLoggedIn(false);

        //Throw error
        throw new Error(helpers.errorMessage(error) + '||CS-CLO01');
    }
}

const getCryptoDetail = async (global, id) => {
    try {
        //Axios call
        const response = await axios.get(EP_GET_CRYPTO_DETAIL + '?id=' + id);

        if (helpers.validateStatus200(response)) {
            //Return data
            return response.data;
        } else {
            //Throw error
            throw new Error(String(response) + '||CS-CDO02');
        }
    } catch(error) {
        //Reset session variables
        global.setUser(null);
        global.setIsLoggedIn(false);

        //Throw error
        throw new Error(helpers.errorMessage(error) + '||CS-CDO01');
    }
}

const CryptoServices = {
    getCryptoList: async function (global) {
        return await getCryptoList(global);
    },
    getCryptoDetail: async function (global, id) {
        return await getCryptoDetail(global, id);
    }
};

export default CryptoServices;