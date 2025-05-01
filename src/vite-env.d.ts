
/// <reference types="vite/client" />

// Define our window interface to include the custom methods
interface Window {
  openSchedulePopup?: () => void;
  openMessagePopup?: () => void;
}
