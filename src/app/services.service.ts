import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map,catchError } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { promise } from 'protractor';
import { resolve } from 'dns';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  ms_user;
  user;


  constructor(
    private fireStore : AngularFirestore,
    private http : HttpClient,
    private fireAuth : AngularFireAuth,
  ) { }

  register(newUser){
    return new Promise<any>((resolve,reject)=> {
      this.fireAuth.createUserWithEmailAndPassword(newUser.email, newUser.password)
          .then(
            res => resolve(res),
            err => reject (err)
          );
    });
  }

  addUser(newUser){
    const user = {
      firstName : newUser.firstName,
      lastName : newUser.lastName,
      email : newUser.email,
      password : newUser.password
    }

    this.fireStore.collection("ms_user").doc(user.email).set(user)
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
  }
  
  login(user){
    return new Promise<any>((resolve,reject)=> {
      this.fireAuth.signInWithEmailAndPassword(user.email, user.password)
          .then(
            res => resolve(res),
            err => reject (err)
          );
    });
  }

  logout(){
    return new Promise((resolve,reject)=>{
      if(this.fireAuth.currentUser){
        this.fireAuth.signOut()
        .then(()=>{
          console.log("Logged Out");
          resolve();
        }).catch((error)=>{ 
          reject(); 
        });
      }
    });
  }

  userDetail(){
    return this.fireAuth.user;
  }

  checkIn(doc_id, data){
    console.log(data);
    this.fireStore.collection("ms_loc").doc(doc_id).set(data)
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
  }

  showUsers(){
    this.fireStore.collection("ms_user").get().subscribe((snapshot)=>{
        snapshot.docs.forEach(doc => {
          console.log(doc.data());
      })
    });
  }

  showFriends(doc_id){
    return this.fireStore.collection("ms_friend").doc(doc_id).get();
  }

  getUser(){
    return this.fireStore.collection("ms_user").get();
  }

  getCurrUser(doc_id){
    console.log(doc_id);
    return this.fireStore.collection("ms_user").doc(doc_id).get();
  }

  addFriends(doc_id,data){ 
    this.fireStore.collection("ms_friend").doc(doc_id).set(Object.assign({}, data))
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
  }

  addFirstFriend(doc_id,data){
    this.fireStore.collection("ms_friend").doc(doc_id).set({friends : [data]}).
    then(function(){
      "Successfully added your first friend!";
    });
  }

  addBack(doc_id, data){
    let listOfFriends : any = [];
    this.fireStore.collection("ms_friend").doc(doc_id).get().subscribe((doc) =>{
      console.log(doc.data());
      listOfFriends = doc.data();
      if(!listOfFriends || !doc.data()){
        this.addFirstFriend(doc_id,data);
      }
      else {
        let index = listOfFriends.friends.length;
        listOfFriends.friends[index] = data;
        console.log("list:" , listOfFriends);
        this.fireStore.collection("ms_friend").doc(doc_id).set(Object.assign({}, listOfFriends)).
        then(function(){
          console.log("Successfully add friend back!");
        });
      }
    })
  }

}
