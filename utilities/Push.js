import { Permissions, Notifications } from 'expo';
import apiActions from 'app/utilities/Actions';

const Push = {
  async registerForPushNotificationsAsync(){
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    console.log(finalStatus)

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    console.log(token)

    let data = { device: { push_token: token } }
    let res = await apiActions.request('devices/update', 'PATCH', data).catch(e => console.warn(e))
     // console.log(res)
  },
}

export default Push