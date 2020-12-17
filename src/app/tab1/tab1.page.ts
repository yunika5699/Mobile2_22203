import { Component, Input, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  index;
  public show:boolean = true;
  uid;
  test : any [];
  users : any = [];
  friends : any = [];

  constructor(
    private toastController : ToastController,
    private navCtrl : NavController,
    private service : ServicesService ) { }
  
  ionViewDidEnter(){
    this.users = [];
    this.showAllUser();
  }

  ngOnInit(){
    this.service.userDetail().subscribe(res => {
      if (res !== null){
        console.log("CurrentUser:" , res.email);
        this.uid = res.email;
        console.log("UserId:", this.uid);
      }
      else{
        this.navCtrl.navigateBack('/register');
      }
    })
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

  showAllUser(){
    this.users = [];
    this.service.getUser().subscribe((snapshot)=>{
      snapshot.docs.forEach(doc => {
        console.log(doc.data());
        this.addUser(doc.data());
      })
    });
  }

  addUser(user : any){
    if(user.email !== this.uid){
      this.users.push({
        firstName : user.firstName,
        lastName : user.lastName,
        email : user.email,
      })
    }
  }

  addFriend(data,i){
    console.log(i);
    this.service.showFriends(this.uid).subscribe((doc) =>{
      if(doc.data()){
        this.friends = doc.data();
        this.index = this.friends.friends.length;
        this.addToDb(data);
      }
      else if(!doc.data())
      {
        this.friends= data;
        this.service.addFirstFriend(this.uid,this.friends);
        this.service.addBack(data,this.uid);
        this.presentToast('Success!','Friend has been successfully added','primary');
      }
    });
  }

  addToDb(data){
    console.log(this.friends);
    let bool = [];
    let check = 0;
    //looping buat lihat dulu dia sudah jadi teman atau belum
    for(let i=0; i<this.index;i++){
      console.log(this.friends.friends[i]);
      if(this.friends.friends[i] === data){
        bool[i] = 1;
      }
      else if (this.friends.friends[i] !== data){
        bool[i] = 0
      }
    }

    for(let i=0; i<bool.length;i++){
      check+=bool[i];
    }

    //kalau check === 0 berarti dia belum jadi temen
    if(check === 0){
      this.friends.friends[this.index] = data;
      this.service.addFriends(this.uid,this.friends);
      this.service.addBack(data, this.uid);
      this.presentToast('Success!','Friend has been successfully added','primary');
    }
    else if(check === 1){
      this.presentToast('Warning!','This friend has been on your list','danger');
    }
    console.log(check);
  }

  async presentToast(header:any, message : any, color:any) {
    const toast = await this.toastController.create({
      header: header,
      message: message,
      color : color,
      position: 'bottom',
      duration: 1500
    });
    toast.present();
  }

  showFriends(){
    this.users=[];
    this.service.showFriends(this.uid).subscribe((doc) =>{
      console.log(doc.data());
    });
  }


  

}
