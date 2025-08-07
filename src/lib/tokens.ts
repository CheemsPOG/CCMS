// Typography design tokens extracted from Figma (node 25:6118)
// Each token represents a text style for headings and body text.
// You can import and use these in your components or styling system.

export const typography = {
  // 2XL Heading
  heading_2xl: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontWeight: 400, // Regular
    fontSize: '60px',
    lineHeight: 1.2,
    letterSpacing: '-1.2px',
  },
  // XL Heading
  heading_xl: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontWeight: 400, // Regular
    fontSize: '52px',
    lineHeight: 1.2,
    letterSpacing: '-1.04px',
  },
  // LG Heading
  heading_lg: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontWeight: 400, // Regular
    fontSize: '44px',
    lineHeight: 1.2,
    letterSpacing: '-0.88px',
  },
  // MD Heading
  heading_md: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontWeight: 400, // Regular
    fontSize: '36px',
    lineHeight: 1.2,
    letterSpacing: '-0.72px',
  },
  // SM Heading
  heading_sm: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontWeight: 400, // Regular
    fontSize: '28px',
    lineHeight: 1.2,
    letterSpacing: '-0.56px',
  },
  // XS Heading
  heading_xs: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontWeight: 400, // Regular
    fontSize: '20px',
    lineHeight: 1.2,
    letterSpacing: '-0.4px',
  },
  // Body MD
  body_md: {
    fontFamily: "'Karla', 'Noto Sans', sans-serif",
    fontWeight: 400, // Regular
    fontSize: '16px',
    lineHeight: 1.2,
    letterSpacing: '0px',
  },
  // Body SM
  body_sm: {
    fontFamily: "'Karla', 'Noto Sans', sans-serif",
    fontWeight: 400, // Regular
    fontSize: '14px',
    lineHeight: 1.2,
    letterSpacing: '0px',
  },
  // Body XS
  body_xs: {
    fontFamily: "'Karla', 'Noto Sans', sans-serif",
    fontWeight: 400, // Regular
    fontSize: '12px',
    lineHeight: 1.2,
    letterSpacing: '0px',
  },
};

// Color design tokens extracted from Figma (node 25:7148)
// Each color family contains shades from 50 to 900
// You can import and use these in your components or styling system.

export const colors = {
  // Base colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Gray color palette
  gray: {
    50: '#F7FAFC',
    100: '#EDF2F7',
    200: '#E2E8F0',
    300: '#CBD5E0',
    400: '#A0AEC0',
    500: '#718096',
    600: '#4A5568',
    700: '#2D3748',
    800: '#1A202C',
    900: '#171923',
  },
  
  // Red color palette
  red: {
    50: '#FFF5F5',
    100: '#FED7D7',
    200: '#FEB2B2',
    300: '#FC8181',
    400: '#F56565',
    500: '#E53E3E',
    600: '#C53030',
    700: '#9B2C2C',
    800: '#822727',
    900: '#63171B',
  },
  
  // Orange color palette
  orange: {
    50: '#FFFAF0',
    100: '#FEEBC8',
    200: '#FBD38D',
    300: '#F6AD55',
    400: '#ED8936',
    500: '#DD6B20',
    600: '#C05621',
    700: '#9C4221',
    800: '#7B341E',
    900: '#652B19',
  },
  
  // Yellow color palette
  yellow: {
    50: '#FFFFF0',
    100: '#FEFCBF',
    200: '#FAF089',
    300: '#F6E05E',
    400: '#ECC94B',
    500: '#D69E2E',
    600: '#B7791F',
    700: '#975A16',
    800: '#744210',
    900: '#5F370E',
  },
  
  // Green color palette
  green: {
    50: '#F0FFF4',
    100: '#C6F6D5',
    200: '#9AE6B4',
    300: '#68D391',
    400: '#48BB78',
    500: '#38A169',
    600: '#2F855A',
    700: '#276749',
    800: '#22543D',
    900: '#1C4532',
  },
  
  // Teal color palette
  teal: {
    50: '#E6FFFA',
    100: '#B2F5EA',
    200: '#81E6D9',
    300: '#4FD1C5',
    400: '#38B2AC',
    500: '#319795',
    600: '#2C7A7B',
    700: '#285E61',
    800: '#234E52',
    900: '#1D4044',
  },
  
  // Blue color palette
  blue: {
    50: '#EBF8FF',
    100: '#BEE3F8',
    200: '#90CDF4',
    300: '#63B3ED',
    400: '#4299E1',
    500: '#3182CE',
    600: '#2B6CB0',
    700: '#2C5282',
    800: '#2A4365',
    900: '#1A365D',
  },
  
  // Cyan color palette
  cyan: {
    50: '#EDFDFD',
    100: '#C4F1F9',
    200: '#9DECF9',
    300: '#76E4F7',
    400: '#0BC5EA',
    500: '#00B5D8',
    600: '#00A3C4',
    700: '#0987A0',
    800: '#086F83',
    900: '#065666',
  },
  
  // Purple color palette
  purple: {
    50: '#FAF5FF',
    100: '#E9D8FD',
    200: '#D6BCFA',
    300: '#B794F4',
    400: '#9F7AEA',
    500: '#805AD5',
    600: '#6B46C1',
    700: '#553C9A',
    800: '#44337A',
    900: '#322659',
  },
  
  // Pink color palette
  pink: {
    50: '#FFF5F7',
    100: '#FED7E2',
    200: '#FBB6CE',
    300: '#F687B3',
    400: '#ED64A6',
    500: '#D53F8C',
    600: '#B83280',
    700: '#97266D',
    800: '#702459',
    900: '#521B41',
  },
};

// Semantic color tokens extracted from Figma (node 25:7271)
// These tokens represent semantic meanings and should be used for specific UI purposes
// You can import and use these in your components or styling system.

export const semantic = {
  // Background colors - for page and component backgrounds
  background: {
    primary: '#FFFFFF', // Main page background
    secondary: '#F7FAFC', // Secondary background
    tertiary: '#EDF2F7', // Tertiary background
    quaternary: '#CBD5E0', // Quaternary background
    primary_hover: '#F7FAFC', // Primary background hover state
    secondary_hover: '#EDF2F7', // Secondary background hover state
    tertiary_hover: '#E2E8F0', // Tertiary background hover state
    quaternary_hover: '#A0AEC0', // Quaternary background hover state
    black_solid: '#171923', // Solid black background
    black_solid_hover: '#1A202C', // Solid black background hover
    disabled: '#CBD5E0', // Disabled background
    disabled_alt: '#EDF2F7', // Alternative disabled background
  },

  // Text colors - for different text hierarchy levels
  text: {
    primary: '#171923', // Main text color
    secondary: '#4A5568', // Secondary text color
    tertiary: '#718096', // Tertiary text color
    primary_hover: '#1A202C', // Primary text hover state
    secondary_hover: '#2D3748', // Secondary text hover state
    tertiary_hover: '#4A5568', // Tertiary text hover state
    disabled: '#A0AEC0', // Disabled text color
    disabled_alt: '#CBD5E0', // Alternative disabled text color
    placeholder: '#A0AEC0', // Placeholder text color
    white: '#FFFFFF', // White text color
    on_dark_color: '#FFFFFF', // Text color for dark backgrounds
  },

  // Accent colors - for primary brand and interactive elements
  accent: {
    primary: '#319795', // Primary accent color
    secondary: '#4FD1C5', // Secondary accent color
    primary_hover: '#2C7A7B', // Primary accent hover state
    secondary_hover: '#38B2AC', // Secondary accent hover state
  },

  // Error colors - for error states and destructive actions
  error: {
    primary: '#C53030', // Primary error color
    secondary: '#F56565', // Secondary error color
    primary_hover: '#9B2C2C', // Primary error hover state
    secondary_hover: '#E53E3E', // Secondary error hover state
  },

  // Success colors - for success states and positive feedback
  success: {
    primary: '#2F855A', // Primary success color
    secondary: '#48BB78', // Secondary success color
    primary_hover: '#276749', // Primary success hover state
    secondary_hover: '#276749', // Secondary success hover state
  },

  // Warning colors - for warning states and caution feedback
  warning: {
    primary: '#B7791F', // Primary warning color
    secondary: '#ECC94B', // Secondary warning color
    primary_hover: '#975A16', // Primary warning hover state
    secondary_hover: '#D69E2E', // Secondary warning hover state
  },

  // Info colors - for informational states and neutral feedback
  info: {
    primary: '#2B6CB0', // Primary info color
    secondary: '#4299E1', // Secondary info color
    primary_hover: '#2C5282', // Primary info hover state
    secondary_hover: '#3182CE', // Secondary info hover state
  },

  // Icon colors - for icon elements
  icon: {
    primary: '#171923', // Primary icon color
    secondary: '#4A5568', // Secondary icon color
    tertiary: '#A0AEC0', // Tertiary icon color
    primary_hover: '#1A202C', // Primary icon hover state
    secondary_hover: '#2D3748', // Secondary icon hover state
    tertiary_hover: '#4A5568', // Tertiary icon hover state
    disabled: '#A0AEC0', // Disabled icon color
    disabled_alt: '#CBD5E0', // Alternative disabled icon color
    placeholder: '#A0AEC0', // Placeholder icon color
    white: '#FFFFFF', // White icon color
    on_dark_color: '#FFFFFF', // Icon color for dark backgrounds
  },

  // Border colors - for borders and dividers
  border: {
    primary: '#CBD5E0', // Primary border color
    secondary: '#E2E8F0', // Secondary border color
    tertiary: '#EDF2F7', // Tertiary border color
    primary_solid: '#171923', // Solid primary border
    disabled: '#CBD5E0', // Disabled border color
    disabled_alt: '#E2E8F0', // Alternative disabled border color
  },
};

// Usage examples:
// import { typography, colors, semantic } from './tokens';
// <h1 style={typography.heading_2xl}>Heading</h1>
// <div style={{ backgroundColor: colors.blue[500] }}>Blue background</div>
// <button style={{ backgroundColor: semantic.accent.primary }}>Primary button</button>