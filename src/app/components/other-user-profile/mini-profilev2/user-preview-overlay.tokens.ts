import {Injectable, InjectionToken} from '@angular/core';
import {User} from "../../../domain/User";



export const USER_PREVIEW_DIALOG_DATA=new InjectionToken<User>('USER_PREVIEW_DIALOG_DATA');
