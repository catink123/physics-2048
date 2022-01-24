import { Routes } from "@angular/router";
import { HighscoresComponent } from "./screens/highscores/highscores.component";
import { MainMenuComponent } from "./screens/main-menu/main-menu.component";
import { RulesComponent } from "./screens/rules/rules.component";
import { SettingsComponent } from "./screens/settings/settings.component";

export const routes: Routes = [
    {
        path: '',
        component: MainMenuComponent,
        data: {
            animation: 'Main'
        }
    },
    {
        path: 'settings',
        component: SettingsComponent
    },
    {
        path: 'rules',
        component: RulesComponent
    },
    {
        path: 'highscores',
        component: HighscoresComponent
    }
]