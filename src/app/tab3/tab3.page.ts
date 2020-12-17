import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ServicesService } from '../services.service';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  name = "";
  email = "";

  constructor(
    private navCtrl : NavController,
    private service : ServicesService,
    private router : Router
  ) {}

  ngOnInit(){
    this.service.userDetail().subscribe(res => {
      if (res !== null){
        console.log("CurrentUser:" , res.email);
        this.email = res.email;
        console.log("UserId:", this.email);
        this.getCurrUser(this.email);
      }
      else{
        this.navCtrl.navigateBack('/register');
      }
    })
  }

  logout(){
    this.service.logout().then( res => {
      console.log(res);
      this.router.navigateByUrl('/register');
    }).catch(err => {
      console.log(err);
    });
  }

  getCurrUser(email){
    let user : any = [];
    console.log(email);
    this.service.getCurrUser(email).subscribe((doc)=>{
      if(doc.exists){
        console.log(doc.data());
        user = doc.data();
        let firstName = user.firstName;
        let lastName = user.lastName;
        this.name = firstName+" "+lastName;
      }
      else {
        console.log("Document doesn't exist");
      }
    });
  }



  
  



}
