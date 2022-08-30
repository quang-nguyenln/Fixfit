import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ImageBackground,
  Button,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView
} from 'react-native';
import { ref, uploadBytes, uploadBytesResumable, uploadString, getDownloadURL } from "firebase/storage";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuthentication } from '../../utils/hooks/useAuthentication';
import { storage, db } from '../../config/firebase'
import { setDoc, doc } from 'firebase/firestore'


const ImageSocial = ({route}) => {
    const navigation = useNavigation();
    const { photo } = route.params;
    const [ caption, setCaption ] = useState('');
    const [ imgUrl, setImgUrl ] = useState('');
    const [ uploading, setUploading ] = useState(false);
    //const [ percent, setPercent ] = useState(0);

    const { user } = useAuthentication();

    const sharePost = async () => {

      setUploading(true);

      const dateTime = Date.now() + '';
      const imageRef = ref(storage, `${user.email}/images/${dateTime}`);

      const img = await fetch(photo.uri);
      const bytes = await img.blob();
      const uploadTask = await uploadBytesResumable(imageRef, bytes);

      getDownloadURL(imageRef).then((downloadURL) => {
        try {
          const postRef = doc(db, "users", user.email, "posts", dateTime);
          setDoc(postRef, {
            name: dateTime,
            url: downloadURL,
            caption: caption
          })
        }
        catch(error) {
          console.log(error);
        }

        setUploading(false);
        setCaption('');
        navigation.navigate("Social"); //use with await
      });

      //Progress bar sometimes working, not all the time
      // uploadTask.on('state_changed',
      //   (snapshot) => {
      //     setPercent(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100 / 100));
      //   },
      //   (error) => {
      //     alert(error);
      //   },
      //   () => {
      //     navigation.navigate("Social");
      //   })
    }

    const PostHeader = () => {

      const navigation = useNavigation();
    
      return (
        <View style={headerStyles.header}>
          <Button 
            title="Cancel" 
            onPress={() => navigation.navigate('Social')}
          />
          <Text style={headerStyles.titleText}>Post</Text>
          <Button 
            title="Share" 
            onPress={sharePost}
          />
        </View>
      )
    }
    
    return (
      <SafeAreaView style={styles.imagePrev}>
        <PostHeader />
          <View style={{ marginVertical: 10, justifyContent: 'center', alignItems: 'center' }}>
              { uploading && <Text style={{ color: 'gray' }}>Uploading in progress...</Text> }
          </View>
        <ScrollView keyboardShouldPersistTaps='handled'>
          <View 
            style={styles.comment}
          >
            <ImageBackground
                source={{uri: photo && photo.uri}}
                style={styles.itemPhoto}
            />
            <TextInput 
                value={caption}
                style={styles.input}
                multiline={true}
                textAlignVertical="top"
                placeholder="Comment..."
                onChangeText={(text) => setCaption(text)}
            />
          </View> 
        </ScrollView>
      </SafeAreaView>
    )
};

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
    fontWeight: '600'
  }
})

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
    sectionHeader: {
      fontWeight: '700',
      fontSize: 19,
      color: '#000000',
      marginTop: 20,
      marginBottom: 10,
    },
    item: {
      paddingRight: 20
    },
    itemPhoto: {
      aspectRatio: 1,
      height: 80,
      margin: 8
    },
    itemText: {
      color: '#000000',
      marginTop: 5,
    },
    imagePrev: {
      backgroundColor: 'white',
      flex: 1,
      // width: '100%',
      // height: '100%'
    },
    cancelButton: {
      position: 'absolute',
      top: 60,
      left: 20,
      flex: 0.1,
      color: '#fff',
    },
    secondScreen: {
      position: 'absolute',
      bottom: 55,
      right: 20,
      flex: 0.1,
      color: '#fff',
    },
    text: {
        fontSize: 20,
        color: 'white',
    },
    input: {
      flex: 1,
      marginVertical: 10,
      paddingHorizontal: 6,
    },
    comment: {
      flexDirection: 'row',
      height: 95,
      borderBottomColor: '#808080',
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    wheel: {
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    }
  });

export default ImageSocial;