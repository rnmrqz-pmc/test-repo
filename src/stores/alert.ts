
// ===============================
// Alert Store (Pinia)
// ===============================
// Purpose: This store manages global alert notifications within the application.
// ===============================


import { defineStore } from "pinia";

export type AlertType = "success" | "error" | "warning" | "info";

export interface AlertState {
    show: boolean;
    type: AlertType;
    title?: string;
    message: string;
    close?: boolean
}

export const useAlertStore = defineStore("alert", {
  state: (): AlertState => ({
    show: false,
    type: "info",
    title: "",
    message: "",
    close: false
  }),
  actions: {
    showAlert(type: AlertType, title: string, message: string, close?: boolean) {
        this.type = type;
        this.title = title
        this.message = message;
        this.close = close
        this.show = true;

        setTimeout(() => {
            this.show = false
        }, 3000);
    },
    hideAlert() {
      this.show = false;
    },
  },
});
