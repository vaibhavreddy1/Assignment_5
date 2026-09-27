import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";

import PoliciesList from "./screens/PoliciesList";
import PolicyDetail from "./screens/PolicyDetail";
import ClaimForm from "./screens/ClaimForm";
import HospitalBill from "./screens/HospitalBill";
import BranchMap from "./screens/BranchMap";
import Settings from "./screens/Settings";

const PoliciesStack = createNativeStackNavigator();
const ClaimStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function PoliciesStackScreen() {
  return (
    <PoliciesStack.Navigator>
      <PoliciesStack.Screen
        name="PoliciesList"
        component={PoliciesList}
        options={{ title: "HDFC Life Advisor" }}
      />
      <PoliciesStack.Screen
        name="PolicyDetail"
        component={PolicyDetail}
        options={{ title: "Policy Detail" }}
      />
    </PoliciesStack.Navigator>
  );
}

function ClaimStackScreen() {
  return (
    <ClaimStack.Navigator>
      <ClaimStack.Screen
        name="ClaimForm"
        component={ClaimForm}
        options={{ title: "File a Claim" }}
      />
      <ClaimStack.Screen
        name="HospitalBill"
        component={HospitalBill}
        options={{ title: "Hospital Bill" }}
      />
    </ClaimStack.Navigator>
  );
}

const linking = {
  prefixes: ["hdfclife://"],
  config: {
    screens: {
      Policies: {
        screens: {
          PoliciesList: "policies",
          PolicyDetail: "policy/:policyNo",
        },
      },
      Claim: {
        screens: {
          ClaimForm: "claim",
          HospitalBill: "claim/bill",
        },
      },
      Map: "map",
      Settings: "settings",
    },
  },
};

export default function App() {
  useEffect(() => {
    Notifications.requestPermissionsAsync().catch(() => {});
  }, []);

  return (
    <NavigationContainer linking={linking}>
      <StatusBar style="auto" />
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Policies" component={PoliciesStackScreen} />
        <Tab.Screen name="Claim" component={ClaimStackScreen} />
        <Tab.Screen name="Map" component={BranchMap} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
