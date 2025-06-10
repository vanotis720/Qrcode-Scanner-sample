const colors = {
    // Core colors
    primary: '#082059',       // Deep blue - main brand color
    secondary: '#0A2E7A',     // Slightly lighter blue for secondary elements

    // Text colors
    text: '#000000',          // Black for primary text
    lightText: "#A8A8A9",     // Light gray for secondary text
    inverseText: "#FFFFFF",   // White text for dark backgrounds

    // Action colors
    accent: '#F83758',        // Bright red for primary actions/buttons
    actionButton: '#2E8BFF',  // Blue for secondary actions

    // Background colors
    background: "#FFFFFF",    // White background
    surfaceLight: "#F5F5F7",  // Light gray for cards/surfaces
    surfaceDark: "#1E1E1E",   // Dark surface for scanner view

    // Scanner specific
    scannerOverlay: "rgba(8, 32, 89, 0.4)",  // Transparent primary for scanner overlay
    scannerGuide: "#F83758",                  // Accent color for scan area guides
    scannerFocus: "#00FF00",                  // Green indicator for successful focus

    // Status colors
    success: "#34C759",       // Green for success states
    error: "#FF3B30",         // Red for errors
    warning: "#FFCC00",       // Yellow for warnings
    info: "#5AC8FA",          // Blue for information

    // Gradients (as string references to be used with linear gradients)
    gradientPrimary: ['#082059', '#0A2E7A'],
    gradientAccent: ['#F83758', '#FF5B76']
};

export default colors;