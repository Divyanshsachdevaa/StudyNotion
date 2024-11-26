import React from 'react';
import {toast} from "react-hot-toast";

export const getCatalogPageData = async (categoryId) => {
    const toastId = toast.loading("Loading...");

    let result = [];
    try{
        const response = await apiConnector("POST", catalogData.CATEGORYPAGEDETAILS_API)
    } catch(err){
        
    }
}