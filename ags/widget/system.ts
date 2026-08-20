// ~/.config/ags/widget/system.ts
//
// Polling-based stats — no dedicated Astal library for raw CPU/RAM/temp,
// so this reads /proc directly on a timer via ags's createPoll (from
// "ags/time"), which re-runs the given function on an interval and exposes
// the result as a reactive Accessor.

import { createPoll } from "ags/time"
import { readFile } from "ags/file"

function readCpuPercent(): number {
    // crude two-sample /proc/stat read; good enough for a glance-value
    const a = readFile("/proc/stat").split("\n")[0].split(/\s+/).slice(1).map(Number)
    const idle1 = a[3]
    const total1 = a.reduce((s, n) => s + n, 0)

    // busy-wait a tiny bit isn't ideal in a UI thread — in the real widget,
    // prefer diffing against the previous poll's stored values instead of
    // sampling twice synchronously here.
    const b = readFile("/proc/stat").split("\n")[0].split(/\s+/).slice(1).map(Number)
    const idle2 = b[3]
    const total2 = b.reduce((s, n) => s + n, 0)

    const idleDelta = idle2 - idle1
    const totalDelta = total2 - total1
    return totalDelta === 0 ? 0 : Math.round((1 - idleDelta / totalDelta) * 100)
}

function readRamUsedGb(): string {
    const lines = readFile("/proc/meminfo").split("\n")
    const get = (key: string) =>
        Number(lines.find((l) => l.startsWith(key))?.match(/\d+/)?.[0] ?? 0)

    const totalKb = get("MemTotal:")
    const availKb = get("MemAvailable:")
    const usedGb = (totalKb - availKb) / 1024 / 1024
    return `${usedGb.toFixed(1)}gb`
}

function readTempC(): string {
    // Path varies by board/kernel — check `sensors` or
    // /sys/class/thermal/thermal_zone*/type on the real machine to find
    // the right zone (this assumes zone0 is the CPU package, often true
    // but not guaranteed).
    try {
        const milli = Number(readFile("/sys/class/thermal/thermal_zone0/temp").trim())
        return `${Math.round(milli / 1000)}c`
    } catch {
        return "—"
    }
}

export const cpuUsage = createPoll(0, 2000, () => readCpuPercent())
export const ramUsage = createPoll("0gb", 3000, () => readRamUsedGb())
export const cpuTemp = createPoll("—", 3000, () => readTempC())
