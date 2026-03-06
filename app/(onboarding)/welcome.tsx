
import { OnboardingBackground } from '@/components/OnboardingBackground';
import { StepIndicator } from '@/components/StepIndicator';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import Ionicons from '@expo/vector-icons/Ionicons';
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

  function handleGetStarted() {
    router.replace('/(app)');
  }

  return (
    <OnboardingBackground>
      <View className="flex-1 justify-between px-6 pb-12 pt-20">
        <Button onPress={() => router.back()} variant="outline" size="icon">
          <Ionicons name="arrow-back" size={24} className="text-foreground" />
        </Button>
        <View className="flex-1 items-center justify-center gap-6">
          <StepIndicator currentStep={3} totalSteps={3} />
          <Animated.View style={{ opacity }}>
            <Image
              source={logoDarkSource}
              style={{ width: 80, height: 80 }}
              resizeMode="contain"
            />
          </Animated.View>
          <View className="items-center gap-2">
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
    </OnboardingBackground>
  );
}
