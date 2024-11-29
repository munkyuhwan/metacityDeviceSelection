import { ActivityIndicator, Text, TouchableWithoutFeedback, View } from "react-native";
import { smartroCancelService } from "../../utils/payment/smartroPay";

const { PopupIndicatorWrapper, PopupIndicatorText, IndicatorWrapper, PopupSpinner, PopupIndicatorTransparentWrapper } = require("../../styles/common/popupIndicatorStyle")
const { default: WaitIndicator } = require("./waitIndicator")


const PopupPayIndicator = (props) => {
    return (
            <PopupIndicatorTransparentWrapper>
                <IndicatorWrapper>
                    <PopupSpinner size={'large'}/>
                    <PopupIndicatorText>{props?.text}</PopupIndicatorText>
                </IndicatorWrapper>
                <TouchableWithoutFeedback onPress={()=>{smartroCancelService()}}>
                    <View>
                        <Text>취소</Text>
                    </View>
                </TouchableWithoutFeedback>
            </PopupIndicatorTransparentWrapper>
    )
}
export default PopupPayIndicator;