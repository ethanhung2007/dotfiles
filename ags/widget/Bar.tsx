// ~/.config/ags/widget/Bar.tsx
//
// Top-level bar. Popovers (volume/wifi/bluetooth/clock-panel) are separate
// small layer-shell windows anchored under the bar, toggled via the reactive
// state exported from each widget file — not children of the bar window
// itself. This matches how these dropdowns actually behave in Hyprland (a
// bar window can't easily "grow" downward without reflowing everything
// beneath it).

import { Astal, Gdk, Gtk } from "ags/gtk3"
import { createComputed, With } from "ags"
import Workspaces from "./Workspaces"
import ClockPanel, { panelVisible, setPanelVisible } from "./ClockPanel"
import Weather from "./Weather"
import { VolumeIcon, VolumePopover, volumePopoverOpen } from "./Volume"
import { WifiIcon, WifiPopover, wifiPopoverOpen } from "./Wifi"
import { BluetoothIcon, BluetoothPopover, bluetoothPopoverOpen } from "./Bluetooth"

function Clock() {
    const now = new Date() // real widget should use createPoll(1000, ...) here
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    const date = now.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })

    return (
        <button
            class="bar-pill clock-btn"
            onClicked={() => setPanelVisible((v) => !v)}
        >
            <box spacing={6}>
                <label class="clock-time" label={time} />
                <label class="clock-date" label={date} />
            </box>
        </button>
    )
}

function BarWindow(monitor: Gdk.Monitor) {
    return (
        <window
            class="bar"
            gdkmonitor={monitor}
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
        >
            <centerbox hexpand>
                <box halign={Gtk.Align.START} hexpand>
                    <Workspaces />
                </box>

                <box halign={Gtk.Align.CENTER}>
                    <Clock />
                </box>

                <box halign={Gtk.Align.END} spacing={10} hexpand>
                    <Weather />
                    <VolumeIcon />
                    <BluetoothIcon />
                    <WifiIcon />
                </box>
            </centerbox>
        </window>
    )
}

function PopoverWindow(monitor: Gdk.Monitor) {
    // A single anchored popup slot near the top-right/center that swaps
    // content based on which popover is currently open. Simpler than
    // maintaining four separate always-mounted windows.
    const anyOpen = createComputed(
        () =>
            panelVisible() || volumePopoverOpen() || wifiPopoverOpen() || bluetoothPopoverOpen(),
    )

    return (
        <window
            class="popover-window"
            gdkmonitor={monitor}
            anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
            visible={anyOpen}
        >
            <box vertical>
                <With value={panelVisible}>{(open) => (open ? <ClockPanel /> : null)}</With>
                <With value={volumePopoverOpen}>{(open) => (open ? <VolumePopover /> : null)}</With>
                <With value={wifiPopoverOpen}>{(open) => (open ? <WifiPopover /> : null)}</With>
                <With value={bluetoothPopoverOpen}>
                    {(open) => (open ? <BluetoothPopover /> : null)}
                </With>
            </box>
        </window>
    )
}

export default function Bar(monitor: Gdk.Monitor) {
    BarWindow(monitor)
    PopoverWindow(monitor)
}
