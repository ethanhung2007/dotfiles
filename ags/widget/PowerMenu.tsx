// ~/.config/ags/widget/PowerMenu.tsx
//
// Simple 4-button power menu. Uses standard systemd/loginctl/hyprctl commands
// rather than any Astal-specific power API, so this part is stable regardless
// of Astal version.

import { exec } from "ags/process"

function run(cmd: string) {
    try {
        exec(cmd)
    } catch (e) {
        print(`power action failed: ${cmd} — ${e}`)
    }
}

export default function PowerMenu() {
    return (
        <box class="power-menu" spacing={8}>
            <button class="power-btn" onClicked={() => run("hyprlock")}>
                <label label="lock" />
            </button>
            <button
                class="power-btn"
                onClicked={() => run("hyprctl dispatch exit")}
            >
                <label label="logout" />
            </button>
            <button
                class="power-btn"
                onClicked={() => run("systemctl reboot")}
            >
                <label label="reboot" />
            </button>
            <button
                class="power-btn power-btn-danger"
                onClicked={() => run("systemctl poweroff")}
            >
                <label label="shutdown" />
            </button>
        </box>
    )
}
