// ~/.config/ags/widget/Wifi.tsx
//
// NOTE: AstalNetwork API (get_default(), wifi.enabled, wifi.accessPoints,
// activate_connection) — check against current astal-network docs on the
// real machine.

import { Gtk } from "astal/gtk3"
import { Variable, bind, exec } from "astal"
import Network from "gi://AstalNetwork"

const network = Network.get_default()
export const wifiPopoverOpen = Variable(false)

export function WifiIcon() {
    return (
        <button
            className="bar-icon"
            onClicked={() => wifiPopoverOpen.set(!wifiPopoverOpen.get())}
        >
            <label
                label={
                    network
                        ? bind(network.wifi, "strength").as((s) =>
                              network.wifi.enabled ? `${s}%` : "off"
                          )
                        : "—"
                }
            />
        </button>
    )
}

export function WifiPopover() {
    const wifi = network?.wifi

    return (
        <box className="popover-panel" vertical spacing={8}>
            <box className="popover-header">
                <label label="wifi" />
                <switch
                    active={wifi ? bind(wifi, "enabled") : false}
                    onNotifyActive={({ active }) => wifi && (wifi.enabled = active)}
                />
            </box>

            <box className="network-list" vertical spacing={4}>
                {wifi
                    ? bind(wifi, "accessPoints").as((aps) =>
                          aps.map((ap) => (
                              <button
                                  className="network-item"
                                  onClicked={() =>
                                      exec(`nmcli device wifi connect "${ap.ssid}"`)
                                  }
                              >
                                  <label label={ap.ssid ?? "unknown"} />
                              </button>
                          ))
                      )
                    : null}
            </box>
        </box>
    )
}
