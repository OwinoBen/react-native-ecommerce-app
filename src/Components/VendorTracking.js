//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

// create a component
const VendorTracking = ({data, mapKey}) => {
  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFillObject}
      initialRegion={{
        latitude: Number(data.tasks[0]?.latitude),
        longitude: Number(data.tasks[0]?.longitude),
        latitudeDelta: 0.0222,
        longitudeDelta: 0.032,
      }}
      rotateEnabled={true}>
      <MapViewDirections
        origin={{
          latitude: Number(data.tasks[0]?.latitude),
          longitude: Number(data.tasks[0]?.longitude),
          latitudeDelta: 0.0222,
          longitudeDelta: 0.032,
        }}
        destination={{
          latitude: Number(data.tasks[1]?.latitude),
          longitude: Number(data.tasks[1]?.longitude),
          latitudeDelta: 0.0222,
          longitudeDelta: 0.032,
        }}
        apikey={mapKey}
        strokeWidth={3}
        strokeColor={themeColors.primary_color}
        optimizeWaypoints={true}
        onStart={(params) => {}}
        precision={'high'}
        timePrecision={'now'}
        mode={'DRIVING'}
        // maxZoomLevel={20}
        onReady={(result) => {
          // updateState({
          //   totalDistance: result.distance.toFixed(appData?.profile?.preferences?.digit_after_decimal),
          //   totalDuration: result.duration.toFixed(appData?.profile?.preferences?.digit_after_decimal),
          // });
          mapRef.current.fitToCoordinates(result.coordinates, {
            edgePadding: {
              right: width / 20,
              bottom: height / 20,
              left: width / 20,
              top: height / 20,
            },
          });
        }}
        onError={(errorMessage) => {
          //
        }}
      />
      <Marker
        coordinate={{
          latitude: Number(data.tasks[0]?.latitude),
          longitude: Number(data.tasks[0]?.longitude),
          latitudeDelta: 0.0222,
          longitudeDelta: 0.032,
        }}
        image={imagePath.icDestination}
      />
      <Marker
        ref={markerRef}
        coordinate={{
          latitude: Number(data?.agent_location?.lat),
          longitude: Number(data?.agent_location?.long),
          latitudeDelta: 0.0222,
          longitudeDelta: 0.032,
        }}
        flat>
        <Image
          source={imagePath.icScooter}
          style={{
            transform: [{rotate: `${state.headingAngle + 110}deg`}],
          }}
        />
      </Marker>
    </MapView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default React.memo(VendorTracking);
