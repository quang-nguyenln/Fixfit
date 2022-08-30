import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import {  MaterialIcons } from '@expo/vector-icons';


export function Header () {
    let [fontsLoaded] = useFonts({
        'SFPro': require('../assets/fonts/SF-Pro-Display-Bold.otf'),
      });

    if (!fontsLoaded) {
    return null;
    }

    return (
        <View style={styles.header}>
            <Text style={styles.headerText}> fixfit </Text>
            {/* <MaterialIcons name='menu' size={30} style={styles.icon} /> */}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        height: '12%',
        backgroundColor: '#fff',
    },
      headerText: {
        flexDirection: "row", 
        alignItems: "center", 
        flex: 1,
        fontSize: 40,
        paddingLeft: 0,
        top: '55%',
        fontWeight: '800',
      },
      icon: {
        flexDirection: "row", 
        alignItems: "center", 
        top:'62%'
      },
});
