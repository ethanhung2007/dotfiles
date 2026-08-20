// ~/.config/ags/widget/Weather.tsx
//
// Polls wttr.in's compact format on a timer. Needs network access and,
// ideally, a fixed location so it doesn't rely on IP geolocation (which can
// be wrong/slow on VPNs). Replace TAIPEI below with wherever the machine
// actually lives, or swap to lat/long if you want more precision.

import { createPoll } from "ags/time"
import { exec } from "ags/process"

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

export const weather = createPoll("—", 15 * 60 * 1000, () => fetchWeather()) // every 15 min

export default function Weather() {
    return (
        <box class="bar-pill bar-icon" spacing={4}>
            <label class="bar-icon-glyph" label="" />
            <label label={weather} />
        </box>
    )
}
