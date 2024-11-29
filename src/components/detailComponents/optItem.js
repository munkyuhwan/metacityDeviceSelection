import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { OptItemDim, OptItemFastImage, OptItemImage, OptItemInfoChecked, OptItemInfoPrice, OptItemInfoTitle, OptItemInfoWrapper, OptItemWrapper } from '../../styles/main/detailStyle';
import {  setMenuOptionSelected } from '../../store/menuDetail';
import FastImage from 'react-native-fast-image';
import { DetailItemAmtController, DetailItemAmtText,DetailItemAmtWrapper, DetailOperandorText, OperandorText } from '../../styles/main/cartStyle';
import { posErrorHandler } from '../../utils/errorHandler/ErrorHandler';
import { max } from 'moment';
import { RADIUS_SMALL_DOUBLE } from '../../styles/values';
import { SoldOutDimLayer, SoldOutLayer, SoldOutText } from '../../styles/main/menuListStyle';
import { isAvailable } from '../../utils/common';

const height = Dimensions.get('window').height;

const OptItem = (props)=>{
    const {language} = useSelector(state=>state.languages);
    const dispatch = useDispatch();
    const menuDetail = props?.menuData;
    const optionProdCD = props.optionProdCD;
    //console.log("optionData: ",optionProdCD);
    const maxQty = props.maxQty;
    const selectedCnt = props.selectedCnt;
    
    const {allItems} = useSelector((state)=>state.menu);
    const {menuDetailID,  menuOptionGroupCode, menuOptionSelected, setGroupItem} = useSelector((state)=>state.menuDetail);
    const [isSelected, setSelected] = useState(false);
    const [addtivePrice, setAdditivePrice] = useState();
    const [qty,setQty] = useState(1);
    const {images} = useSelector(state=>state.imageStorage);

    // 메뉴 옵션 추가 정보
    const {optionCategoryExtra,menuExtra} = useSelector(state=>state.menuExtra);
    const itemDetail = allItems.filter(el=>el.prod_cd==optionProdCD);
    //console.log("option item detail:",itemDetail[0])
    const itemMenuExtra = menuExtra.filter(el=>el.pos_code==optionProdCD);
    const ItemTitle = () =>{
        let selTitleLanguage = ""; 
        //const selExtra = itemMenuExtra.filter(el=>el.pos_code==optionProdCD);
        if(language=="korean") {
            selTitleLanguage = itemDetail[0]?.gname_kr;
        }
        else if(language=="japanese") {
            selTitleLanguage = itemDetail[0]?.gname_jp||itemDetail[0]?.gname_kr;
        }
        else if(language=="chinese") {
            selTitleLanguage = itemDetail[0]?.gname_cn||itemDetail[0]?.gname_kr;
        }
        else if(language=="english") {
            selTitleLanguage = itemDetail[0]?.gname_en||itemDetail[0]?.gname_kr;
        }
        return selTitleLanguage;
    }
    function isOptionAdd() {
        if(maxQty == 0) {
            return true;
        }else {
            let booleanArr = true;
            const menuOptionList = menuDetail?.option;
            for(var i=0;i<menuOptionList.length;i++) {
                let optItems = menuOptionList[i].prod_i_cd;
                const limitCount = Number(menuOptionList[i].limit_count);
                if(limitCount == 0) {
                    booleanArr = booleanArr && true;
                }else {
                    let cnt = 0;
                    for(var j=0;j<menuOptionSelected.length;j++) {
                        // 해당 중분류의 아이템이 몇개가 선택 되었는지 체크;
                        
                        let filter = optItems.filter(el=>el == menuOptionSelected[j].PROD_I_CD);
                        if(filter.length > 0) {
                            cnt = cnt+menuOptionSelected[j]?.QTY;
                        }

                    }
                    booleanArr = booleanArr && menuOptionList[i]?.limit_count<=cnt;
                }
            }
            return booleanArr;
        }
    }

    const plusCnt = () =>{
        if(maxQty == 0) {
            let tmpOptions = Object.assign([],menuOptionSelected);
            let filteredTmpOptions = tmpOptions.filter(el=>el.prod_i_cd ==optionProdCD )
            let tmpOptionPut = filteredTmpOptions[0];
            let qty = 1;
            if(filteredTmpOptions.length > 0) {
                qty = filteredTmpOptions[0].QTY+1
            }
            //const maxQty = filteredTmpOptions[0]?.QTY;
            tmpOptionPut = {...tmpOptionPut,...{QTY:qty}}
            dispatch(setMenuOptionSelected({data:tmpOptionPut,isAdd:true, isAmt:true}));
        }else {
            
            if(!isOptionAdd()){
                let tmpOptions = Object.assign([],menuOptionSelected);
                let filteredTmpOptions = tmpOptions.filter(el=>el.PROD_I_CD ==optionProdCD )
                
                var tmpOptionPut = filteredTmpOptions[0];
                let qty = 1;
                if(filteredTmpOptions.length > 0) {
                    qty = filteredTmpOptions[0].QTY+1
                }
                //const maxQty = filteredTmpOptions[0]?.QTY;
                tmpOptionPut = {...tmpOptionPut,...{QTY:qty}}
                dispatch(setMenuOptionSelected({data:tmpOptionPut,isAdd:true, isAmt:true}));
            }

        }

    }
    const minusCnt = () => {
        let tmpOptions = Object.assign([],menuOptionSelected);
        let filteredTmpOptions = tmpOptions.filter(el=>el.PROD_I_CD ==optionProdCD )
        let tmpOptionPut = filteredTmpOptions[0];
        let qty = 1;
        if(filteredTmpOptions.length > 0) {
            qty = filteredTmpOptions[0].QTY-1
        }
        tmpOptionPut = {...tmpOptionPut,...{QTY:qty}}
        dispatch(setMenuOptionSelected({data:tmpOptionPut,isAdd:true, isAmt:true}));
    }

    
    useEffect(()=>{
        let filteredTmpOptions = menuOptionSelected.filter(el=>el.PROD_I_CD ==optionProdCD )
        if(filteredTmpOptions.length > 0) {
            setQty(filteredTmpOptions[0].QTY);
        }
    },[menuOptionSelected])
// <OptItemFastImage  source={{uri:`https:${itemMenuExtra[0]?.gimg_chg}`,headers: { Authorization: 'AuthToken' },priority: FastImage.priority.normal}}/>

    return(
        <>
            { 
            <TouchableWithoutFeedback onPress={()=>{
                if(itemDetail[0]?.sale_status!='3') {
                    if(isAvailable(itemDetail[0])) {
                        props.onPress(true, itemDetail[0]); 
                    }
                }
                }} >
                <View>
                            {/* <OptItemFastImage  source={{uri:(`${images.filter(el=>el.name==optionProdCD)[0]?.imgData}`),priority: FastImage.priority.high }}/>} */}

                    <OptItemWrapper>
                        {itemDetail[0]?.gimg_chg &&
                            <OptItemFastImage  source={{uri:itemDetail[0]?.gimg_chg,priority: FastImage.priority.high }}/>}
                        {!itemDetail[0]?.gimg_chg &&
                            <OptItemFastImage resizeMode='contain'  source={require('../../assets/icons/logo.png')}/>
                        }
                        <OptItemDim isSelected={props.isSelected}/>
                        <OptItemInfoWrapper>
                            <OptItemInfoTitle>{ItemTitle()||itemDetail[0]?.gname_kr }</OptItemInfoTitle>
                            <OptItemInfoPrice>{(itemDetail[0]?.sal_amt)?"+"+(Number(itemDetail[0]?.sal_amt)+Number(itemDetail[0]?.sal_vat))*Number(qty).toLocaleString(undefined,{maximumFractionDigits:0})+"원":""}</OptItemInfoPrice>
                            {/* <OptItemInfoChecked isSelected={props.isSelected} source={require("../../assets/icons/check_red.png")}/> */}
                        </OptItemInfoWrapper>
                    </OptItemWrapper>
                    {/* 옵션 수량 조절 */}
                    {props.isSelected &&
                        <DetailItemAmtWrapper>
                            <TouchableWithoutFeedback  onPress={()=>{ props.onPress(false, itemDetail[0]); }} >
                                <DetailItemAmtController>
                                <DetailOperandorText>-</DetailOperandorText>
                                </DetailItemAmtController>
                            </TouchableWithoutFeedback>
                            <DetailItemAmtText>{selectedCnt}</DetailItemAmtText>
                            <TouchableWithoutFeedback  onPress={()=>{ props.onPress(true, itemDetail[0]); }} >
                                <DetailItemAmtController>
                                    <DetailOperandorText>+</DetailOperandorText>
                                </DetailItemAmtController>
                            </TouchableWithoutFeedback>
                        </DetailItemAmtWrapper>
                    }
                    {itemDetail[0]?.sale_status=='3'&&// 1:대기, 2: 판매, 3: 매진
                        <SoldOutLayer style={{ width:'97%',height:height*0.150, borderRadius:RADIUS_SMALL_DOUBLE}}>
                            <SoldOutText>SOLD OUT</SoldOutText>    
                            <SoldOutDimLayer style={{ width:'97%',height:height*0.150, borderRadius:RADIUS_SMALL_DOUBLE}}/>
                        </SoldOutLayer>
                    }
                    {(itemDetail[0]?.sale_status!='3'&&!isAvailable(itemDetail[0])) &&
                        <SoldOutLayer style={{ width:'97%',height:height*0.150, borderRadius:RADIUS_SMALL_DOUBLE}}>
                            <SoldOutText>준비중</SoldOutText>    
                            <SoldOutDimLayer style={{ width:'97%',height:height*0.150, borderRadius:RADIUS_SMALL_DOUBLE}}/>
                        </SoldOutLayer>
                    }
                </View>
            </TouchableWithoutFeedback>
            }
        </>
    )
}
export default OptItem