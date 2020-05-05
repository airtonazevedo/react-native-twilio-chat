import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './routes'
import { PushConfig } from './services/push'
import AuthProvider from './contexts/authContext'
// import { Container } from './styles';

const main: React.FC = ({ children }) => {
  PushConfig();
  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar barStyle="light-content" />
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  );
}

export default main
