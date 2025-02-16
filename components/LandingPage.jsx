"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LandingPage({ onStart }) {
    const [workTime, setWorkTime] = useState(50)
    const [breakTime, setBreakTime] = useState(10)

    const handleStart = () => {
        onStart({ workTime: workTime * 60, breakTime: breakTime * 60 })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex flex-col items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">포모도로 타이머 설정</h1>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="workTime" className="text-white">
                            학습 시간 (분)
                        </Label>
                        <Input
                            id="workTime"
                            type="number"
                            value={workTime}
                            onChange={(e) => setWorkTime(Number(e.target.value))}
                            className="bg-white/20 text-white border-gray-600"
                        />
                    </div>
                    <div>
                        <Label htmlFor="breakTime" className="text-white">
                            쉬는 시간 (분)
                        </Label>
                        <Input
                            id="breakTime"
                            type="number"
                            value={breakTime}
                            onChange={(e) => setBreakTime(Number(e.target.value))}
                            className="bg-white/20 text-white border-gray-600"
                        />
                    </div>
                    <Button onClick={handleStart} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        시작하기
                    </Button>
                </div>
            </div>
        </div>
    )
}

