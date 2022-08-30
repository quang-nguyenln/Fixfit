import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    ImageBackground,
    Image,
    Button,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { Avatar } from 'react-native-paper';
import { useAuthentication } from '../../utils/hooks/useAuthentication';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { storage, db } from '../../config/firebase'
import { setDoc, addDoc, doc } from 'firebase/firestore'
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import CachedImage from 'expo-cached-image'

const EditProfile = (props) => {

    const { user } = useAuthentication();
    const navigation = useNavigation();

    const [username, setUsername] = useState(props.username);
    const [name, setName] = useState(props.name);
    const [email, setEmail] = useState(props.email);
    const [bio, setBio] = useState(props.bio);
    const [profilePicName, setProfilePicName] = useState(props.profilePicName);

    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(props.profilePic);

    const [ uploading, setUploading ] = useState(false);

    const pickImage = async () => {
        let photo = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!photo.cancelled) {
            setImage(photo);
            setImageUrl(photo.uri);
        }
    }

    const Edit = async () => {

        setUploading(true);

        if (image != null) {
            const imageRef = ref(storage, `${user.email}/profile/profilePicture`);
    
            const img = await fetch(image.uri);
            const bytes = await img.blob();
            const uploadTask = await uploadBytesResumable(imageRef, bytes);

            const dateTime = Date.now() + '';
    
            getDownloadURL(imageRef).then((downloadURL) => {
                try {
                    setDoc(doc(db, "users", email), {
                        name: name,
                        username: username,
                        bio: bio,
                        profilePicture: downloadURL,
                        profilePicName: dateTime
                    })
                }
                catch(error) {
                    console.log(error);
                }
                navigation.navigate("Profile"); //use with await
            })
        } else {
            try {
                setDoc(doc(db, "users", email), {
                    name: name,
                    username: username,
                    bio: bio,
                    profilePicture: imageUrl,
                    profilePicName: profilePicName
                })
            } catch(error) {
                console.log(error);
            }
            navigation.navigate("Profile");
        }
        setUploading(false);
    }

    const EditHeader = () => {
      
        return (
          <View style={headerStyles.header}>
            <Button 
              title="Cancel" 
              onPress={() => navigation.navigate('Profile')}
            />
            <Text style={headerStyles.titleText}>Edit Profile</Text>
            <Button 
              title="Edit" 
              onPress={Edit}
            />
          </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <EditHeader />
            <View style={{ marginVertical: 10, justifyContent: 'center', alignItems: 'center' }}>
              { uploading && <Text style={{ color: 'gray' }}>Uploading in progress...</Text> }
            </View>
            <ScrollView 
                keyboardShouldPersistTaps='handled'
                contentContainerStyle={{ alignItems: 'center' }}
            >
                <Image 
                    style={{ marginVertical: 25, width: 120, height: 120, borderRadius: 100 }} 
                    source={{ uri: imageUrl }}
                />
                {/* <CachedImage
                    source={{ 
                        uri: imageUrl, // (required) -- URI of the image to be cached         
                    }}
                    cacheKey={profilePicName} // (required) -- key to store image locally
                    placeholderContent={( // (optional) -- shows while the image is loading
                        <ActivityIndicator // can be any react-native tag
                        size="small"
                        style={{
                            flex: 1,
                            justifyContent: "center",
                        }}
                        />
                    )} 
                    resizeMode="contain" // pass-through to <Image /> tag 
                    style={styles.image} // pass-through to <Image /> tag s
                /> */}

                <TouchableOpacity 
                    style={{marginBottom: 30}}
                    onPress={pickImage}
                >
                    <Text style={{color: 'gray'}}>Change Profile Image</Text>
                </TouchableOpacity> 
                <View style={styles.inputContainer}>
                    <View style={styles.inputBox}>
                        <Text style={styles.inputTitle}>Username</Text>
                        <TextInput 
                            value={username}
                            placeholder="Username"
                            style={styles.input}
                            onChangeText={(text) => setUsername(text)}
                        />
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.inputTitle}>Name</Text>
                        <TextInput 
                            value={name}
                            placeholder="Name"
                            style={styles.input}
                            onChangeText={(text) => setName(text)}
                    />
                    </View>
                    {/* <View style={styles.inputBox}>
                        <Text style={styles.inputTitle}>Email</Text>
                        <TextInput 
                            value={email}
                            style={styles.input}
                    />
                    </View> */}
                    <View style={styles.inputBox}>
                        <Text style={styles.inputTitle}>Bio</Text>
                        <TextInput 
                            value={bio}
                            placeholder="Bio"
                            style={styles.input}
                            onChangeText={(text) => setBio(text)}
                    />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const headerStyles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        height: '6%',
        backgroundColor: '#fff',
        borderBottomColor: '#808080',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    titleText: {
        fontSize: 18,
        fontWeight: '600',
    }
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    avatar: {
        marginBottom: '5%',
        marginTop: '5%'
    },
    input: {
        flex: 1,
        marginVertical: 10,
        paddingHorizontal: 6,
        marginLeft: 20,
        fontSize: 16,
    },
    inputBox: {
        flexDirection: 'row',
        width: '80%',
        marginBottom: 20,
        borderBottomColor: '#808080',
        borderBottomWidth: StyleSheet.hairlineWidth,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    inputTitle: {
        flex: 0.4,
    }
})

export default EditProfile
