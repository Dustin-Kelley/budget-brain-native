import { StepIndicator } from '@/components/StepIndicator';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, View } from 'react-native';

const logoDarkSource = require('../../assets/images/logo-dark.png');

export default function WelcomeScreen() {
  const { currentUser } = useCurrentUser();
  const opacity = useRef(new Animated.Value(1)).current;
  const firstName = currentUser?.first_name;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  async function handleGetStarted() {
    await AsyncStorage.setItem('budget-brain-onboarding-completed', 'true');
    router.replace('/(app)');
  }

  return (
    <View className="flex-1 bg-background justify-between px-6 pb-12 pt-20">
      <View className="flex-1 items-center justify-center gap-6">
        <StepIndicator currentStep={3} totalSteps={3} />
        <Animated.View style={{ opacity }}>
          <Image
            source={logoDarkSource}
            style={{ width: 80, height: 80 }}
            resizeMode="contain"
          />
        </Animated.View>
        <View className="gap-2">
          <Text className="text-center text-2xl font-bold">
            {firstName ? `Welcome, ${firstName}!` : 'Welcome!'}
          </Text>
          <Text className="text-center text-muted-foreground">
            You're all set to start managing your budget
          </Text>
        </View>
      </View>
      <Button onPress={handleGetStarted}>
        <Text>Get Started</Text>
      </Button>
    </View>
  );
}
