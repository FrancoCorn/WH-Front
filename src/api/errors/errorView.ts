import { ErrorViewAlert } from "./types/errorViewAlert";
import { ErrorViewNone } from "./types/errorViewNone";
import { ErrorViewToast } from "./types/errorViewToast";

export enum ErrorViewType {
    'Toast',
    'Alert',
    'None'
}

export interface ErrorViewInterface {
    message: string;
    showError(message: string): void;
    hideError(): void;
}


export class ErrorView extends Error {
    private errorView: ErrorViewInterface;
    constructor(errorViewType: ErrorViewType, message: string) {
        super();
        let errorView: ErrorViewInterface;
        switch (errorViewType) {
            case ErrorViewType.Toast:
                errorView = new ErrorViewToast(message);
                break;
            case ErrorViewType.Alert:
                errorView = new ErrorViewAlert(message);
                break;
            case ErrorViewType.None:
                errorView = new ErrorViewNone();
                break;
            default:
                throw new Error('ErrorViewType not supported');
        }
        this.errorView = errorView;
    }

    showError() {
        this.errorView.showError(this.message);
    }
    hideError() {
        this.errorView.hideError();
    }
}
