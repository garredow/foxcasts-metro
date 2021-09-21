import { Theme } from "./models/Settings";

export type ThemeValue = {
    variable: string;
    value: string;
};
  
export type ThemeConfig = {
    id: Theme;
    settings: {
        icons: 'light' | 'dark'
    },
    values: {
        [key: string]: ThemeValue;
        appBgColor: ThemeValue;
        appBgImageCoverColor: ThemeValue;
        appAccentColor: ThemeValue;
        primaryTextColor: ThemeValue;
        secondaryTextColor: ThemeValue;
        accentTextColor: ThemeValue;
        appbarBgColor: ThemeValue;
        restingControlColor: ThemeValue;
        activeControlColor: ThemeValue;
        disabledControlColor: ThemeValue;
        controlOffsetTextColor: ThemeValue;
    };
};

export const themes: ThemeConfig[] = [
    {
        id: Theme.Light,
        settings: {
            icons: 'dark'
        },
        values: {
            appBgColor: { variable: 'app-bg-color', value: '#555' },
            appBgImageCoverColor: { variable: 'app-bg-image-cover-color', value: 'rgba(0, 0, 0, 0.7)' },
            appAccentColor: { variable: 'app-accent-color', value: '#1ba1e2' },
            primaryTextColor: { variable: 'primary-text-color', value: 'rgba(255, 255, 255, 1)' },
            secondaryTextColor: { variable: 'secondary-text-color', value: 'rgba(255, 255, 255, 0.5)' },
            accentTextColor: { variable: 'accent-text-color', value: '#1ba1e2' },
            appbarBgColor: { variable: 'appbar-bg-color', value: '#181818' },
            restingControlColor: { variable: 'resting-control-color', value: '#b0b0b0' },
            activeControlColor: { variable: 'active-control-color', value: '#fff' },
            disabledControlColor: { variable: 'disabled-control-color', value: '#383838' },
            controlOffsetTextColor: { variable: 'control-offset-text-color', value: '#000' },
        }
    },
    {
        id: Theme.Dark,
        settings: {
            icons: 'light'
        },
        values: {
            appBgColor: { variable: 'app-bg-color', value: '#000' },
            appBgImageCoverColor: { variable: 'app-bg-image-cover-color', value: 'rgba(0, 0, 0, 0.7)' },
            appAccentColor: { variable: 'app-accent-color', value: '#1ba1e2' },
            primaryTextColor: { variable: 'primary-text-color', value: 'rgba(255, 255, 255, 1)' },
            secondaryTextColor: { variable: 'secondary-text-color', value: 'rgba(255, 255, 255, 0.5)' },
            accentTextColor: { variable: 'accent-text-color', value: '#1ba1e2' },
            appbarBgColor: { variable: 'appbar-bg-color', value: '#181818' },
            restingControlColor: { variable: 'resting-control-color', value: '#b0b0b0' },
            activeControlColor: { variable: 'active-control-color', value: '#fff' },
            disabledControlColor: { variable: 'disabled-control-color', value: '#383838' },
            controlOffsetTextColor: { variable: 'control-offset-text-color', value: '#000' },
        }
    }
];