import { alertController } from '@ionic/vue';
import { ErrorViewInterface } from '../errorView';

export class ErrorViewAlert implements ErrorViewInterface {
  message: string;
  alert: HTMLIonAlertElement | null = null;
  constructor(message: string) {
    this.message = message;
  }

  async showError() {
    this.alert = await alertController.create({
      header: 'Error',
      message: this.message,
      buttons: ['Ok']
    });
    
    this.alert.present().then(() => {
      this.alert = null;
    });
  }

  hideError(): void {
    if (this.alert === null) return;
    this.alert.dismiss();
  }
}
