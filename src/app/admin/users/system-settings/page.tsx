"use client"

import React, { useState } from 'react';

export default function SystemSettingsPage() {
    const [darkMode, setDarkMode] = useState(false);
    const [adminPanelBgColor, setAdminPanelBgColor] = useState('#FFFFFF');
    const [language, setLanguage] = useState('English');
    const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');

    const handleDarkModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDarkMode(event.target.checked);
    };

    const handleAdminPanelBgColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAdminPanelBgColor(event.target.value);
    };

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(event.target.value);
    };

    const handleDateFormatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setDateFormat(event.target.value);
    };

    return (
        <div className="p-8 bg-neutral-100">
            <h1 className="text-2xl font-bold mb-6">System Settings</h1>
            <div className="grid gap-4">
                <div className="flex items-center">
                    <label className="text-gray-600 text-sm">Dark Mode:</label>
                    <input type="checkbox" checked={darkMode} onChange={handleDarkModeChange} className="ml-2" />
                </div>
                <div className="flex items-center">
                    <label className="text-gray-600 text-sm">Admin Panel BG Color:</label>
                    <input type="color" value={adminPanelBgColor} onChange={handleAdminPanelBgColorChange} className="ml-2" />
                </div>
                <div className="flex items-center">
                    <label className="text-gray-600 text-sm">Language:</label>
                    <select value={language} onChange={handleLanguageChange} className="ml-2">
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                    </select>
                </div>
                <div className="flex items-center">
                    <label className="text-gray-600 text-sm">Date Format:</label>
                    <select value={dateFormat} onChange={handleDateFormatChange} className="ml-2">
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                </div>
            </div>
            <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save Changes</button>
        </div>
    );
}