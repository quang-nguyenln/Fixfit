import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Avatar } from 'react-native-paper';
import Divider from '../components/PickerModal/components/divider/Divider';
import { Header } from '../navigation/Header';
import React, { useState, useEffect } from 'react';
import {  MaterialIcons } from '@expo/vector-icons';
import PickerModal from '../components/PickerModal/PickerModal';
import { getAuth, signOut } from 'firebase/auth';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import { storage, db } from '../config/firebase';
import { doc, getDoc, getDocs, collection, query, where, orderBy, limit } from "firebase/firestore";

import CachedImage from 'expo-cached-image'

const auth = getAuth();

const ProfilePage = (props) => {
  const navigation = useNavigation();
  const [isVisible, setVisible] = useState(false);
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "users", props.email, "posts"), orderBy("name", "desc"), limit(6));
      const querySnapshot = await getDocs(q);
      setUrls([]);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const obj = {
          key: doc.data().name,
          imageUrl: doc.data().url
        }
        setUrls(urls => [...urls, obj]);
      });
    }
    try {
      fetchData();
    } catch(error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerText}> {props.username} </Text>
        <MaterialIcons name='menu' size={30} style={styles.icon} onPress={() => setVisible(true)} />
        <PickerModal
          title= "You can either take a picture or select one from your album."
          isVisible={isVisible}
          data={["About", "Sign out"]}
          onPress={(selectedItem) => {
            if (selectedItem === 'About') {
              navigation.navigate('CameraCloset');
              setVisible(false);
            } else {
              setVisible(false);
              signOut(auth);
            }
          }}
          onCancelPress={() => {
            setVisible(false);
          }}
          onBackdropPress={() => {
            setVisible(false);
          }}
        />
        </View>
      <ProfileBody name={props.name} urls={urls} profilePic={props.profilePic} profilePicName={props.profilePicName} bio={props.bio} />
      <ScrollView style={styles.displayBox}>
          <FlatList
            data={urls}
            numColumns={3}
            renderItem={({ item }) => <Item item={item} />}
            showsVerticalScrollIndicator={false}
          />
          {/* <Images urls={props.urls} /> */}
      </ScrollView>
    </>
  );
}

const Item = ({item}) => {

  return (
    <View style={{flex: 1/3, marginHorizontal: 10, marginVertical: 10}}>
      <CachedImage
          source={{ 
            uri: item.uri, // (required) -- URI of the image to be cached         
          }}
          cacheKey={item.key} // (required) -- key to store image locally
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
        />
    </View>
  );
}

const ProfileBody = (props) => {
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      {/* <Image 
            style={{ marginVertical: 25, width: 120, height: 120, borderRadius: 100 }} 
            source={{ uri: props.profilePic }}
        /> */}
      <CachedImage
          source={{ 
            uri: props.profilePic, // (required) -- URI of the image to be cached         
          }}
          cacheKey={props.profilePicName} // (required) -- key to store image locally
          placeholderContent={( // (optional) -- shows while the image is loading
            <ActivityIndicator // can be any react-native tag
              size="small"
              style={{
                flex: 1,
                justifyContent: "center",
              }}
            />
          )}
          style={{ marginVertical: 25, width: 120, height: 120, borderRadius: 100 }} // pass-through to <Image /> tag s
      />
        <Text style={styles.profilename}>{props.name}</Text>
        <Text style={styles.button}>{props.bio}</Text>
        <TouchableOpacity
          style={styles.buttonfilled}
          onPress={() => {navigation.navigate('EditProfile')}}
        >
          <Text> Edit Profile </Text>
        </TouchableOpacity>
        <Divider style={styles.divider}/>
        <View style={styles.displayBar}> 
          <Text style={styles.textLeft}> Past six days </Text>
          <TouchableOpacity>
            <Text style={{fontSize: 16}} onPress={() => {navigation.navigate('Social')}}> See more </Text>
          </TouchableOpacity>
        </View>
      </View>
  );
}


const headerStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
      width: '100%',
      height: '100%',
      height: '13%',
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: '#fff',
  },
  headerText: {
      fontWeight: 'bold',
      fontSize: 30,
      color: '#000',
      position: 'absolute',
      left: 10,
      top: '55%',
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    height: '12%',
    backgroundColor: '#fff',
  },
  headerText: {
    flexDirection: "row", 
    alignItems: "center", 
    flex: 1,
    fontSize: 20,
    paddingLeft: 8,
    top: '65%',
    fontWeight: '400',
  },
  icon: {
    flexDirection: "row", 
    alignItems: "center", 
    top:'62%',
    paddingRight: 5
  },
  avatar: {
    marginBottom: '5%',
    marginTop: '10%'
  },
  profilename: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: '2%',
  }, 
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#3b3b3b",
    marginBottom: '2%',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    borderRadius: 5,
    fontSize: 15,
    marginBottom: 10,
  }, 
  buttonfilled: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: 40,
    borderRadius: '20',
    backgroundColor:'#DCDCDC',
    marginBottom: 20,
    boxShadow: 10,
  },
  textLeft: {
    flexDirection: "row", 
    alignItems: "center", 
    flex: 1,
    fontSize: 16,
    paddingLeft: 8,
  },
  displayBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  displayBox: {
    flex: 1/3,
    width: '100%',
    backgroundColor: 'white'
  },
  image: {
    width: 105,
    flexDirection: "row", 
    alignItems: "center", 
    marginLeft: '3%',
    marginRight: '3%',
    aspectRatio: 1/1,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 4
  }
});

const PICTURES = [
  {
    imageUrl: 'https://picsum.photos/id/1002/200',
  },
  {
    imageUrl: 'https://picsum.photos/id/1006/200',
  },
  {
    imageUrl: 'https://picsum.photos/id/1008/200',
  },
  {
    imageUrl: 'https://picsum.photos/id/1002/200',
  },
  {
    imageUrl: 'https://picsum.photos/id/1006/200',
  },
  {
    imageUrl: 'https://picsum.photos/id/1008/200',
  },
  {
    imageUrl: 'https://picsum.photos/id/1002/200',
  },
  {
    imageUrl: 'https://picsum.photos/id/1006/200',
  },
];

export default ProfilePage;