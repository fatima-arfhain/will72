import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Alert,
} from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";

export default class TransactionScreen extends Component {
  constructor() {
    super();
    this.state = {
      hasCameraPermissions: null,
      scanned: false,
      scannedData: "",
      buttonState: "normal",
      scannedstudentId: "",
      scannedbookId: "",
      tMessage : "",
    };
  }

  getCameraPermissions = async (id) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermissions: status === "granted",
      buttonState: id,
      scanned: false,
    });
  };

  handleBarCodeScanned = async ({ type, data }) => {
    const { buttonState } = this.state;
    if (buttonState == "BookId") {
      this.setState({
        scanned: true,
        scannedbookId: data,
        buttonState: "normal",
      });
    } else if (buttonState == "StudentId") {
      this.setState({
        scanned: true,
        scannedstudentId: data,
        buttonState: "normal",
      });
    }
  };
  handleTransaction=async()=>{
    var transactionMessage = null;
    db.collection("books").doc(this.state.scannedbookId).get()
    .then((doc)=>{
      console.log(doc.data())
      var book = doc.data()
      if(book.bookAvailabilty){
        this.initiateBookIssue();
        transactionMessage = "Book Issued"
            }
            else{
              this.initiateBookReturn()
              transactionMessage = "Book return"
            }
    })
    this.setState({
      tMessage : transactionMessage
    })
    
  }

  initiateBookIssue= async ()=>{
    db.collection("transactions").add({
      'studentId' : this.state.scannedstudentId,
      'bookId' : this.state.scannedbookId,
       'date' : firebase.firestore.Timestamp.now().toDate(),
       'transactionType' : "Issue"

    })
    db.collection("books").doc(this.state.scannedbookId).update({
      'bookAvailability' : false,
    })
    db.collection("students").doc(this.state.scannedstudentId).update({
      'numberOfBooksIssued' : firesbase.firestore.FieldValue.increment(1)
    })
    Alert.alert("Book Issued")
  }

  initiateBookReturn= async ()=>{
    db.collection("transactions").add({
      'studentId' : this.state.scannedstudentId,
      'bookId' : this.state.scannedbookId,
       'date' : firebase.firestore.Timestamp.now().toDate(),
       'transactionType' : "Return"

    })
    db.collection("books").doc(this.state.scannedbookId).update({
      'bookAvailability' : true,
    })
    db.collection("students").doc(this.state.scannedstudentId).update({
      'numberOfBooksIssued' : firesbase.firestore.FieldValue.increment(-1)
    })
    Alert.alert("Book Returned")
  }
 

  render() {
    const hasCameraPermissions = this.state.hasCameraPermissions;
    const scanned = this.state.scanned;
    const buttonState = this.state.buttonState;

    if (buttonState !== "normal" && hasCameraPermissions) {
      return (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
        />
      );
    } else if (buttonState === "normal") {
      return (
        <View style={styles.container}>
         
         <Image style={{height:200,width:200}} source={require("../assets/booklogo.jpg")} />
        
          <View style={styles.inputView}>
            <TextInput style={styles.inputBox}
             placeholder ="bookId" 
             value = {this.state.scannedbookId}
             onChangeText = {(text) => {
              this.setState({
                scannedbookId: text
              })
             }}/>

            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => {
                this.getCameraPermissions("BookId");
              }}
            >
              <Text style={styles.buttonText}>scan</Text>
            </TouchableOpacity>
          </View>

          
            <View style={styles.inputView}>
              <TextInput style={styles.inputBox}
               placeholder="studentId" 
               value = {this.state.scannedstudentId}
               onChangeText = {(text) => {
                this.setState({
                scannedstudentId: text
                })
               }} />

              <TouchableOpacity
                style={styles.scanButton}
                onPress={() => {
                  this.getCameraPermissions("StudentId");
                }}
              >
                <Text style={styles.buttonText}>scan</Text>
              </TouchableOpacity>
          </View>
          <TouchableOpacity style ={styles.submitB} onPress ={()=>this.handleTransaction()}>
              <Text style ={styles.submitBtext}> Submit</Text>
            </TouchableOpacity>
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  displayText: {
    fontSize: 15,
    textDecorationLine: "underline",
  },
  scanButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    margin: 10,
  },
  buttonText: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 10,
  },
  inputView: {
    flexDirection: "row",
    margin: 20,
  },
  inputBox: {
    width: 200,
    height: 40,
    borderWidth: 1.5,
    borderRightWidth: 0,
    fontSize: 20,
  },
  scanButton: {
    backgroundColor: "#66BB6A",
    width: 50,
    borderWidth: 1.5,
    borderLeftWidth: 0,
  },
  submitB:{
    backgroundColor: '#FBC02D',
    width: 100,
    height:50
  },
  submitBtext:{
    padding: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight:"bold",
    color: 'white'
  }
});
