import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dailytech.app',
  appName: 'DailyTech',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#0f0f0f',
      showSpinner: false
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0f0f0f'
    }
  },
  android: {
    // 允许全屏显示，覆盖导航栏
    allowMixedContent: true,
    backgroundColor: '#0f0f0f'
  }
};

export default config;
