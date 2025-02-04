import * as React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

const StatusBar = () => {
  return (
    <View style={styles.statusBarContainer}>
      <View style={styles.timeContainer}>
        <View style={styles.timeWrapper}>
          <Text>9:41</Text>
        </View>
      </View>
      <View style={styles.centerContainer}>
        <View style={styles.iconContainer}>
          <View style={styles.leftIcon} />
          <View style={styles.rightIcon} />
        </View>
      </View>
      <View style={styles.rightContainer}>
        <View style={styles.statusIcons}>
          <Image
            resizeMode="contain"
            source={{
              uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/23d604f4a31459d9e0dc042b746a5d20ca153344da2868946534b27b00bf9955?placeholderIfAbsent=true&apiKey=05d51551a0a449bfbfb4553858ddc3fd',
            }}
            style={styles.statusIcon}
          />
          <Image
            resizeMode="contain"
            source={{
              uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/fe7a5fe579a2a9a4f5b5585b1472eb327a40780d009b14200fe493ebf30c0ffe?placeholderIfAbsent=true&apiKey=05d51551a0a449bfbfb4553858ddc3fd',
            }}
            style={styles.statusIcon}
          />
          <Image
            resizeMode="contain"
            source={{
              uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/30abb1ae634bfb62a6c5baa8896e4aa81077515577097b0b570950c0307fb4ee?placeholderIfAbsent=true&apiKey=05d51551a0a449bfbfb4553858ddc3fd',
            }}
            style={styles.wideStatusIcon}
          />
        </View>
      </View>
    </View>
  );
};

export default StatusBar;

const styles = StyleSheet.create({
    statusBarContainer: {
      alignSelf: "stretch",
      display: "flex",
      minHeight: 59,
      width: "100%",
      alignItems: "stretch",
      justifyContent: "center",
    },
    timeContainer: {
      display: "flex",
      paddingLeft: 10,
      paddingBottom: 3,
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "SF Pro Text, sans-serif",
      fontSize: 16,
      color: "#121212",
      fontWeight: "600",
      textAlign: "center",
      letterSpacing: -0.32,
      lineHeight: "1",
      justifyContent: "center",
      flex: 1,
      flexShrink: 1,
      flexBasis: "0%",
    },
    timeWrapper: {
      borderRadius: 24,
      width: 54,
      paddingLeft: 12,
      paddingRight: 12,
      paddingTop: 1,
      paddingBottom: 8,
    },
    centerContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: 125,
    },
    iconContainer: {
      justifyContent: "center",
      alignItems: "stretch",
      borderRadius: 100,
      display: "flex",
      maxWidth: "100%",
      width: 125,
      gap: 8,
    },
    leftIcon: {
      borderRadius: 100,
      display: "flex",
      width: 80,
      flexShrink: 0,
      height: 37,
    },
    rightIcon: {
      borderRadius: 100,
      display: "flex",
      width: 37,
      flexShrink: 0,
      height: 37,
    },
    rightContainer: {
      display: "flex",
      paddingRight: 11,
      alignItems: "center",
      gap: 8,
      justifyContent: "center",
      height: "100%",
      flex: 1,
      flexShrink: 1,
      flexBasis: "0%",
    },
    statusIcons: {
      alignSelf: "stretch",
      display: "flex",
      marginTop: "auto",
      marginBottom: "auto",
      gap: 8,
    },
    statusIcon: {
      position: "relative",
      display: "flex",
      width: 17,
      flexShrink: 0,
      aspectRatio: 1.42,
    },
    wideStatusIcon: {
      position: "relative",
      display: "flex",
      width: 28,
      flexShrink: 0,
      aspectRatio: 2.16,
    },
  });
