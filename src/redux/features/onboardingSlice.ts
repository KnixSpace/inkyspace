import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OnboardingState {
  currentStep: number;
  selectedTags: string[];
  subscribedSpaces: { spaceId: string; isNewsletter: boolean }[];
  isCompleted: boolean;
  isLoading: boolean;
}

const initialState: OnboardingState = {
  currentStep: 0,
  selectedTags: [],
  subscribedSpaces: [],
  isCompleted: false,
  isLoading: false,
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setSelectedTags: (state, action: PayloadAction<string[]>) => {
      state.selectedTags = action.payload;
    },

    toggleSpaceSubscription: (state, action: PayloadAction<string>) => {
      const spaceId = action.payload;
      if (state.subscribedSpaces.some((space) => space.spaceId === spaceId)) {
        state.subscribedSpaces = state.subscribedSpaces.filter(
          (space) => space.spaceId !== spaceId
        );
      } else {
        state.subscribedSpaces.push({ spaceId, isNewsletter: false });
      }
    },

    toggleNewsletter: (state, action: PayloadAction<string>) => {
      const spaceId = action.payload;
      const space = state.subscribedSpaces.find(
        (space) => space.spaceId === spaceId
      );
      if (space) {
        space.isNewsletter = !space.isNewsletter;
      }
    },

    setIsCompleted: (state, action: PayloadAction<boolean>) => {
      state.isCompleted = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setCurrentStep,
  setSelectedTags,
  toggleSpaceSubscription,
  toggleNewsletter,
  setIsCompleted,
  setIsLoading,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
