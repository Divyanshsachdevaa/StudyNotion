import React from 'react';
import {toast} from "react-hot-toast";
import {apiConnector} from '../apiConnector';
import {catalogData} from '../apis'

export const getCatalogPageData = async (categoryId, token) => {
    const toastId = toast.loading("Loading...");

    let result = [];
    try{
        const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API, {categoryId: categoryId}, { Authorization: `Bearer ${token}`})

        if(!response?.data?.success){
            throw new Error("Could Not Fetch Category page Data");
        }
        result = response?.data;

    } catch(error){
        console.log("CATALOG PAGE DATA API ERROR");
        toast.error(error.message);
        result = error.response?.data;
    }
    toast.dismiss(toastId);
    return result;
}