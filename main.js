import React, { Component } from 'react';
import Expo, { Constants } from 'expo';
import {
  createRouter,
  NavigationProvider,
  StackNavigation,
} from '@expo/ex-navigation';
import * as firebase from 'firebase';
import Tasks from './app/tasks'
import AddTask from './app/addTask'
import EditTask from './app/editTask'

console.ignoredYellowBox = [
    'Setting a timer'
]

// Initialize Firebase
const firebaseConfig = {
	apiKey: "AIzaSyClg-rAXSEPeih2Vzh7b1eytr6zTrjKnWk",
	authDomain: "react-test-78900.firebaseapp.com",
	databaseURL: "https://react-test-78900.firebaseio.com/",
	storageBucket: "react-test-78900.appspot.com"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);

export const Router = createRouter(() => ({
  	tasks: () => Tasks,
		addTask:() => AddTask,
		editTask:() => EditTask,
}));

class App extends Component {
	render() {
	    return (
	      <NavigationProvider router={Router}>
	        <StackNavigation initialRoute="tasks" />
	      </NavigationProvider>
	    );
  	}
}

Expo.registerRootComponent(App);
