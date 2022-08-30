import React from 'react'
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Button, Alert, ScrollView } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { collection, setDoc, doc } from 'firebase/firestore'
import { db } from '../config/firebase'

const auth = getAuth();

const SignupPage = ({navigation}) => {

    const [value, setValue] = React.useState({
        email: '',
        password: '',
        name: '',
        username: '',
        confirmedPassword: '',
    })

    const [disabled, setDisabled] = React.useState(true);

    async function signup() {
      if (value.password !== value.confirmedPassword) {
        Alert.alert(
          "Passwords do not match",
          "Please try again.",
          [
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ]
        );
      } else {
        try {
          await createUserWithEmailAndPassword(auth, value.email, value.password);
          const dateTime = Date.now() + '';
          try {
            await setDoc(doc(db, "users", value.email), {
              name: value.name,
              username: value.username,
              bio: '',
              profilePicture: 'https://www.publicdomainpictures.net/pictures/200000/nahled/plain-gray-background.jpg',
              profilePicName: dateTime
            })
          }
          catch(error) {
            Alert.alert(
              "Error creating a new account",
              "Please try again.",
              [
                { text: "OK", onPress: () => console.log("OK Pressed") }
              ]
            );
          }
        }
        catch(error) {
          Alert.alert(
            "Sign up unsuccessful",
            "Please sign up again",
            [
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
          );
        }
      }
    }
    
    return (
      <>
      <ScrollView contentContainerStyle={{flex: 1}}>
        <SafeAreaView style={styles.container}>
          <Text style={styles.signuptitle}>Create your account</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={value.name}
              onChangeText={(text) => setValue({ ...value, name: text })}
            ></TextInput>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={value.username}
            onChangeText={(text) => setValue({ ...value, username: text })}
          >
          </TextInput>
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
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={value.confirmedPassword}
            onChangeText={(text) => setValue({ ...value, confirmedPassword: text })}
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
              opacity: value.name === '' || value.username === '' || value.email === '' || value.password === '' || value.confirmedPassword === '' ? 0.3 : 1
            }}
            disabled={value.name === '' || value.username === '' || value.email === '' || value.password === '' || value.confirmedPassword === ''}
            onPress={signup}
          >
            <Text
              style={{fontSize: 16}} 
            >Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
          >
            <Text 
              onPress={() => navigation.navigate('Login')}
              style={{fontSize: 16, color: '#808080'}}
            >Already have an account?</Text>
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
    signuptitle: {
      fontSize: 32,
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
      fontSize: 16
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

export default SignupPage;