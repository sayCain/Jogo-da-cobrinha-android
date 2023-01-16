import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';

import { LottieModule } from 'ngx-lottie';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';

export function playerFactory() {
  return import(/* webpackChunkName: 'lottie-web' */ 'lottie-web');
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    LottieModule.forRoot({ player: playerFactory })
  ],
  providers: [
    Vibration
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
