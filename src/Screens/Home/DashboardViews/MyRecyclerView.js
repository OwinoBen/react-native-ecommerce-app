import React, {
    memo,
    useMemo,
    useRef,
    useState
  } from 'react';
  import {
    Dimensions,
    Text,
    View
  } from 'react-native';
  import {
    DataProvider,
    LayoutProvider,
    RecyclerListView
  } from 'recyclerlistview'; // Version can be specified in package.json
  
  const ViewTypes = {
    FULL: 0,
    HALF_LEFT: 1,
    HALF_RIGHT: 2,
  };
  
  
  let { width } = Dimensions.get('window');
  
  const DashBoardFiveV2Api = memo(() => {
    const [data, setData] = useState([{name: 'gulsher'}]);
  
    const _layoutProvider = useRef(layoutMaker()).current;
  
    const listView = useRef();
  
    const dataProvider = useMemo(() => dataProviderMaker(data), [data]);
  
    console.log("dataProviderdataProvider",dataProvider)
  
  
    return (
      <View style={{ flex: 1 }}>
        <RecyclerListView
          ref={listView}
          onEndReachedThreshold={1}
          layoutProvider={_layoutProvider}
          dataProvider={dataProvider}
          rowRenderer={rowRenderer}
        />
  
      </View>
    );
  });
  
  const layoutMaker = () =>
    new LayoutProvider(
      (index) => {
        if (index % 3 === 0) {
          return ViewTypes.FULL;
        } else if (index % 3 === 1) {
          return ViewTypes.HALF_LEFT;
        } else {
          return ViewTypes.HALF_RIGHT;
        }
      },
      (type, dim) => {
        switch (type) {
          case ViewTypes.HALF_LEFT:
            dim.width = width / 2;
            dim.height = 160;
            break;
          case ViewTypes.HALF_RIGHT:
            dim.width = width / 2 - 0.001;
            dim.height = 160;
            break;
          case ViewTypes.FULL:
            dim.width = width;
            dim.height = 160;
            break;
          default:
            dim.width = 0;
            dim.height = 0;
        }
      }
    );
  
  const rowRenderer = (type, data) => {
    console.log(type,"typetype",data)
    switch (type) {
      case ViewTypes.HALF_LEFT:
        return (
          <View style={{flex:1}}>
              <Text>Im Half left</Text>
          </View>
        );
      case ViewTypes.HALF_RIGHT:
        return (
          <View style={{flex:1}}>
          <Text>Im Half right</Text>
      </View>
        );
      case ViewTypes.FULL:
        return (
          <View style={{flex:1}}>
          <Text>Im Full</Text>
      </View>
        );
      default:
        return null;
    }
  };
  
  
  const dataProviderMaker = (data) => new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(data);
  
  
  
  export default DashBoardFiveV2Api;
  
  const styles = {
    container: {
      justifyContent: 'space-around',
      alignItems: 'center',
      flex: 1,
      backgroundColor: 'orange',
    },
    containerGridLeft: {
      justifyContent: 'space-around',
      alignItems: 'center',
      flex: 1,
      backgroundColor: 'yellow',
    },
    containerGridRight: {
      justifyContent: 'space-around',
      alignItems: 'center',
      flex: 1,
      backgroundColor: 'blue',
    },
  };
  