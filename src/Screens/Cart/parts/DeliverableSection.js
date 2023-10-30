import React from 'react';
import {
    Text,
    View,
} from 'react-native';

import {
    moderateScale,
} from '../../../styles/responsiveSize';
import colors from '../../../styles/colors';
import strings from '../../../constants/lang';

/**
 * DeliverableSection Part
 * @param {item ,fontFamily} props 
 * @returns 
 */

function DeliverableSection(props) {

    const { item, fontFamily } = props;
    return (
        <>
            {
                !!item?.isDeliverable ? null : (
                    <View style={{ marginHorizontal: moderateScale(10) }}>
                        <Text
                            style={{
                                fontSize: moderateScale(12),
                                fontFamily: fontFamily?.medium,
                                color: colors.redFireBrick,
                            }}>
                            {/* {'not Deliverable'} */}
                            {strings.ITEM_NOT_DELIVERABLE}
                        </Text>
                    </View>
                )
            }
        </>

    )

}
export default React.memo(DeliverableSection);