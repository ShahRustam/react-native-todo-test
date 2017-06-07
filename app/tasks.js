import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, KeyboardAvoidingView, Modal} from 'react-native';
import { List, ListItem, Icon, Button, SearchBar } from "react-native-elements";
import moment from 'moment'
import { Router, firebaseApp} from '../main';
import {styles} from './styles'

export default class Tasks extends Component {
	static route = {
	    navigationBar: {
	      title: 'Tasks',
	    }
	}
	constructor() {
		super();
		this.state = {
			dataSource: [],
			refreshing:false,
			loading:true,
			modalVisible:false,
			actionTask:"",
			searchArr:[],
		}
	}
	 immutableSplice(arr, start, deleteCount, ...items) {
	  return [ ...arr.slice(0, start), ...items, ...arr.slice(start + deleteCount) ]
	}
	loadMessages() {
		firebaseApp.database().ref('tasks/').on('value', (tasks) => {
			if(tasks.val()){
				let arr = [];
				Object.keys(tasks.val()).map(function(key,index){
					arr.push({key:key,date:tasks.val()[key].date ,status:tasks.val()[key].status,title:`${tasks.val()[key].title}`, description:`${tasks.val()[key].description}`, urgent:tasks.val()[key].urgent})
				});
				let keys = []
				this.state.dataSource.map(function(item,index){
					keys.push(item.key)
				})
				let deleteArr = keys
				this.setState({loading:false})
				arr.map(function(item,index){
					if(!keys.includes(item.key)){  // For add tasks
						let sortData = this.state.dataSource.concat([item])
						sortData.sort(function(a, b) {
									  return b.urgent - a.urgent
									})
						let itemIndex = sortData.indexOf(item)
						this.setState({
						    dataSource: this.immutableSplice(this.state.dataSource,index,0,item)
						})
					}
					else{  // For updating tasks
						let {dataSource} = this.state
						dataSource[keys.indexOf(item.key)] = item
						this.setState({dataSource})
						deleteArr.splice(deleteArr.indexOf(item.key),1)
					}
				}.bind(this))
				this.state.dataSource.map(function(item,index){   // For deleting tasks
					if(deleteArr.includes(item.key)){
						this.setState({
							dataSource:this.immutableSplice(this.state.dataSource,this.state.dataSource.indexOf(item),1)
						})
					}
				}.bind(this))
			}
			this.setState({loading:false})
		})
	}
	timeout(){
			setInterval(function(){
				this.setState({refreshing:true})
				this.setState({refreshing:false})
			}.bind(this),1000)
	}
	componentDidMount() {
		this.loadMessages();
		this.timeout();
	}
	changeTaskStatus(id, status){
		this.setState({loading:true})
		firebaseApp.database().ref('tasks/'+id).update({status:status})
		let {dataSource} = this.state;
		dataSource.map(function(item,index){
			if(item.key==id){item.status=status}
		})
		this.setState({dataSource})
		this.setState({loading:false,modalVisible:false,actionTask:""})
	}
	deleteTask(id){
		this.setState({loading:true})
		firebaseApp.database().ref('tasks/'+id).remove()
		let {dataSource} = this.state;
		dataSource.map(function(item,index){
			if(item.key==id){dataSource.splice(index,1)}
		})
		this.setState({dataSource})
		this.setState({loading:false,modalVisible:false,actionTaskId:""})
	}
	searchFilter(text){
		let search = text
		let {dataSource} = this.state
		if (search==""){
			this.setState({
				searchArr:[]
			})
		}
		else{
			let searchArr = []
			dataSource.map(function(item,index){
				if(item.title.match(search)==null){
					searchArr.push(item.key)
				}
				else
				{
					let delIndex = searchArr.indexOf(item.key)
					if(delIndex>-1){searchArr.splice(delIndex,1)}
				}
			})
			this.setState({searchArr})
		}
	}
	editTaskOpen(){
		this.props.navigator.push(Router.getRoute('editTask', {item: this.state.actionTask}))
		this.setState({modalVisible:false,actionTask:""})
	}

	helperRender=()=>{
		let marginTopList
		if(this.state.loading){
			marginTopList = 0
		}
		else{
			marginTopList=-60
		}
		let button
		if(this.state.actionTask.status==0){
				button =
			<Button
			containerViewStyle={styles.modalButtonContainer}
			backgroundColor={'darkgreen'}
			  large
			  disabled={this.state.loading}
			  onPress={()=>this.changeTaskStatus(this.state.actionTask.key, 1)}
			  icon={{name: 'done'}}
			  title='Done Task' />
		  }
		else{
				button =
			<Button
			containerViewStyle={styles.modalButtonContainer}
			backgroundColor={'darkgreen'}
			  large
			  disabled={this.state.loading}
			  onPress={()=>this.changeTaskStatus(this.state.actionTask.key, 0)}
			  icon={{name: 'undo'}}
			  title='Undone Task' />
		  }
			return [marginTopList,button]
	}
	render(){
		let [marginTopList,button] = this.helperRender()
		return (
			<List style={styles.list}>
					<SearchBar
						lightTheme
						containerStyle={styles.searchBar}
						inputStyle={styles.searchBarInput}
					  onChangeText={(text)=>this.searchFilter(text)}
					  placeholder='Search Here...'
					/>
				  <ActivityIndicator
		        animating={this.state.loading}
		        style={styles.activityIndicator}
		        size="large"
					/>
			  	<Modal
							onRequestClose={()=>this.setState({modalVisible:false,actionTaskId:""})}
			  			style={styles.flex}
	           	animationType={"fade"}
	           	transparent={true}
	           	visible={this.state.modalVisible}>
						   <View style={styles.modalView}>
							   		{button}
										<Button
											containerViewStyle={styles.modalButtonContainer}
											backgroundColor={'darkkhaki'}
										  large
										  disabled={this.state.loading}
										  onPress={()=>this.editTaskOpen()}
										  icon={{name: 'edit'}}
										  title='Edit Task'
										/>
						   			<Button
											containerViewStyle={styles.modalButtonContainer}
					 	  				backgroundColor={'darkred'}
					 	  			  large
					 	  			  disabled={this.state.loading}
					 	  			  onPress={()=>this.deleteTask(this.state.actionTask.key)}
					 	  			  icon={{name: 'delete'}}
					 	  			  title='Delete Task'
										/>

								 		<Button
									 		containerViewStyle={styles.modalButtonContainer}
									   	large
									   	disabled={this.state.loading}
									   	onPress={()=>this.setState({modalVisible:false,actionTaskId:""})}
									   	icon={{name: 'arrow-back'}}
									   	title='Return'
										/>
							   </View>
		         </Modal>
					<FlatList
						style={{marginTop:marginTopList}}
						data={this.state.dataSource}
						renderItem={
							({item}) =>	{if(this.state.searchArr.indexOf(item.key)<0){return this.renderTasks(item)}}
						}
						refreshing={this.state.refreshing}
					/>
					<Button
					  backgroundColor={'cadetblue'}
					  containerViewStyle={styles.addTaskButton}
						raised
						onPress={()=>this.props.navigator.push('addTask')}
						icon={{name: 'add-box'}}
						title='Add Task'
					/>
			</List>
		)
	}
	changeTaskStyle=(item)=>{
		let iconColor
		let icon = 'event-note'
		if (item.urgent){
			icon = 'warning'
			iconColor = 'darkorange'
		}
		let description = item.description
		let itemDateMarginTop = -15
		if(description!=""){
			itemDateMarginTop = 0
			description = "\n"+description
		}
		let date = ""
		if(description!="" && item.date<0){
			itemDateMarginTop = -15
		}
		let dateColor = '#86939e'
		if (item.date>-1){
			let dateD = moment(item.date*1000)
			date = "Due: "+dateD.format("HH:mm DD.MM.YYYY")
			if (dateD.diff(moment())<0){
				dateColor = 'darkred'
				icon = 'alarm-off'
				iconColor = 'darkred'
			}
		}
		let textDecoration = "none"
		if (item.status==1){
			textDecoration = 'line-through'
			icon = 'done-all'
			iconColor = 'green'
		}
		return [textDecoration,description,dateColor,itemDateMarginTop,date,icon,iconColor]
	}
	renderTasks(item){
		let [textDecoration,description,dateColor,itemDateMarginTop,date,icon,iconColor] = this.changeTaskStyle(item)
		return(
				<ListItem
						key={item.key}
	          roundAvatar
	          title={item.title}
						titleStyle = {{textDecorationLine:textDecoration}}
						subtitleStyle= {{textDecorationLine:textDecoration}}
						onPress={()=>this.setState({modalVisible:true,actionTask:item})}
	          subtitle={
									<View>
									<Text style={styles.listItemDescription}>{description}</Text>
									<Text style={[styles.listItemDue,{color:dateColor,marginTop:itemDateMarginTop}]}>{date}</Text>
									</View>
								}
	          leftIcon={{name: icon,color:iconColor}}
	      />
		  )
		}
}
