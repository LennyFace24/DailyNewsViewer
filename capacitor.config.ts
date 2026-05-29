import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dailytech.app',
  appName: 'DailyTech',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#0f172a',
      showSpinner: true,
      spinnerColor: '#38bdf8'
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0f172a'
    }
  }
  // 开发时取消注释以下配置
  // server: {
  //   url: 'http://10.0.2.2:5173',
  //   cleartext: true
  // }
};

export default config;
