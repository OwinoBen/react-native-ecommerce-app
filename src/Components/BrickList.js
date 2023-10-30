import React from 'react';
import {Dimensions, ScrollView, StyleSheet, View, FlatList} from 'react-native';
var {width} = Dimensions.get('window');

export default (props) => {
  return (
    <ScrollView>
      <View style={styles.container}>
        {props.data.map((prop) => {
          return (
            <View
              key={prop.id}
              style={{
                width: (100 / props.columns) * prop.span + '%',
                height:
                  prop.rowHeight === undefined
                    ? width / props.columns
                    : prop.rowHeight,
              }}
              >
              {props.renderItem(prop)}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
