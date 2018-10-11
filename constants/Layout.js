import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  largePadding: 30,
  basePadding: 15,
  medPadding: 8,
  smallPadding: 4,
  tinyPadding: 2,
};
