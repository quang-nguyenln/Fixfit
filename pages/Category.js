import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { Header } from '../navigation/Header';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import { storage, db } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getDocs, collection, query, where, orderBy } from "firebase/firestore";
import { useIsFocused } from '@react-navigation/native';
import { set } from 'firebase/database';

import CachedImage from 'expo-cached-image';

const auth = getAuth();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('react-native-fs');
const path = require('react-native-path');


const Category = (props) => {
  const [urls, setUrls] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const inputPath = './img/1.jpg';
    const formData = new FormData();
    formData.append('size', 'auto');
    formData.append('image_file', fs.createReadStream(inputPath), path.basename(inputPath));

    axios({
      method: 'post',
      url: 'https://api.remove.bg/v1.0/removebg',
      data: formData,
      responseType: 'arraybuffer',
      headers: {
        ...formData.getHeaders(),
        'X-Api-Key': 'INSERT_YOUR_API_KEY_HERE',
      },
      encoding: null
    })
    .then((response) => {
      if(response.status != 200) return console.error('Error:', response.status, response.statusText);
      fs.writeFileSync("no-bg.png", response.data);
    })
    .catch((error) => {
        return console.error('Request failed:', error);
    });
    const fetchData = async () => {
      const q = query(collection(db, "users", props.email, props.name), orderBy("name", "desc"));
      const querySnapshot = await getDocs(q);
      setUrls([]);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const obj = {
          key: doc.data().name,
          url: doc.data().url
        }
        console.log('set');
        setUrls(urls => [...urls, obj]);
      });
    }
    try {
      fetchData();
    } catch(error) {
      console.log(error);
    }
  }, [isFocused]);

  return (
    <>
      <View style={styles.container}>
        <SafeAreaView style={{ flex: 1 }}>
          <FlatList
            data={urls}
            renderItem={({ item }) => <Item item={item} />}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </View>
    </>
  );
}

const Item = ({item}) => {
  const [isVisible, setVisible] = useState(false);

  const deletePost = async () => {
    await deleteDoc(doc(db, "users", item.email, "posts", item.postName));

    const storageRef = ref(storage, `${item.email}/images/${item.postName}`);

    try {
      deleteObject(storageRef);
    } catch(error) {
      console.log(error);
    }
  }

  return (
    <View style={{ flex: 1, flexDirection: 'column', paddingVertical: 15}}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: "center", 
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 300,
    paddingTop: 10
  },
});

export default Category;