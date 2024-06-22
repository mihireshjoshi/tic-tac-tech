import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, Text, View, StatusBar } from 'react-native';
import RupeeGenieLogo from '../assets/rupee_genie_logo.png'; // Add your new logo image here
// import BgCurve from '../assets/bg_curve.png'; // Add your background curve image here
// import Home from './Home'; // Ensure you have the correct path
import Login from './Login';

export default function SplashScreen({ navigation }) {
    const windowHeight = Dimensions.get('window').height;
    const statusBarHeight = StatusBar.currentHeight || 0;
    const slideOutOpening = useRef(new Animated.Value(0)).current; // Controls the slide out of splash screen
    const slideInHome = useRef(new Animated.Value(windowHeight)).current; // Initial state is off the screen
    const logoOpacity = useRef(new Animated.Value(0)).current; // Logo opacity animation
    const textOpacity = useRef(new Animated.Value(0)).current; // Text opacity animation

    useEffect(() => {
        const startLogoAnimation = () => {
            Animated.sequence([
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true
                }),
                Animated.timing(textOpacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true
                })
            ]).start(() => {
                setTimeout(startTransition, 2000); // Delay before starting transition
            });
        };

        const startTransition = () => {
            Animated.parallel([
                Animated.timing(slideOutOpening, {
                    toValue: -windowHeight,
                    useNativeDriver: true,
                    duration: 800
                }),
                Animated.timing(slideInHome, {
                    toValue: 0,
                    useNativeDriver: true,
                    duration: 800
                })
            ]).start();
        };

        startLogoAnimation();
    }, []);

    return (
        <>
            <Animated.View style={{
                position: 'absolute',
                top: -statusBarHeight, // Adjust for status bar height
                left: 0,
                right: 0,
                bottom: 0,
                transform: [{ translateY: slideOutOpening }],
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#002e4f', // Background color as in your design
                height: windowHeight + statusBarHeight // Extend the height to cover full screen
            }}>
                {/* <Image source={BgCurve} style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    resizeMode: 'cover',
                    zIndex: 1
                }} /> */}
                <Animated.Image source={RupeeGenieLogo} style={{
                    width: 232,
                    height: 70,
                    marginVertical: 20,
                    zIndex: 2,
                    opacity: logoOpacity
                }} />
                {/* <Animated.Text style={{
                    color: 'white',
                    fontSize: 36,
                    fontWeight: 'bold',
                    marginTop: 20,
                    zIndex: 3,
                    opacity: textOpacity
                }}>Rupee Genie</Animated.Text> */}
            </Animated.View>

            <Animated.View style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                transform: [{ translateY: slideInHome }],
                zIndex: -1, // Ensure it stays below until needed
            }}>
                <Login />
            </Animated.View>
        </>
    );
}
