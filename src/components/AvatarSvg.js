import { useState, useEffect } from "react";
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useUserStore } from '../stores';
import { auth } from "../../firebaseConfig"
export default function AvatarSvg({ style }) {

  let avatar = useUserStore((store) => store.avatarsvg)
  console.log("---avatart---")

  try {
    avatar = JSON.parse(avatar)
  }
  catch(e) {
    alert(e)
    return null
  }

  if (style) {
    return (
        <>
          {avatar?.length > 0 && <SvgXml xml={avatar} style={style}/>}
        </>
    )
  }
  return (
    <View style={{flex: 1}}>
      {avatar?.length > 0 && <SvgXml xml={avatar}/>}
    </View>
  );
}
