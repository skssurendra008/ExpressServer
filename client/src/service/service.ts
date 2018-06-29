import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

//import { LoginDetails } from '../app/login/login_structure';

@Injectable()
export class Service{

    //private baseUrl:String = 'http://192.168.64.254:8000/Login';
    headers: Headers;
    options: RequestOptions;
    constructor(private _http: Http, private _httpclient: HttpClient){


    }
/*
    getUser(data): Observable<LoginDetails[]> {
        var body = JSON.stringify(data);
        return this._httpclient.get<LoginDetails[]>('http://192.168.64.254:8000/Login');
    }
  */  
    verifyUser(data) {
        console.log("Inside Service");
        var info = JSON.stringify(data);
        var headers      = new Headers({'Content-Type': 'application/json'}); 
        var options      = new RequestOptions({ headers: headers });

        //var headers = new Headers();
        //headers.append('Access-Control-Allow-Origin', '*');
        console.log(info);
        

        var body = JSON.stringify(data);
        return this._http.post('http://localhost:3000/Login',info,options).map((res)=>res.json());
    
    }
    
    registerUser(data) {
        console.log("Inside Register User Service");
        var info = JSON.stringify(data);
        console.log(info);
        var headers = new Headers({'Content-Type': 'application/json'}); 
        var options = new RequestOptions({ headers: headers });
        
        return this._http.post('http://localhost:3000/registerUser',info,options).map((res)=>res.json());
    
    }
    
}

