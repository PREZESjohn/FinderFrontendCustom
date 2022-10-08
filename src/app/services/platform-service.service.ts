import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlatformServiceService {

  baseUrl = 'http://localhost:8080/api/v1/platform';

  constructor(private http: HttpClient) { }


  getUserDCData(token, tokenType) {
    return this.http.get(this.baseUrl+"/connectDC?accessToken="+token+"&tokenType="+tokenType,
      {headers:{
          authorization: tokenType +' '+token,
        }}
    )
  }
}
