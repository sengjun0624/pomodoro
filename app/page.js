"use client"
import Head from 'next/head';

import {useState} from "react"
import LandingPage from "@/components/LandingPage"
import PomodoroTimer from "@/components/PomodoroTimer"

export default function Home() {
    const [settings, setSettings] = useState(null)

    const handleReset = () => {
        setSettings(null)
    }

    if (!settings) {
        return <LandingPage onStart={setSettings}/>
    }

    return <PomodoroTimer settings={settings} onReset={handleReset}/>
}


