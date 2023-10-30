import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export const resetStackAndNavigate = (navigation_, screen) => {
  navigation_.reset({
    index: 0,
    routes: [{name: screen}],
  });
};
