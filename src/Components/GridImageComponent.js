import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo } from 'react'
import { getImageUrl, splitArray } from '../utils/helperFunctions'
import { FlatList } from 'react-native'
import { height, moderateScale, width } from '../styles/responsiveSize'

const GridImageComponent = ({ data = [],onPress=()=>{}}) => {

    let customArray = splitArray(data, 3)
    const renderItem = ({ item, index }) => {
        return (
            <View style={{ width: width, height: height / 2.6, backgroundColor: 'white' ,alignItems:'center'}}>
                <TouchableOpacity style={{  width: width-25, height:item?.length > 1 ?"50%":'100%',borderRadius:moderateScale(4),overflow:'hidden'}} onPress={()=>onPress(item[0])}>
                    <Image source={{
                        uri: getImageUrl(
                            item[0]?.image?.image_fit,
                            item[0]?.image?.image_path,
                            '800/600')
                    }} 
                    style={{height:'100%',width:'100%',resizeMode:'cover'}}/>
                </TouchableOpacity>
                <View style={{ flexDirection: "row", height: "50%" ,width:width-25,marginTop:moderateScale(7),justifyContent:'space-between',borderRadius:moderateScale(4)}}>
                    <TouchableOpacity style={{ width: !item[2] ? width : '50%' }} onPress={()=>onPress(item[1])}>
                    <Image source={{
                        uri: getImageUrl(
                            item[1]?.image?.image_fit,
                            item[1]?.image?.image_path,
                            '800/600')
                    }} 
                    style={{height:'100%',width:'100%',borderRadius:moderateScale(4),resizeMode:'stretch'}}/>
                    </TouchableOpacity>
                    {!!item[2] && <TouchableOpacity style={{  width : '48%',borderRadius:moderateScale(4) }}  onPress={()=>onPress(item[2])}>
                    <Image source={{
                        uri: getImageUrl(
                            item[2]?.image?.image_fit,
                            item[2]?.image?.image_path,
                            '800/600')
                    }} 
                    style={{height:'100%',width:'100%',borderRadius:moderateScale(4),resizeMode:'stretch'}}/>
                    </TouchableOpacity>}

                </View>

            </View>
        )
    }
    return (
        <View style={{marginVertical:moderateScale(8)}}>
            <FlatList data={customArray}
                horizontal
                pagingEnabled
                contentContainerStyle={{}}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
}

export default memo(GridImageComponent)

const styles = StyleSheet.create({})