import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import HomePage from '../pages/HomePage';
import ClosetPage from '../pages/ClosetPage';
import SocialPage from '../pages/SocialPage';
import ProfilePage from '../pages/ProfilePage';

import Category from '../pages/Category'

import Feather from 'react-native-vector-icons/Feather';
import CameraCloset from '../components/Closet/CameraCloset';
import CameraSocial from '../components/Social/CameraSocial';
import ImageCloset from '../components/Closet/ImageCloset';
import ImageSocial from '../components/Social/ImageSocial';
import EditPost from '../components/Social/EditPost';
import EditProfile from '../components/Profile/EditProfile'

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

import { useAuthentication } from '../utils/hooks/useAuthentication';

import { doc, getDoc } from "firebase/firestore";
import { db } from '../config/firebase'

const TabNavigator = () => {

    const { user } = useAuthentication();

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [profilePicName, setProfilePicName] = useState('');
    const [bio, setBio] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const docRef = doc(db, "users", user.email);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setName(docSnap.data().name);
                setUsername(docSnap.data().username);
                setBio(docSnap.data().bio);
                setProfilePic(docSnap.data().profilePicture);
                setProfilePicName(docSnap.data().profilePicName);
            } else {
                // Cannot fetch data
                setName('unknown');
                setUsername('unknown');
                console.log("Cannot load user.")
            }
        }
        try {
            fetchData();
        } catch(error) {
            console.log(error);
        }
    });

    const ProfilePageWithProps = () => {
        return <ProfilePage email={user.email} name={name} username={username} profilePic={profilePic} bio={bio} profilePicName={profilePicName}/>
    }

    const SocialPageWithProps = () => {
        return <SocialPage email={user.email} username={username} profilePic={profilePic} profilePicName={profilePicName}/>
    }
    const EditProfileWithProps = () => {
        return <EditProfile email={user.email} username={username} name={name} profilePic={profilePic} bio={bio} profilePicName={profilePicName} />
    }

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {backgroundColor: '#fff'},
                tabBarInactiveTintColor: 'gray',
                tabBarActiveTintColor: 'black',
            }}
        >
            <Tab.Screen 
                name="Home" 
                component={HomeStack} 
                options={() => ({
                    tabBarIcon: ({color, size}) => (
                        <Feather name="home" color={color} size={24} />
                    ),
                })}
            />
            <Tab.Screen 
                name="Closet" 
                component={ClosetStack} 
                options={() => ({
                    tabBarIcon: ({color, size}) => (
                        <Feather name="columns" color={color} size={24} />
                    ),
                })}  
            />
            <Tab.Screen 
                name="Social" 
                component={SocialPageWithProps} 
                options={() => ({
                    tabBarIcon: ({color, size}) => (
                        <Feather name="globe" color={color} size={24} />
                    ),
                })}    
            />
            <Tab.Screen 
                name="Profile" 
                component={ProfilePageWithProps} 
                options={() => ({
                    tabBarIcon: ({color, size}) => (
                        <Feather name="user" color={color} size={24} />
                    ),
                })} 
            />
            <Stack.Screen 
                name="CameraSocial" 
                component={CameraSocial}
                options={({route}) => ({
                    tabBarIcon: ({color, size}) => (
                        <Feather name="camera" color={color} size={24} />
                    ),
                    tabBarStyle: { display: 'none', },
                    tabBarButton: (prop) => null,
                })} 
            />
            <Stack.Screen 
                name="ImageSocial" 
                component={ImageSocial}
                options={({route}) => ({
                    tabBarIcon: ({color, size}) => (
                        <Feather name="camera" color={color} size={24} />
                    ),
                    tabBarStyle: { display: 'none' },
                    tabBarButton: (prop) => null,
                })} 
            />
            <Stack.Screen 
                name="EditPost" 
                component={EditPost}
                options={({route}) => ({
                    tabBarIcon: ({color, size}) => (
                        <Feather name="camera" color={color} size={24} />
                    ),
                    tabBarStyle: { display: 'none' },
                    tabBarButton: (prop) => null,
                })} 
            />
            <Tab.Screen 
                name="CameraCloset" 
                component={CameraCloset}
                options={({route}) => ({
                    tabBarIcon: ({color, size}) => (
                        <Feather name="camera" color={color} size={24} />
                    ),
                    tabBarStyle: { display: 'none' },
                    tabBarButton: (prop) => null,
                })} 
            />
            <Tab.Screen 
                name="ImageCloset" 
                component={ImageCloset}
                options={({route}) => ({
                    tabBarIcon: ({color, size}) => (
                        <Feather name="camera" color={color} size={24} />
                    ),
                    tabBarStyle: { display: 'none' },
                    tabBarButton: (prop) => null,
                })} 
            />
            <Stack.Screen 
                name="EditProfile" 
                component={EditProfileWithProps}
                options={({route}) => ({
                    tabBarStyle: { display: 'none' },
                    tabBarButton: (prop) => null,
                })} 
            />
        </Tab.Navigator>
    );
};

const HomeStack = (props) => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="HomeS"
                component={HomePage}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}

const ClosetStack = () => {

    const { user } = useAuthentication();

    const ClosetPageWithProps = () => {
        return <ClosetPage email={user?.email}/>
    }
    const Accessories = () => { return ( <Category name="Accessories" email={user?.email}/> ) }
    const Outerwear = () => { return ( <Category name="Outerwear" email={user?.email}/> ) }
    const Tops = () => { return ( <Category name="Tops" email={user?.email} /> ) }
    const Bottoms = () => { return ( <Category name="Bottoms" email={user?.email}/> ) }
    const DressesSkirts = () => { return ( <Category name="Dresses/Skirts" email={user?.email}/> ) }
    const Shoes = () => { return ( <Category name="Shoes" email={user?.email}/> ) }

    return (
        <Stack.Navigator>
             <Stack.Screen 
                name="ClosetS"
                component={ClosetPageWithProps}
                options={{ headerShown: false }}
            />
             <Stack.Screen 
                name="Accessories"
                component={Accessories}
            />
            <Stack.Screen 
                name="Outerwear"
                component={Outerwear}
            />
            <Stack.Screen 
                name="Tops"
                component={Tops}
            />
            <Stack.Screen 
                name="Bottoms"
                component={Bottoms}
            />
            <Stack.Screen 
                name="DressesSkirts"
                component={DressesSkirts}
            />
            <Stack.Screen 
                name="Shoes"
                component={Shoes}
            />
        </Stack.Navigator>
    )
}




export default TabNavigator;