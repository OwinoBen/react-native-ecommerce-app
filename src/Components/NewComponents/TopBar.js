import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import DropDownPicker from "react-native-dropdown-picker";
import imagePath from "../../constants/imagePath";
import colors from "../../styles/colors";
import fontFamily from "../../styles/fontFamily";
import { moderateScale } from "../../styles/responsiveSize";
import { useNavigation } from "@react-navigation/native";

const TopBar = ({
  open,
  value,
  items,
  setOpen,
  setValue,
  setItems,
  themeColor,
  showBack = false,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {!!showBack && (
          <TouchableOpacity
            style={{ marginRight: moderateScale(12) }}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={imagePath.back1}
              style={{ borderRadius: 10, width: 42 }}
            />
          </TouchableOpacity>
        )}

        <Image source={imagePath.location2} />
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          labelStyle={{
            fontFamily: fontFamily.futura,
            color: themeColor ? colors.white : colors.black,
            fontSize: 18,
          }}
          arrowColor={themeColor ? colors.white : colors.black}
          arrowStyle={styles.arrowStyle}
          style={styles.picker}
        />
      </View>
      <TouchableOpacity activeOpacity={0.7}>
        <Image source={imagePath.notifcation} />
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(TopBar);

const styles = StyleSheet.create({
  arrowStyle: {
    width: 20,
    height: 20,
    marginTop: 5,
  },
  picker: {
    backgroundColor: colors.whiteOpacity15,
    borderWidth: 0,
    height: 30,
    width: 150,
    marginLeft: moderateScale(12),
  },

  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: moderateScale(18),
    zIndex: 1,
    flex: 1,
  },
});
