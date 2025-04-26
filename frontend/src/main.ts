import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// Override console.log to suppress logs
console.log = function () {};

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
