import { toastController } from '@ionic/vue';
import { ErrorViewInterface } from '../errorView';

export class ErrorViewToast implements ErrorViewInterface {

  message: string;
  constructor(message: string) {
    this.message = message;
  }

  async showError() {
    const toast = await toastController.create({
      message: this.message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
  hideError(): void { return }
}
