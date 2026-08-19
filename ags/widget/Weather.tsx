// ~/.config/ags/widget/Weather.tsx
//
// Polls wttr.in's compact format on a timer. Needs network access and,
// ideally, a fixed location so it doesn't rely on IP geolocation (which can
// be wrong/slow on VPNs). Replace TAIPEI below with wherever the machine
// actually lives, or swap to lat/long if you want more precision.

import { Gtk } from "astal/gtk3"
import { Variable, exec } from "astal"

const LOCATION = "Taipei"

function fetchWeather(): string {
    try {
        // %t = temperature, format=3 gives a compact "City: temp" style string;
        // we just want the temp portion here.
        const raw = exec(`curl -s "wttr.in/${LOCATION}?format=%t"`).trim()
        return raw || "—"
    } catch {
        return "—"
    }
}

export const weather = Variable("—").poll(15 * 60 * 1000, fetchWeather) // every 15 min

export default function Weather() {
    return (
        <box className="bar-icon">
            <label label={weather()} />
        </box>
    )
}
