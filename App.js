import React from 'react';
import './config/firebase';
import { StyleSheet, LogBox} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './navigation/TabNavigator';
import AuthStack from './navigation/AuthStack';
import { useAuthentication } from './utils/hooks/useAuthentication';
const Stack = createNativeStackNavigator();


LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

const App = () => {

  const { user } = useAuthentication();

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator> 
        {
          user? ( //change to true to render home screen (true = user is logged in, false = user is not logged in)
            <Stack.Group>
              <Stack.Screen name="Tab" component={TabNavigator} options={{ headerShown: false }} />
            </Stack.Group>
          ) : (
            <Stack.Group>
              <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} />
            </Stack.Group>
          )
        }
        </Stack.Navigator>
    </NavigationContainer>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
      fontSize: 30,
      fontWeight: 'bold',
      marginBottom: 15,
  },
  startButton: {
    backgroundColor: '#ffff00',
    borderRadius: 15,
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '6%',
    marginBottom: 25,
  },
});

export default App;