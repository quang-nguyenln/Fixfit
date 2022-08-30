import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import {  MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import PickerModal from '../PickerModal/PickerModal';
import { useAuthentication } from '../../utils/hooks/useAuthentication';
import { storage } from '../../config/firebase';
import { ref, uploadBytesResumable, uploadBytes } from "firebase/storage";


export default function CameraComp() {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [previewVisible, setPreviewVisible] = useState(null);
  const [chooseImage, setChooseImage] = useState(null);
  const [flash, setFlash] = useState('off');
  const navigation = useNavigation();

  const takePicture = async () => {
    const photo = await cameraRef.current.takePictureAsync();
    console.log(photo);
    setPreviewVisible(true);
    setChooseImage(photo);
  };

  const handleFlash = () => {
    if (flash === 'on') {
      setFlash('off')
    } else if (flash === 'off') {
      setFlash('on')
    } else {
      setFlash('auto')
    }
  }

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text> No access to camera </Text>;
  }

  

  const retakePicture = () => {
    setChooseImage(null);
    setPreviewVisible(false);
  }

  return (
    <View style={styles.container}>
      {previewVisible && chooseImage ? (
            <CameraPreview 
              photo={chooseImage} 
              retakePicture={retakePicture} 
              setChooseImage={setChooseImage} />
          ) : (
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.flipContainer}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={() => {
              setType(type === CameraType.back ? CameraType.front : CameraType.back);
            }}>
            <Ionicons name="camera-reverse-outline" size={30} color="white"/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {navigation.navigate('Closet');}}>
            <MaterialIcons 
              name='close' 
              size={30} 
              style={styles.cancelButton} 
              onPress={() => {navigation.navigate('Closet');}}/>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleFlash}
            style={styles.flashButton}
          >
          {flash === 'on' ? (
            <Ionicons name='flash-off-outline' size={30} color="white" onPress={handleFlash}/>
          ) : (
            <Ionicons name='flash-outline' size={30} color="white" onPress={handleFlash}/>
          )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={takePicture}
          style={styles.picButton}/> 
      </Camera>
          )}
    </View>
  );
}

const CameraPreview = ({photo, retakePicture, setChooseImage}) => {
  const [isVisible, setVisible] = useState(false);
  const navigation = useNavigation();
  const { user } = useAuthentication();

  const savePhoto = async (category) => {
    const dateTime = Date.now() + '';
    const imageRef = ref(storage, `${user.email}/${category}/${dateTime}`);

    const img = await fetch(photo.uri);
    const bytes = await img.blob();

    // uploadBytes(imageRef, bytes).then((snapshot) => {
    //   console.log("Upload Successful.");
    // });

    const uploadTask = await uploadBytesResumable(imageRef, bytes);

    setChooseImage(null);
    

    navigation.navigate(category.replace('/',''));
  
  }
  

  return (
    <View style={styles.imagePrev}>
      <ImageBackground
        source={{uri: photo.uri}}
        style={{ flex: 1 }}>
        <View style={styles.flipContainer}>
          <TouchableOpacity onPress={() => {navigation.navigate('Closet');}}>
            <MaterialIcons 
              name='close' 
              size={30} 
              style={styles.cancelButton} 
              onPress={() => {
                navigation.navigate('Closet');
                retakePicture(); }}/>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            padding: 15,
            justifyContent: 'flex-end'
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={ retakePicture } style={ styles.secondScreen }>
              <Text style={styles.text}> Retake </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => {
                setVisible(true); 
              }} 
              style={ styles.secondScreen }>
              <Text style={styles.text}> Save </Text>
            </TouchableOpacity>
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
        </View>
      </ImageBackground>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  imagePrev: {
    backgroundColor: 'transparent',
    flex: 1,
    width: '100%',
    height: '100%'
  },
  picButton: {
    width: 70,
    height: 70,
    bottom: 60,
    borderRadius: 50,
    backgroundColor: '#fff',
    alignSelf: 'center',
  },
  flipContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  flipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    flex: 0.1,
    paddingRight: 15,
  },
  flashButton: {
    position: 'absolute',
    top: 120,
    right: 20,
    flex: 0.1,
    paddingRight: 15,
  },
  cancelButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    flex: 0.1,
    color: '#fff',
    paddingLeft: 15,
  },
  text: {
    fontSize: 20,
    color: 'white',
  },
  secondScreen: {
    width: 130,
    height: 40,
    alignItems: 'center',
    borderRadius: 4,
    bottom: 55,
  },
});