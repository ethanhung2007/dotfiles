// ~/.config/ags/widget/Bluetooth.tsx

import { Gtk } from "ags/gtk3"
import { createState, createBinding, For } from "ags"
import Bluetooth from "gi://AstalBluetooth"

// bt.adapter is null when bluez isn't installed/running, even though
// Bluetooth.get_default() itself succeeds — guard both, not just `bt`.
const bt = Bluetooth.get_default()
const adapter = bt?.adapter
export const [bluetoothPopoverOpen, setBluetoothPopoverOpen] = createState(false)

export function BluetoothIcon() {
    return (
        <button
            class="bar-pill bar-icon icon-only"
            onClicked={() => setBluetoothPopoverOpen((v) => !v)}
        >
            <label
                class={
                    adapter
                        ? createBinding(adapter, "powered")((p) =>
                              p ? "bar-icon-glyph" : "bar-icon-glyph dim"
                          )
                        : "bar-icon-glyph dim"
                }
                halign={Gtk.Align.CENTER}
                valign={Gtk.Align.CENTER}
                label={""}
            />
        </button>
    )
}

export function BluetoothPopover() {
    return (
        <box class="popover-panel" vertical spacing={8}>
            <box class="popover-header">
                <label label="bluetooth" hexpand halign={Gtk.Align.START} />
                <switch
                    active={adapter ? createBinding(adapter, "powered") : false}
                    onNotifyActive={(self) => adapter && (adapter.powered = self.active)}
                />
            </box>

            <box class="device-list" vertical spacing={4}>
                {bt ? (
                    <For each={createBinding(bt, "devices")}>
                        {(d) => (
                            <button
                                class={
                                    d.connected
                                        ? "device-item device-item-active"
                                        : "device-item"
                                }
                                onClicked={() =>
                                    d.connected ? d.disconnect_device() : d.connect_device()
                                }
                            >
                                <label label={d.name ?? d.address} xalign={0} />
                            </button>
                        )}
                    </For>
                ) : null}
            </box>
        </box>
    )
}
