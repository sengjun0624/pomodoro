"use client"

import { useEffect, useState, useRef } from "react"
import { Pause, Play, RotateCcw, Volume2, VolumeX, Volume1, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

export default function PomodoroTimer({ settings, onReset }) {
    const [isRunning, setIsRunning] = useState(false)
    const [timeLeft, setTimeLeft] = useState(settings.workTime)
    const [isBreak, setIsBreak] = useState(false)
    const [totalStudyTime, setTotalStudyTime] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolume] = useState(50)
    const [isVolumeHovered, setIsVolumeHovered] = useState(false) // Added new state
    const audioRef = useRef(null)
    const alertRef = useRef(null)

    const { workTime, breakTime } = settings

    useEffect(() => {
        if (typeof window !== "undefined") {
            audioRef.current = new Audio("/whitenoise.mp3")
            audioRef.current.loop = true
            alertRef.current = new Audio("/alert.mp3")
        }
    }, [])

    useEffect(() => {
        let interval

        if (isRunning) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        alertRef.current.play()
                        if (!isBreak) {
                            setIsBreak(true)
                            return breakTime
                        } else {
                            setIsBreak(false)
                            return workTime
                        }
                    }
                    return prev - 1
                })

                if (!isBreak) {
                    setTotalStudyTime((prev) => prev + 1)
                }
            }, 1000)
        }

        return () => clearInterval(interval)
    }, [isRunning, isBreak, workTime, breakTime])

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100
            if (isPlaying) {
                audioRef.current.play().catch((e) => console.log("Audio play failed:", e))
            } else {
                audioRef.current.pause()
            }
        }
    }, [isPlaying, volume])

    const toggleTimer = () => setIsRunning(!isRunning)

    const resetTimer = () => {
        setIsRunning(false)
        setTimeLeft(workTime)
        setIsBreak(false)
    }

    const toggleSound = () => setIsPlaying(!isPlaying)

    const handleVolumeChange = (newVolume) => {
        setVolume(newVolume[0])
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const formatTotalTime = (seconds) => {
        const hours = Math.floor(seconds / 3600)
        const mins = Math.floor((seconds % 3600) / 60)
        return `${hours}시간 ${mins}분`
    }

    const progress = (timeLeft / (isBreak ? breakTime : workTime)) * 100

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex flex-col items-center justify-center p-4">
            <div className="text-2xl font-bold mb-8 text-white/90">총 학습시간: {formatTotalTime(totalStudyTime)}</div>

            <div className="flex items-center gap-8">
                {/* Modern Clock Design */}
                <div className="relative w-80 h-80">
                    <div className="absolute inset-0 rounded-full bg-white/5 backdrop-blur-sm shadow-2xl" />
                    <div className="w-full h-full rounded-full border-8 border-gray-700 bg-gray-800 relative overflow-hidden">
                        {/* Time markers */}
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-1 h-4 bg-gray-600"
                                style={{
                                    transform: `rotate(${i * 30}deg)`,
                                    transformOrigin: "50% 50%",
                                    left: "49.5%",
                                    top: "0%",
                                }}
                            />
                        ))}
                        <div
                            className="absolute top-0 left-0 w-full h-full transition-all duration-300"
                            style={{
                                background: `conic-gradient(from 0deg, ${isBreak ? "#22C55E" : "#EF4444"} ${progress}%, transparent ${progress}%)`,
                            }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded-full backdrop-blur-sm">
                            <span className="text-5xl font-bold text-white">{formatTime(timeLeft)}</span>
                        </div>
                    </div>
                </div>

                {/* Vertical Progress Bar */}
                <div className="h-80 w-4 bg-gray-700 rounded-full relative overflow-hidden backdrop-blur-sm">
                    <div
                        className="absolute bottom-0 w-full transition-all duration-300 ease-linear"
                        style={{
                            height: `${progress}%`,
                            backgroundColor: isBreak ? "#22C55E" : "#EF4444",
                        }}
                    />
                </div>
            </div>

            <div className="flex gap-4 mt-8">
                <Button
                    variant="outline"
                    size="lg"
                    onClick={toggleTimer}
                    className="w-24 bg-white/10 border-gray-600 hover:bg-white/20"
                >
                    {isRunning ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
                </Button>
                <Button
                    variant="outline"
                    size="lg"
                    onClick={resetTimer}
                    className="w-24 bg-white/10 border-gray-600 hover:bg-white/20"
                >
                    <RotateCcw className="w-6 h-6 text-white" />
                </Button>
                <div
                    className="relative"
                    onMouseEnter={() => setIsVolumeHovered(true)}
                    onMouseLeave={() => setIsVolumeHovered(false)}
                >
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={toggleSound}
                        className="w-24 bg-white/10 border-gray-600 hover:bg-white/20 relative group"
                    >
                        {isPlaying ? (
                            volume > 50 ? (
                                <Volume2 className="w-6 h-6 text-white" />
                            ) : (
                                <Volume1 className="w-6 h-6 text-white" />
                            )
                        ) : (
                            <VolumeX className="w-6 h-6 text-white" />
                        )}
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {isPlaying ? "볼륨 조절" : "음소거"}
            </span>
                    </Button>
                    {isVolumeHovered && (
                        <div
                            className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-64 bg-gray-800 border-gray-700 text-white p-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out"
                            onMouseEnter={() => setIsVolumeHovered(true)}
                            onMouseLeave={() => setIsVolumeHovered(false)}
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label htmlFor="volume-slider" className="text-sm font-medium">
                                        볼륨
                                    </label>
                                    <span className="text-sm">{volume}%</span>
                                </div>
                                <Slider
                                    id="volume-slider"
                                    value={[volume]}
                                    onValueChange={handleVolumeChange}
                                    max={100}
                                    step={1}
                                    className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-white [&_[role=slider]]:shadow-md"
                                />
                            </div>
                        </div>
                    )}
                </div>
                <Button
                    variant="outline"
                    size="lg"
                    onClick={onReset}
                    className="w-24 bg-white/10 border-gray-600 hover:bg-white/20"
                >
                    <Settings className="w-6 h-6 text-white" />
                </Button>
            </div>
        </div>
    )
}

