import Toast from "react-native-toast-message";

const tmp = {paddingHorizontal: 15, backgroundColor: "red"}
const showToast = (type, text1, text2 = "", backColor) => {
  console.log(backColor)
  Toast.show({
    type: type,
    text1: text1,
    text2: text2,
    visibilityTime: 5000,
    autoHide: true,
    // style={{backgroundColor: "red"}}
    // style: { backgroundColor: backColor, borderLeftColor: 'green' }
    contentContainerStyle: {tmp}
  });
};

export default showToast;
