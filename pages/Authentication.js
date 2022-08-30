import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Button } from 'react-native';
import { Header } from '../navigation/Header';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const Authentication = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
        <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
      </Stack.Navigator>
  )
}

const Login = ({navigation}) => {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text style={styles.signintitle}>fixfit</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
        >
        </TextInput>
        <TextInput
          style={styles.input}
          placeholder="Password"
        >
        </TextInput>
        <TouchableOpacity
          style={styles.buttonfilled}
        >
          <Text> Login </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
        >
          <Text style={{color: '#808080'}}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
        >
          <Text 
            onPress={() => navigation.navigate('Signup')}
            style={{color: '#808080'}}
          >Sign Up for fixfit</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const Signup = ({navigation}) => {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text style={styles.signuptitle}>Create your account</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
        >
        </TextInput>
        <TextInput
          style={styles.input}
          placeholder="Username"
        >
        </TextInput>
        <TextInput
          style={styles.input}
          placeholder="Password"
        >
        </TextInput>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
        >
        </TextInput>
        <TouchableOpacity
          style={styles.buttonfilled}
          onPress={() => navigation.navigate('Login')}
        >
          <Text 
          >Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
        >
          <Text 
            onPress={() => navigation.navigate('Login')}
            style={{color: '#808080'}}
          >Already have an account?</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  signintitle: {
    fontSize: 70,
    fontWeight: '300',
    marginBottom: '10%',
    marginTop: '50%'
  }, 
  signuptitle: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: '10%',
    marginTop: '30%'
  }, 
  input: {
    width: '80%',
    height: 40,
    margin: 12,
    borderBottomWidth: 1,
    borderRadius: 5,
    borderColor: '#BEBEBE',
    padding: 10,
  },
  buttonfilled: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: 40,
    borderRadius: 5,
    backgroundColor:'#54BAB9',
    marginTop: 10,
    marginBottom: 20,
    boxShadow: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    borderRadius: 5,
    marginTop: 10,
  }
});

export default Authentication;