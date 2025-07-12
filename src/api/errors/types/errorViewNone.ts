import { ErrorViewInterface } from "../errorView";

export class ErrorViewNone implements ErrorViewInterface {
  message = '';
  showError() { return }
  hideError(): void { return }
}
