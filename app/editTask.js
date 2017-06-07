import React, { Component } from 'react';
import { Text, View, ScrollView, ActivityIndicator, KeyboardAvoidingView} from 'react-native';
import { Button, FormLabel, FormInput,FormValidationMessage, CheckBox } from "react-native-elements";
import DatePicker from 'react-native-datepicker'
import moment from 'moment'
import { Router, firebaseApp} from '../main';
import {styles} from './styles'

export default class EditTask extends Component {
	static route = {
	    navigationBar: {
				title: 'Edit Task',
	  }
	}
	constructor() {
		super();
		this.state = {
			checked:false,
			date: "",
			error:{},
			title:"",
			descr:"",
			loading:false,
			key:"",
		}
	}
	check(){
		if(this.state.checked)
			this.setState({checked:false})
		else
			this.setState({checked:true})
	}
	editTask(){
		this.setState({loading:true})
		let {title, descr, date, checked} = this.state
		date = moment(date, "HH:mm DD.MM.YYYY").unix()
		if (!date){date=-1}
		if (title=="" || title.trim()==""){
			this.setState({error:{title:"Title is required"},loading:false})
		}
		else{
			this.setState({error:{},loading:false})
			firebaseApp.database().ref('tasks/'+this.state.key).update({title:title.trim(),status:0,description:descr.trim(),date:date,urgent:checked})
			this.props.navigator.pop();
		}
	}
	componentDidMount(){
		this.setState({
			checked:this.props.route.params.item.urgent,
			date: moment(this.props.route.params.item.date*1000).format("HH:mm DD.MM.YYYY"),
			title:this.props.route.params.item.title,
			descr:this.props.route.params.item.description,
			key:this.props.route.params.item.key,
		})
	}
	render() {
	    return (
					<KeyboardAvoidingView style={styles.flex} behavior={'padding'} >
							<ScrollView>
									<FormLabel>Title:<Text style={styles.requiredText}>*</Text></FormLabel>
									<FormInput
											disabled = {this.state.loading}
											ref='FormInput'
											textInputRef='title'
											inputStyle={styles.formInput}
											onChangeText={(title) => this.setState({title:title,error:{}})}
					         		value={this.state.title}
									/>
									<FormValidationMessage>{this.state.error.title}</FormValidationMessage>
									<FormLabel>Description:</FormLabel>
									<FormInput
											disabled = {this.state.loading}
											ref='FormInput'
											textInputRef='description'
											multiline={true}
											inputStyle={[styles.formInput,styles.formMultiline]}
											onChangeText={(descr) => this.setState({descr})}
					         		value={this.state.descr}
									/>
									<FormLabel>Due date:</FormLabel>
									<View style={styles.datepickerView}>
											<DatePicker
													disabled = {this.state.loading}
													style={styles.datepicker}
									        date={this.state.date}
													minDate={new Date()}
									        mode="datetime"
									        placeholder="select date"
									        format="HH:mm DD.MM.YYYY"
									        confirmBtnText="Confirm"
									        cancelBtnText="Cancel"
													onDateText={(date) => this.setState({date})}
									        customStyles={{
										          dateIcon: styles.datepickerIcon,
												  		dateInput: styles.datepickerInput
										     	}}
									        onDateChange={(date) => {this.setState({date: date})}}
								      />
							  </View>
							  <CheckBox
					  				center
										disabled = {this.state.loading}
					  			  title='Urgent'
					  			  checkedIcon='dot-circle-o'
					  			  uncheckedIcon='circle-o'
					  			  checked={this.state.checked}
					  			  onPress={()=>this.check()}
					  			  containerStyle={styles.checkbox}
				  			/>
								<Button
										disabled = {this.state.loading}
										backgroundColor={'cadetblue'}
									  raised
									  onPress={()=>this.editTask()}
									  title='Add'
								/>
							  <ActivityIndicator
			  		        animating={this.state.loading}
			  		        style={styles.activityIndicator}
			  		        size="large"
		  		      />
					  </ScrollView>
			  </KeyboardAvoidingView>

	    )
  	}
}
