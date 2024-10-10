import { createStackNavigator } from "@react-navigation/stack";
import { GenderScreen } from "../screens/demographics/GenderScreen";
import { SexScreen } from "../screens/demographics/SexScreen";
import { SexualOrientation } from "../screens/demographics/SexualOrientationScreen";
import { RaceScreen } from "../screens/demographics/RaceScreen";
import { ReligionScreen } from "../screens/demographics/ReligionScreen";
import { LanguageScreen } from "../screens/demographics/LanguageScreen";
import { RelationshipScreen } from "../screens/demographics/RelationshipScreen";
import { CategoriesScreen } from "../screens/demographics/CategoriesScreen";
import { AvatarScreen } from "../screens/demographics/AvatarScreen";
import { HobbiesScreen } from "../screens/demographics/HobbiesScreen";
import { OnboardingScreen } from "../screens/demographics/OnboardingScreen";
import { AgeScreen } from "../screens/demographics/AgeScreen";
import { SemesterScreen } from "../screens/demographics/SemesterScreen";
import { StudentStatus } from "../screens/demographics/StudentStatus";
import { EmploymentStatusScreen } from "../screens/demographics/EmploymentStatus";
import { HousingStatusScreen } from "../screens/demographics/HousingStatusScreen";
import { MajorSchoolScreen } from "../screens/demographics/MajorSchoolScreen";
import { MajorScreen } from "../screens/demographics/MajorScreen";

const Stack = createStackNavigator();

export const DemographicStack = () => {

  return (
    <Stack.Navigator>

      <Stack.Screen
        name="Onboard"
        component={OnboardingScreen}
        options={{ headerShown: false}}
      />

      <Stack.Screen 
        name="Age" 
        component={AgeScreen} 
        options={{ title: "Enter Age", headerBackTitleVisible: false, }}
      />

      <Stack.Screen
        name="Sex"
        component={SexScreen}
        options={{ title: "Select Sex", headerBackTitleVisible: false, }}
      />

      <Stack.Screen
        name="Gender" 
        component={GenderScreen} 
        options={{ title: "Select Gender", headerBackTitleVisible: false, }}
      />

      <Stack.Screen
        name="Sexual Orientation" 
        component={SexualOrientation} 
        options={{ title: "Select Sexual Orientation", headerBackTitleVisible: false, }}
      />

      <Stack.Screen
        name="Race" 
        component={RaceScreen} 
        options={{ title: "Select Race", headerBackTitleVisible: false, }}
      />

      <Stack.Screen
        name="Religion" 
        component={ReligionScreen} 
        options={{ title: "Enter Religion", headerBackTitleVisible: false, }}
      />

      <Stack.Screen
        name="Language" 
        component={LanguageScreen} 
        options={{ title: "Select Primary Language", headerBackTitleVisible: false, }}
      />

      <Stack.Screen
        name="Relationship" 
        component={RelationshipScreen} 
        options={{ title: "Select Relationship Status", headerBackTitleVisible: false, }}
      />

      <Stack.Screen
        name="Semester" 
        component={SemesterScreen} 
        options={{ title: "Enter Current Semester", headerBackTitleVisible: false, }}
      />

      <Stack.Screen
        name="Student Status" 
        component={StudentStatus} 
        options={{ title: "Select Student Status", headerBackTitleVisible: false, }}
      />

      <Stack.Screen
        name="Employment Status" 
        component={EmploymentStatusScreen} 
        options={{ title: "Select Employment Status", headerBackTitleVisible: false, }}
      />

      <Stack.Screen
        name="Housing Status" 
        component={HousingStatusScreen} 
        options={{ title: "Select Housing Status", headerBackTitleVisible: false, }}
      />

      <Stack.Screen
        name="Major School" 
        component={MajorSchoolScreen} 
        options={{ title: "Select Intended Major School", headerBackTitleVisible: false, }}
      />

      <Stack.Screen
        name="Major" 
        component={MajorScreen} 
        options={{ title: "Enter Intended Major", headerBackTitleVisible: false, }}
      />

      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ title: "Select Categories Of Interest", headerBackTitleVisible: false,  }}
      />
      
      <Stack.Screen
        name="Hobbies"
        component={HobbiesScreen}
        options={{ title: "Select Hobbies of Interest", headerBackTitleVisible: false,  }}
      />

      <Stack.Screen
        name="Avatar"
        component={AvatarScreen}
        options={{ title: "Create Your Assistant", headerBackTitleVisible: false,  }}
      />
      
    </Stack.Navigator>
  );
};
