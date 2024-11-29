import { createAsyncThunk, createSlice, isRejectedWithValue } from '@reduxjs/toolkit'
import { callApiWithExceptionHandling } from '../utils/api/apiRequest';
import { ADMIN_API_BASE_URL, ADMIN_API_CATEGORY, TMP_STORE_DATA } from '../resources/newApiResource';
import {isEmpty} from 'lodash';
import { getStoreID, openPopup } from '../utils/common';
import { setErrorData } from './error';
import { EventRegister } from 'react-native-event-listeners';

export const setCategories = createAsyncThunk("categories/setCategories", async(data) =>{
    return data;
})
// 어드민 카테고리 받기
export const getAdminCategories = createAsyncThunk("categories/getAdminCategories", async(_,{dispatch,rejectWithValue}) =>{
    EventRegister.emit("showSpinner",{isSpinnerShow:true, msg:"데이터 요청중입니다. "})

    const {STORE_IDX} = await getStoreID();
    try {
        const data = await callApiWithExceptionHandling(`${ADMIN_API_BASE_URL}${ADMIN_API_CATEGORY}`,{"STORE_ID":`${STORE_IDX}`}, {});
        EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
        if(data?.goods_category == null) {
            //EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
            return rejectWithValue("DATA DOES NOT EXIST");
        }else {
            return data;
        }
    } catch (error) {
        // 예외 처리
        EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
        console.error(error.message);
        dispatch(setErrorData({errorCode:"XXXX",errorMsg:`어드민 카테고리 ${error.message}`})); 
        openPopup(dispatch,{innerView:"Error", isPopupVisible:true}); 
        //EventRegister.emit("showSpinner",{isSpinnerShow:false, msg:""})
        return rejectWithValue(error.message);
    }
})
// 메인 카테고리 선택
export const setSelectedMainCategory = createAsyncThunk("categories/setSelectedMainCategory", async(index,{getState,dispatc, rejectWithValue}) =>{
    if(isEmpty(index)) {
        return rejectWithValue()
    }else {
        return index;
    }
})
// 서브 카테고리
export const setSubCategories = createAsyncThunk("categories/setSubCategories", async(index,{getState,dispatc, rejectWithValue}) =>{
    const {selectedMainCategory, selectedSubCategory, allCategories} = getState().categories;
    const subCategoreis = allCategories.filter(item => item.cate_code1 == selectedMainCategory);
    if(subCategoreis.length>0) {
        const subLevel = subCategoreis[0]?.level2;
        var filteredSubLevel = [];
        if(subLevel?.length>0) {
            filteredSubLevel = subLevel.filter(el=>(el.is_use == "Y" && el.is_del=="N" ));
        }else {
            filteredSubLevel = subLevel;
        }
        return filteredSubLevel;
    }else {
        return[]
    }
})
export const setSelectedSubCategory = createAsyncThunk("categories/setSelectedSubCategory", async(index) =>{
    return index
})

/***** 이하 삭제 */

// Slice
export const cagegoriesSlice = createSlice({
    name: 'categories',
    initialState: {
        allCategories:[],
        categoryData:[],
        mainCategories:[],
        subCategories:[],
        selectedMainCategory:0,
        selectedSubCategory:0,
    },
    extraReducers:(builder)=>{
        // 카테고리 받아오기
        builder.addCase(getAdminCategories.fulfilled, (state, action)=>{
            const payload = action?.payload
            const result = payload?.result
            if(result == true) {
                const goodsCategory = payload?.goods_category;
                if(goodsCategory.length > 0) {
                    const categories = goodsCategory.filter(el=>(el.is_use=='Y' && el.is_del=='N' && el.is_view=='Y'  ));
                    state.allCategories =  categories;
                }
            }
        })
        builder.addCase(getAdminCategories.pending, (state, action)=>{

        })
        builder.addCase(getAdminCategories.rejected, (state, action)=>{

        })

        // 메인 카테고리 선택
        builder.addCase(setSelectedMainCategory.fulfilled,(state, action)=>{
            //state.subCategories = MENU_DATA.categories[action.payload].subCategories||[]
            if(!isEmpty(action.payload)){
                state.selectedMainCategory = action.payload;
                state.selectedSubCategory = "0000";
            }
        })
        builder.addCase(setSelectedMainCategory.pending,(state, action)=>{
        })
        builder.addCase(setSelectedMainCategory.rejected,(state, action)=>{
        })

        // 서브카테고리
        builder.addCase(setSubCategories.fulfilled,(state, action)=>{
            state.subCategories = action.payload;
        })
        builder.addCase(setSubCategories.rejected,(state, action)=>{
            
        })
        builder.addCase(setSubCategories.pending,(state, action)=>{
            
        })
        // set categories
        builder.addCase(setCategories.fulfilled,(state, action)=>{
            const payload = action.payload;
            const keys = Object.keys(payload)
            if(keys.length>0) {
                keys.map(el=>{
                    state[el] = action.payload[el];
                })
            }
        })
       
        // 서브 카테고리 선택
        builder.addCase(setSelectedSubCategory.fulfilled,(state, action)=>{
            state.selectedSubCategory = action.payload;
        })
    }
});

