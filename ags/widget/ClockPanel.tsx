// ~/.config/ags/widget/ClockPanel.tsx
//
// Dropdown shown when the clock in the bar is clicked. Contains the media
// widget, a glance-only stats row, and a toggle row (DND / night light /
// power menu trigger).

import { Gtk } from "astal/gtk3"
import { Variable, exec } from "astal"
import Media from "./Media"
import PowerMenu from "./PowerMenu"
import { cpuUsage, ramUsage, cpuTemp } from "./system"

export const panelVisible = Variable(false)
const dndOn = Variable(false)
const nightLightOn = Variable(false)
const powerMenuOpen = Variable(false)

function toggleDnd() {
    dndOn.set(!dndOn.get())
    // wire to mako: `makoctl set-mode do-not-disturb` / `makoctl set-mode default`
    exec(`makoctl set-mode ${dndOn.get() ? "do-not-disturb" : "default"}`)
}

function toggleNightLight() {
    nightLightOn.set(!nightLightOn.get())
    // hyprsunset is the common Wayland-native option for this
    exec(nightLightOn.get() ? "hyprsunset -t 4500" : "hyprsunset -i")
}

export default function ClockPanel() {
    return (
        <box className="clock-panel" vertical visible={panelVisible()}>
            <Media />

            <box className="stats-row" spacing={16}>
                <box vertical className="stat">
                    <label className="stat-value" label={cpuUsage((v) => `${v}%`)} />
                    <label className="stat-label" label="cpu" />
                </box>
                <box vertical className="stat">
                    <label className="stat-value" label={ramUsage()} />
                    <label className="stat-label" label="ram" />
                </box>
                <box vertical className="stat">
                    <label className="stat-value" label={cpuTemp()} />
                    <label className="stat-label" label="temp" />
                </box>
            </box>

            <box className="toggle-row" spacing={8}>
                <button
                    className={dndOn((on) => `toggle-btn${on ? " active" : ""}`)}
                    onClicked={toggleDnd}
                >
                    <label label="dnd" />
                </button>
                <button
                    className={nightLightOn((on) => `toggle-btn${on ? " active" : ""}`)}
                    onClicked={toggleNightLight}
                >
                    <label label="night light" />
                </button>
                <button
                    className="toggle-btn"
                    onClicked={() => powerMenuOpen.set(!powerMenuOpen.get())}
                >
                    <label label="power" />
                </button>
            </box>

            <revealer revealChild={powerMenuOpen()}>
                <PowerMenu />
            </revealer>
        </box>
    )
}
