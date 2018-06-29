import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { Service } from '../../service/service';
import { AlertService } from '../../service/alert.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers:[Service, AlertService]
})
export class SignupComponent implements OnInit {

  model: any = {};
  loading = false;
  constructor(private router : Router, private service: Service, private alertService: AlertService) { }

  ngOnInit() {
  }

  register() {
    this.loading = true;
    console.log(this.model);
    this.service.registerUser(this.model).subscribe(
            data => {
                //this.alertService.success('Registration successful', true);
                this.loading = false;
                this.router.navigate(['login']);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
  }
}
