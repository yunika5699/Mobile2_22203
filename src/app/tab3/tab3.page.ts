import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { ServicesService } from '../services.service';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraResultType, CameraSource, Capacitor} from '@capacitor/core';



@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  @ViewChild('filePicker', {static:false})
  filePickerRef : ElementRef<HTMLInputElement>;
  isDesktop : boolean;
  name = "";
  email = "";
  imgPreview = "https://muchfeed.com/wp-content/uploads/2019/12/Mark-Tuan-3.jpg";
  avatar; 

  constructor(
    private platform : Platform,
    private sanitizer : DomSanitizer,
    private base64: Base64,
    private imagePicker: ImagePicker,
    private navCtrl : NavController,
    private service : ServicesService,
    private router : Router
  ) {}

  ngOnInit(){
    if((this.platform.is('mobile') && this.platform.is("hybrid")) ||
    this.platform.is('desktop')){
      this.isDesktop = true;
    }

    this.service.userDetail().subscribe(res => {
      if (res !== null){
        console.log("CurrentUser:" , res.email);
        this.email = res.email;
        console.log("UserId:", this.email);
        this.getCurrUser(this.email);
        this.service.getProfilePic(this.email).subscribe((doc)=>{
          let pic : any = [];
          pic = doc.data();
          if(doc.data()){
            this.imgPreview = "data:image/jpeg;base64,"+ pic.pic;
          }
        })
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

  getPhoto() {
    let options = {
      maximumImagesCount: 1
    };
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
          this.imgPreview = results[i];
          this.base64.encodeFile(results[i]).then((base64File: string) => {
            this.avatar = base64File;
          }, (err) => {
            console.log(err);
          });
      }
    }, (err) => { });
  }

  async getPicture(type : string){
    if(!Capacitor.isPluginAvailable('Camera') || (this.isDesktop && type === 'gallery')){
      this.filePickerRef.nativeElement.click();
      return;
    }

    const image = await Camera.getPhoto({
      quality : 100,
      width : 160,
      height : 160,
      allowEditing : false,
      resultType : CameraResultType.Base64,
      source : CameraSource.Prompt
    });

    console.log(image.base64String);

    this.service.uploadPic(this.email,image.base64String);
    this.imgPreview = "data:image/jpeg;base64,"+image.base64String;


  }



  
  



}
