<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet, isPlatform } from '@ionic/vue';
import { StatusBar, Style } from '@capacitor/status-bar';
import { NavigationBar } from '@capgo/capacitor-navigation-bar';
import { Capacitor } from '@capacitor/core';

const isNativePlatform = Capacitor.isNativePlatform();
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

if (isNativePlatform) {
  prefersDark.addEventListener('change', (mediaQuery) => initializeDarkPalette(mediaQuery.matches));
  initializeDarkPalette(prefersDark.matches);
}

function initializeDarkPalette(isDark: boolean) {
  console.log('Dark mode is', isDark);
  const statusBarStyle = isDark ? Style.Dark : Style.Light;
  // Change statusbar text color
  StatusBar.setStyle({ style: statusBarStyle });

  // Android specific options
  if (!isPlatform('android')) return;
  let statusBarColor = getComputedStyle(document.documentElement).getPropertyValue('--statusbar-background').trim();
  let navigationBarColor = getComputedStyle(document.documentElement).getPropertyValue('--navigationbar-background').trim();

  if (statusBarColor.length === 4) {
    statusBarColor = '#' + statusBarColor[1] + statusBarColor[1] + statusBarColor[2] + statusBarColor[2] + statusBarColor[3] + statusBarColor[3];
  }
  if (navigationBarColor.length === 4) {
    navigationBarColor = '#' + navigationBarColor[1] + navigationBarColor[1] + navigationBarColor[2] + navigationBarColor[2] + navigationBarColor[3] + navigationBarColor[3];
  }
  StatusBar.setBackgroundColor({ color: statusBarColor });
  NavigationBar.setNavigationBarColor({ color: navigationBarColor });
}
</script>
