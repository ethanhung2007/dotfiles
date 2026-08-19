// ~/.config/ags/widget/Bluetooth.tsx
//
// NOTE: AstalBluetooth API (get_default(), adapter.powered, devices,
// device.connect_device) — check against current astal-bluetooth docs.

import { Gtk } from "astal/gtk3"
import { Variable, bind } from "astal"
import Bluetooth from "gi://AstalBluetooth"

const bt = Bluetooth.get_default()
export const bluetoothPopoverOpen = Variable(false)

export function BluetoothIcon() {
    return (
        <button
            className="bar-icon"
            onClicked={() => bluetoothPopoverOpen.set(!bluetoothPopoverOpen.get())}
        >
            <label
                label={
                    bt
                        ? bind(bt.adapter, "powered").as((p) => (p ? "on" : "off"))
                        : "—"
                }
            />
        </button>
    )
}

export function BluetoothPopover() {
    return (
        <box className="popover-panel" vertical spacing={8}>
            <box className="popover-header">
                <label label="bluetooth" />
                <switch
                    active={bt ? bind(bt.adapter, "powered") : false}
                    onNotifyActive={({ active }) => bt && (bt.adapter.powered = active)}
                />
            </box>

            <box className="device-list" vertical spacing={4}>
                {bt
                    ? bind(bt, "devices").as((devices) =>
                          devices.map((d) => (
                              <button
                                  className={
                                      d.connected
                                          ? "device-item device-item-active"
                                          : "device-item"
                                  }
                                  onClicked={() =>
                                      d.connected ? d.disconnect_device() : d.connect_device()
                                  }
                              >
                                  <label label={d.name ?? d.address} />
                              </button>
                          ))
                      )
                    : null}
            </box>
        </box>
    )
}
