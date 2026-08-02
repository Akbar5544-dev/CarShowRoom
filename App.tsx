import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import FlashMessage from 'react-native-flash-message';
import {RootNavigator} from './src/navigation';
import {persistor, store} from './src/store';
import {AppThemeProvider, useAppTheme} from './src/theme';

function AppShell() {
  const {colors, isDark} = useAppTheme();

  return (
    <SafeAreaProvider>
      <StatusBar
        animated
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
        translucent={false}
      />
      <RootNavigator />
      <FlashMessage position="top" />
    </SafeAreaProvider>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppThemeProvider>
            <AppShell />
          </AppThemeProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
