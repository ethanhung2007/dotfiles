// ~/.config/ags/widget/Bar.tsx
//
// Top-level bar. Popovers (volume/wifi/bluetooth/clock-panel) are separate
// small layer-shell windows anchored under the bar, toggled via the Variables
// exported from each widget file — not children of the bar window itself.
// This matches how these dropdowns actually behave in Hyprland (a bar window
// can't easily "grow" downward without reflowing everything beneath it).

import { App, Astal, Gdk, Gtk } from "astal/gtk3"
import Workspaces from "./Workspaces"
import ClockPanel, { panelVisible } from "./ClockPanel"
import Weather from "./Weather"
import { VolumeIcon, VolumePopover, volumePopoverOpen } from "./Volume"
import { WifiIcon, WifiPopover, wifiPopoverOpen } from "./Wifi"
import { BluetoothIcon, BluetoothPopover, bluetoothPopoverOpen } from "./Bluetooth"

function Clock() {
    const now = new Date() // real widget should use a Variable().poll(1000, ...) here
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    const date = now.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })

    return (
        <button
            className="clock-btn"
            onClicked={() => panelVisible.set(!panelVisible.get())}
        >
            <box spacing={6}>
                <label className="clock-time" label={time} />
                <label className="clock-date" label={date} />
            </box>
        </button>
    )
}

function BarWindow(monitor: Gdk.Monitor) {
    return (
        <window
            className="bar"
            monitor={monitor}
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
        >
            <centerbox>
                <box halign={Gtk.Align.START}>
                    <Workspaces />
                </box>

                <box halign={Gtk.Align.CENTER}>
                    <Clock />
                </box>

                <box halign={Gtk.Align.END} spacing={10}>
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
    // content based on which Variable is currently true. Simpler than
    // maintaining four separate always-mounted windows.
    return (
        <window
            className="popover-window"
            monitor={monitor}
            anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
            visible={false} // toggled by setup() below
            setup={(self) => {
                const sync = () => {
                    const anyOpen =
                        panelVisible.get() ||
                        volumePopoverOpen.get() ||
                        wifiPopoverOpen.get() ||
                        bluetoothPopoverOpen.get()
                    self.visible = anyOpen
                }
                for (const v of [panelVisible, volumePopoverOpen, wifiPopoverOpen, bluetoothPopoverOpen]) {
                    v.subscribe(sync)
                }
            }}
        >
            <box vertical>
                {panelVisible((open) => (open ? <ClockPanel /> : <box />))}
                {volumePopoverOpen((open) => (open ? <VolumePopover /> : <box />))}
                {wifiPopoverOpen((open) => (open ? <WifiPopover /> : <box />))}
                {bluetoothPopoverOpen((open) => (open ? <BluetoothPopover /> : <box />))}
            </box>
        </window>
    )
}

export default function Bar(monitor: Gdk.Monitor) {
    BarWindow(monitor)
    PopoverWindow(monitor)
}
