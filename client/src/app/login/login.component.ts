import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

import { Service } from '../../service/service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[Service]
})
export class LoginComponent implements OnInit {
  model: any = {};
  title :any = 'Employee Self Service';
  userData: Object = {message:"", success:""};
  signIn = false;
  loading = false;
  userExistsMessage:String = "";

  constructor(private router: Router, private service:Service) { }

  ngOnInit() { }

  login() {
    this.loading = true;
    //this.signIn = true;
    //this.loading = false;
    
    var model = this.model;
    var router = this.router;
    var loading = this.loading;
    this.service.verifyUser(this.model).subscribe(
      result => {
        console.log(result);
        if(result.message == "User Exists") {
            sessionStorage.setItem('User_details', this.model.username);
            this.router.navigate(['home']);
            this.loading = false;
        }
        else if (result.message == "Password Mismatch") {
            this.userExistsMessage = "Password Mismatch";
            this.loading = false;
        }
        else {
            this.userExistsMessage = "User do not Exists";
            this.loading = false;
        }
       },
      (error) => {
              console.log("Error happened" + error);
              this.userExistsMessage = "Server Error";
              this.loading = false;
      });
  }

}
