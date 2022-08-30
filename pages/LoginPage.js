import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Input, TextInput, TouchableOpacity, Button, Alert, ScrollView } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();

const Login = ({navigation}) => {

    const [value, setValue] = React.useState({
        email: '',
        password: '',
        error: ''
    })

    async function login() {
        try {
            await signInWithEmailAndPassword(auth, value.email, value.password);
        } catch (error) {
            Alert.alert(
              "Invalid email or password",
              "Please try again.",
              [
                { text: "OK", onPress: () => console.log("OK Pressed") }
              ]
            );
        }
    }

    return (
      <>
      <ScrollView contentContainerStyle={{flex: 1}}>
        <SafeAreaView style={styles.container}>
          <Text style={styles.signintitle}>fixfit</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={value.email}
            onChangeText={(text) => setValue({ ...value, email: text })}
          >
          </TextInput>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={value.password}
            onChangeText={(text) => setValue({ ...value, password: text })}
            secureTextEntry={true}
          >
          </TextInput>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '80%',
              height: 40,
              borderRadius: 5,
              backgroundColor:'#54BAB9',
              marginTop: 10,
              marginBottom: 20,
              boxShadow: 10,
              opacity: value.username === '' || value.password === '' ? 0.3 : 1
            }}
            disabled={value.username === '' || value.password === ''}
            onPress={login}
          >
            <Text 
              style={{ fontSize: 16 }}
            >Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
          >
            <Text style={{fontSize: 16, color: '#808080'}}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
          >
            <Text 
              onPress={() => navigation.navigate('Signup')}
              style={{fontSize: 16, color: '#808080'}}
            >Sign Up for fixfit</Text>
          </TouchableOpacity>
        </SafeAreaView>
        </ScrollView>
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
      fontWeight: '800',
      marginBottom: '10%',
      marginTop: '50%'
    }, 
    input: {
      width: '80%',
      height: 40,
      margin: 12,
      fontSize: 16,
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

export default Login;