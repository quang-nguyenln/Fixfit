import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Button,
  SafeAreaView,
} from 'react-native';
import {MaterialIcons } from '@expo/vector-icons';
import PickerModal from '../PickerModal/PickerModal';
import { useAuthentication } from '../../utils/hooks/useAuthentication';
import { storage, db, database } from '../../config/firebase';
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { setDoc, doc } from 'firebase/firestore'


const ImageCloset = ({route}) => {
    const {photo} = route.params;
    const navigation = useNavigation();
    const [isVisible, setVisible] = useState(false);
    const { user } = useAuthentication();
    const [ uploading, setUploading ] = useState(false);
    
    const savePhoto = async (category) => {

      setUploading(true);

      const dateTime = Date.now() + '';
      const imageRef = ref(storage, `${user.email}/${category}/${dateTime}`);

      const img = await fetch(photo.uri);
      const bytes = await img.blob();
  
      // uploadBytes(imageRef, bytes).then((snapshot) => {
      //   console.log("Upload Successful.");
      // });
      
      const uploadTask = await uploadBytesResumable(imageRef, bytes);

      getDownloadURL(imageRef).then((downloadURL) => {
        try {
          console.log('uploaded');
          const postRef = doc(db, "users", user.email, category, dateTime);
          setDoc(postRef, {
            name: dateTime,
            url: downloadURL,
          })
        }
        catch(error) {
          console.log(error);
        }
        setUploading(false);
        navigation.navigate(category.replace('/',''));
      });
    }

    const PostHeader = () => {

      const navigation = useNavigation();
    
      return (
        <View style={headerStyles.header}>
          <Button 
            title="Cancel" 
            onPress={() => navigation.navigate('Closet')}
          />
          <Text style={headerStyles.titleText}>Upload</Text>
          <Button 
            title="Upload" 
            onPress={() => {
                setVisible(true); 
            }}
          />
          <PickerModal
            title="Choose a category that you would like to save to."
            isVisible={isVisible}
            data={["Accessories", "Outerwear", "Tops", "Bottoms", "Dresses/Skirts", "Shoes"]}
            onPress={(selectedItem) => {
              savePhoto(selectedItem);
              setVisible(false);
            }}
            onCancelPress={() => {
              setVisible(false);
            }}
            onBackdropPress={() => {
              setVisible(false);
            }}
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

        <ImageBackground
          source={{uri: photo && photo.uri}}
          style={styles.itemPhoto}
        />
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
      width: '100%',
      height: undefined,
      aspectRatio: 1
    },
    itemText: {
      color: '#000000',
      marginTop: 5,
    },
    imagePrev: {
      backgroundColor: 'white',
      flex: 1,
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
    test: {
      position: 'absolute',
      top: 65,
      alignSelf: 'center',
      flex: 0.1,
    },
    text: {
        fontSize: 20,
        color: 'white',
    },
  });

export default ImageCloset;