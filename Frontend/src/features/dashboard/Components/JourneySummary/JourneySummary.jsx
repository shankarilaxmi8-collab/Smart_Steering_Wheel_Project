import { useEffect, useState } from "react";

function JourneySummary({
    profile,
    data,
    driveStartTime,
}){

    const [driveDuration, setDriveDuration] = useState("00h 00m");

    useEffect(() => {

        if (!driveStartTime) return;

        const updateDuration = () => {

            const diff = Date.now() - driveStartTime.getTime();

            const hours = Math.floor(diff / 3600000);

            const minutes = Math.floor((diff % 3600000) / 60000);

            setDriveDuration(
                `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m`
            );
        };

        updateDuration();

        const timer = setInterval(updateDuration, 1000);

        return () => clearInterval(timer);

    }, [driveStartTime]);
    
    return (

        <div className="bg-[#111827] rounded-3xl p-6 h-full">

            <h2 className="text-sm tracking-[4px] text-slate-400 uppercase mb-8">
                Journey Summary
            </h2>

            <div className="space-y-5">

                <JourneyItem
                    label="Driver"
                     value={profile?.name ?? "--"}
                />

                <JourneyItem
                    label="Drive Duration"
                    value={driveDuration}
                />

                <JourneyItem
                    label="Drive Mode"
                    value={profile?.driveMode ?? "Normal"}
                />

                <JourneyItem
                    label="Prediction Refresh"
                    value="Every 2 sec"
                />

                <JourneyItem
                    label="Sensor Status"
                    value={data?.sensorStatus || "Connected"}
                    color="text-green-400"
                />

                <JourneyItem
                    label="Current State"
                    value={data?.status ?? "NORMAL"}
                    color={
                        data?.prediction?.state === "NORMAL"
                            ? "text-green-400"
                            : "text-red-400"
                    }
                />

            </div>

        </div>

    );
}

function JourneyItem({
    label,
    value,
    color = "text-white",
}) {

    return (

        <div className="flex justify-between items-center border-b border-slate-800 pb-3">

            <span className="text-slate-400">

                {label}

            </span>

            <span className={`font-semibold ${color}`}>

                {value}

            </span>

        </div>

    );

}

export default JourneySummary;