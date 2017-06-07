import React, { Component } from 'react';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    list:{
      flex:1,
      marginTop:0
    },
    searchBar:{
      backgroundColor:'cadetblue',
      borderTopWidth:0,
      borderBottomWidth:0
    },
    searchBarInput:{
      color:"black"
    },
    activityIndicator:{
      alignItems: 'center',
      justifyContent: 'center',
      height:60
    },
    flex:{
      flex:1
    },
    modalView:{
        flex:1,
        justifyContent:'flex-end',
        backgroundColor:"rgba(0, 0, 0, 0.7)"
    },
    modalButtonContainer:{
      marginBottom:20
    },
    addTaskButton:{
        marginLeft:-20,
        marginRight:-20
    },
    listItemDescription:{
        marginBottom:10,
        color:"#86939e",
        fontSize:11,
        fontWeight:"600"
    },
    listItemDue:{
        fontSize:11,
        fontWeight:'600'
    },
    requiredText:{
        color:'red'
    },
    formInput:{
        color:'black',
        paddingRight:40
    },
    formMultiline:{
        height:100,
    },
    datepickerView:{
        alignItems:'center',
        flex:1,
        flexDirection:'row'
    },
    datepicker:{
        alignItems:'center',
        flex:1
    },
    datepickerIcon:{
        display:'none'
    },
    datepickerInput:{
        borderWidth:0,
        borderBottomWidth:1,
        borderBottomColor:"#bdc6cf",
        marginLeft: 20,
        marginRight:20,
    },
    checkbox:{
        borderWidth:0,
        backgroundColor:'transparent',
        margin:20
    },




})
