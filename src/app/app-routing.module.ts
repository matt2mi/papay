import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {WaitingPlayersComponent} from './components/waiting-players/waiting-players.component';
import {PlayingComponent} from './components/playing/playing.component';
import {ScoresComponent} from './components/scores/scores.component';
import {NoonGameComponent} from './noon-game/noon-game.component';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'waiting', component: WaitingPlayersComponent},
  {path: 'playing', component: PlayingComponent},
  {path: 'scores', component: ScoresComponent},
  {path: 'game', component: NoonGameComponent},
  {path: '**', redirectTo: '/login', pathMatch: 'full'},
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash : true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
