import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import onboardindReducer from "./features/onboardingSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      onboarding: onboardindReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
