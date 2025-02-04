import {StyleSheet, Text, View, ImageBackground} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const MainLayout = ({children}) => {
  return (
    <LinearGradient
      colors={['#F7F3EC', '#F7F3EB', '#F7F3EE']}
      style={{flex: 1, justifyContent: 'center'}}>
      <ImageBackground
        source={require('../../assets/image/bg/bg.jpg')}
        style={{flex: 1}}>
        {children}
      </ImageBackground>
    </LinearGradient>
  );
};

export default MainLayout;

const styles = StyleSheet.create({});
