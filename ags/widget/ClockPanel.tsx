// ~/.config/ags/widget/ClockPanel.tsx
//
// Dropdown shown when the clock in the bar is clicked. Contains the media
// widget, a glance-only stats row, and a toggle row (DND / night light /
// power menu trigger).

import { createState } from "ags"
import { exec } from "ags/process"
import Media from "./Media"
import PowerMenu from "./PowerMenu"
import { cpuUsage, ramUsage, cpuTemp } from "./system"

export const [panelVisible, setPanelVisible] = createState(false)
const [dndOn, setDndOn] = createState(false)
const [nightLightOn, setNightLightOn] = createState(false)
const [powerMenuOpen, setPowerMenuOpen] = createState(false)

function toggleDnd() {
    const next = !dndOn.peek()
    setDndOn(next)
    // wire to mako: `makoctl set-mode do-not-disturb` / `makoctl set-mode default`
    exec(`makoctl set-mode ${next ? "do-not-disturb" : "default"}`)
}

function toggleNightLight() {
    const next = !nightLightOn.peek()
    setNightLightOn(next)
    // hyprsunset is the common Wayland-native option for this
    exec(next ? "hyprsunset -t 4500" : "hyprsunset -i")
}

export default function ClockPanel() {
    return (
        <box class="clock-panel" vertical visible={panelVisible}>
            <Media />

            <box class="stats-row" spacing={16}>
                <box vertical class="stat">
                    <label class="stat-value" label={cpuUsage((v) => `${v}%`)} />
                    <label class="stat-label" label="cpu" />
                </box>
                <box vertical class="stat">
                    <label class="stat-value" label={ramUsage} />
                    <label class="stat-label" label="ram" />
                </box>
                <box vertical class="stat">
                    <label class="stat-value" label={cpuTemp} />
                    <label class="stat-label" label="temp" />
                </box>
            </box>

            <box class="toggle-row" spacing={8}>
                <button
                    class={dndOn((on) => `toggle-btn${on ? " active" : ""}`)}
                    onClicked={toggleDnd}
                >
                    <label label="dnd" />
                </button>
                <button
                    class={nightLightOn((on) => `toggle-btn${on ? " active" : ""}`)}
                    onClicked={toggleNightLight}
                >
                    <label label="night light" />
                </button>
                <button
                    class="toggle-btn"
                    onClicked={() => setPowerMenuOpen((v) => !v)}
                >
                    <label label="power" />
                </button>
            </box>

            <revealer revealChild={powerMenuOpen}>
                <PowerMenu />
            </revealer>
        </box>
    )
}
