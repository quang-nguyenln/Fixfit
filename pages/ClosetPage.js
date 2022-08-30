import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  SafeAreaView,
  Image,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import PickerModal from '../components/PickerModal/PickerModal';
import * as ImagePicker from 'expo-image-picker';
import { storage, db } from '../config/firebase';
import { doc, getDoc, getDocs, collection, query, where, orderBy } from "firebase/firestore";

import CachedImage from 'expo-cached-image'

const ListItem = ({ item }) => {
  return (
    <View style={styles.item}>
      {/* <Image
        source={{
          uri: item.uri,
        }}
        style={styles.itemPhoto}
        resizeMode="cover"
      /> */}
      {/* <Text style={styles.itemText}>{item.text}</Text> */}
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
          style={              // pass-through to <Image /> tag 
            styles.itemPhoto
          }
        />
    </View>
  );
};

const ClosetPage = (props) => {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isVisible, setVisible] = useState(false);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const catList = ["Accessories", "Outerwear", "Tops", "Bottoms", "Dresses/Skirts", "Shoes"];
      setSections([]);
        catList.forEach(async (category) => {
            const l = [];
            const q = query(collection(db, "users", props.email, category.replace('/','')), orderBy("name", "desc"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              const image = {
                key: doc.data().name,
                uri: doc.data().url,
              }
              l.push(image);
            });
            const newSection = {
              title: category,
              data: l
            }
            setSections(sections => [...sections, newSection]);
        })
    }
    try {
      fetchData();
    } catch(error) {
      console.log(error);
    }
  }, []);


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result);
      setPreview(true);
    }
  };

  const resetPicture = () => {
    setImage(null);
    setPreview(false);
    setVisible(false);
  }

  return (
      <View style={styles.container}>
        {preview && image ? (
          navigation.navigate('ImageCloset', {
            photo: image, 
          }),
          console.log(image),
          resetPicture()
      ) : (
        <>
     <View style={headerStyles.header}>
        <Text style={headerStyles.headerText}> Closet </Text>
        <Ionicons name='camera' size={30} style={headerStyles.icon} onPress={() => setVisible(true)}/>
        <PickerModal
          title="You can either take a picture or select one from your album."
          isVisible={isVisible}
          data={["Take a photo", "Select from album"]}
          onPress={(selectedItem) => {
            if (selectedItem === 'Take a photo') {
              navigation.navigate('CameraCloset');
              setVisible(false);
            } else {
              pickImage();
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
    <ClosetBody sections={sections} />
    </>
      )}
      </View>
  );
}

const ClosetBody = (props) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
    <StatusBar style="light" />
    <SafeAreaView style={{ flex: 1 }}>
      <SectionList
        contentContainerStyle={{ paddingLeft: 15 }}
        stickySectionHeadersEnabled={false}
        sections={props.sections}
        renderSectionHeader={({ section }) => (
          <>
            <Text style={styles.sectionHeader} onPress={() => navigation.navigate(section.title.replace('/',''))}>
              {section.title}
              </Text>
            <FlatList
              horizontal
              data={section.data}
              renderItem={({ item }) => <ListItem item={item} />}
              showsHorizontalScrollIndicator={false}
            />
          </>
        )}
        renderItem={({ item, section }) => {
          return null;
        }}
      />
    </SafeAreaView>
    </View>
  )
}

const headerStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    height: '12%',
    backgroundColor: '#fff',
  },
  headerText: {
      fontWeight: 'bold',
      fontSize: 30,
      color: '#000',
      flexDirection: "row", 
      alignItems: "center", 
      paddingLeft: 0,
      flex: 1,
      top: '55%',
  },
  icon: {
    flexDirection: "row", 
    alignItems: "center", 
    top:'57%',
    paddingRight: 5
  },
});

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
    width: 200,
    height: 200,
  },
  itemText: {
    color: '#000000',
    marginTop: 5,
  },
  imagePrev: {
    backgroundColor: 'transparent',
    flex: 1,
    width: '100%',
    height: '100%'
  },
  cancelButton: {
    position: 'absolute',
    top: 30,
    left: 30,
    flex: 0.1,
    color: '#fff',
  },
});

const SECTIONS = [
  {
    title: 'Accessories',
    horizontal: true,
    data: [
      {
        key: '1',
        text: 'Item text 1',
        uri: 'https://picsum.photos/id/1/200',
      },
      {
        key: '2',
        text: 'Item text 2',
        uri: 'https://picsum.photos/id/10/200',
      },

      {
        key: '3',
        text: 'Item text 3',
        uri: 'https://picsum.photos/id/1002/200',
      },
      {
        key: '4',
        text: 'Item text 4',
        uri: 'https://picsum.photos/id/1006/200',
      },
      {
        key: '5',
        text: 'Item text 5',
        uri: 'https://picsum.photos/id/1008/200',
      },
    ],
  },
  {
    title: 'Outerwear',
    data: [
      {
        key: '1',
        text: 'Item text 1',
        uri: 'https://picsum.photos/id/1011/200',
      },
      {
        key: '2',
        text: 'Item text 2',
        uri: 'https://picsum.photos/id/1012/200',
      },

      {
        key: '3',
        text: 'Item text 3',
        uri: 'https://picsum.photos/id/1013/200',
      },
      {
        key: '4',
        text: 'Item text 4',
        uri: 'https://picsum.photos/id/1015/200',
      },
      {
        key: '5',
        text: 'Item text 5',
        uri: 'https://picsum.photos/id/1016/200',
      },
    ],
  },
  {
    title: 'Tops',
    data: [
      {
        key: '1',
        text: 'Item text 1',
        uri: 'https://picsum.photos/id/1020/200',
      },
      {
        key: '2',
        text: 'Item text 2',
        uri: 'https://picsum.photos/id/1024/200',
      },

      {
        key: '3',
        text: 'Item text 3',
        uri: 'https://picsum.photos/id/1027/200',
      },
      {
        key: '4',
        text: 'Item text 4',
        uri: 'https://picsum.photos/id/1035/200',
      },
      {
        key: '5',
        text: 'Item text 5',
        uri: 'https://picsum.photos/id/1038/200',
      },
    ],
  },
  {
    title: 'Bottoms',
    data: [
      {
        key: '1',
        text: 'Item text 1',
        uri: 'https://picsum.photos/id/1020/200',
      },
      {
        key: '2',
        text: 'Item text 2',
        uri: 'https://picsum.photos/id/1024/200',
      },

      {
        key: '3',
        text: 'Item text 3',
        uri: 'https://picsum.photos/id/1027/200',
      },
      {
        key: '4',
        text: 'Item text 4',
        uri: 'https://picsum.photos/id/1035/200',
      },
      {
        key: '5',
        text: 'Item text 5',
        uri: 'https://picsum.photos/id/1038/200',
      },
    ],
  },
  {
    title: 'Dresses/Skirts',
    data: [
      {
        key: '1',
        text: 'Item text 1',
        uri: 'https://picsum.photos/id/1020/200',
      },
      {
        key: '2',
        text: 'Item text 2',
        uri: 'https://picsum.photos/id/1024/200',
      },

      {
        key: '3',
        text: 'Item text 3',
        uri: 'https://picsum.photos/id/1027/200',
      },
      {
        key: '4',
        text: 'Item text 4',
        uri: 'https://picsum.photos/id/1035/200',
      },
      {
        key: '5',
        text: 'Item text 5',
        uri: 'https://picsum.photos/id/1038/200',
      },
    ],
  },
  {
    title: 'Shoes',
    data: [
      {
        key: '1',
        text: 'Item text 1',
        uri: 'https://picsum.photos/id/1020/200',
      },
      {
        key: '2',
        text: 'Item text 2',
        uri: 'https://picsum.photos/id/1024/200',
      },

      {
        key: '3',
        text: 'Item text 3',
        uri: 'https://picsum.photos/id/1027/200',
      },
      {
        key: '4',
        text: 'Item text 4',
        uri: 'https://picsum.photos/id/1035/200',
      },
      {
        key: '5',
        text: 'Item text 5',
        uri: 'https://picsum.photos/id/1038/200',
      },
    ],
  },
];

export default ClosetPage;