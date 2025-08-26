import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// color design tokens
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        grey: {
          100: "#e0e0e0",
          200: "#c2c2c2",
          300: "#a3a3a3",
          400: "#858585",
          500: "#666666",
          600: "#525252",
          700: "#3d3d3d",
          800: "#292929",
          900: "#141414",
        },
        primary: {
          100: "#d0d1d5",
          200: "#a1a4ab",
          300: "#727681",
          400: "#434957",
          500: "#141b2d",
          600: "#101624",
          700: "#0c101b",
          800: "#080b12",
          900: "#040509",
        },
        greenAccent: {
          100: "#dbf5ee",
          200: "#b7ebde",
          300: "#94e2cd",
          400: "#70d8bd",
          500: "#4cceac",
          600: "#3da58a",
          700: "#2e7c67",
          800: "#1e5245",
          900: "#0f2922",
        },
        redAccent: {
          100: "#f8dcdb",
          200: "#f1b9b7",
          300: "#e99592",
          400: "#e2726e",
          500: "#db4f4a",
          600: "#af3f3b",
          700: "#832f2c",
          800: "#58201e",
          900: "#2c100f",
        },
        blueAccent: {
          100: "#e1e2fe",
          200: "#c3c6fd",
          300: "#a4a9fc",
          400: "#868dfb",
          500: "#6870fa",
          600: "#535ac8",
          700: "#3e4396",
          800: "#2a2d64",
          900: "#151632",
        },
      }
    : {
      // Light Mode - الوضع الفاتح
      grey: {
        100: "#FFFFFF", // لون الخلفية الرئيسي
          200: "#F6F6F6", // لون خلفية الأقسام الثانوية
          300: "#E9E9E9", // لون الحدود الفاصلة (Borders)
          400: "#D1D1D1", // لون العناصر المعطلة (Disabled)
          500: "#B4B4B4",
          600: "#8C8C8C", // لون النصوص الفرعية والوصفية
          700: "#696969",
          800: "#454545",
          900: "#222222", // لون النصوص الداكنة الثانوية
      },
      primary: {
        100: "#E4E7EA",
        200: "#C9CED6",
        300: "#AEB5C1",
        400: "#949DAD",
        500: "#798498",
        600: "#616A7A", // لون النصوص الأساسية في الفقرات
        700: "#49505C",
        800: "#31363D",
        900: "#1A2C48", // لون العناوين الرئيسية (Headings)
      },
      // هذا المتغير سيتحكم باللون البرتقالي/الأصفر
      blueAccent: {
        100: "#FEF7E8", // لون خلفية الأزرار عند مرور الماوس
        200: "#FDEEC1",
        300: "#FBE59A",
        400: "#F9DD73",
        500: "#F7B219", // اللون البرتقالي الأساسي للأزرار والروابط
        600: "#E0A117", // لون أغمق قليلًا للتفاعلات
        700: "#C68F14",
        800: "#946B0F",
        900: "#63480A",
      },
      greenAccent: {
        100: "#FEF7E8", // لون خلفية الأزرار عند مرور الماوس
        200: "#FDEEC1",
        300: "#FBE59A",
        400: "#F9DD73",
        500: "#F7B219", // اللون البرتقالي الأساسي للأزرار والروابط
        600: "#E0A117", // لون أغمق قليلًا للتفاعلات
        700: "#C68F14",
        800: "#946B0F",
        900: "#63480A",
      },
      redAccent: {
        100: "#FDECEA",
        200: "#F8C8C5",
        300: "#F3A59F",
        400: "#EE817A",
        500: "#E95E54", // لون أيقونة الحذف
        600: "#BA4B43", // لون زر الحالة "Inactive"
        700: "#8B3832", // لون الزر عند الـ hover
        800: "#5D2622",
        900: "#2E1311",
      },
    }),
});

// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);

  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            praimary: {
              main: colors.primary[500],
            },
            secondar: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100]
            },
            background: {
              default: colors.primary[700],
            },
          }
        : {
            praimary: {
              main: colors.primary[500],
            },
            secondar: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: "#fefefe",
            },
          }),
    },
    typography: {
      fontFamily: ["Roboto Mono", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Roboto Mono", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Roboto Mono", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Roboto Mono", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Roboto Mono", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Roboto Mono", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Roboto Mono", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

// color mode context

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("dark");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
