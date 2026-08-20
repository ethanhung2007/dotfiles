// ~/.config/ags/widget/Wifi.tsx

import { Gtk } from "ags/gtk3"
import { createState, createBinding, For } from "ags"
import { exec } from "ags/process"
import Network from "gi://AstalNetwork"

// network.wifi is null when there's no wifi hardware/NetworkManager wifi
// device, even though Network.get_default() itself succeeds.
const network = Network.get_default()
const wifi = network?.wifi
export const [wifiPopoverOpen, setWifiPopoverOpen] = createState(false)

export function WifiIcon() {
    return (
        <button
            class="bar-pill bar-icon icon-only"
            onClicked={() => setWifiPopoverOpen((v) => !v)}
        >
            <label
                class={
                    wifi
                        ? createBinding(wifi, "enabled")((e) =>
                              e ? "bar-icon-glyph" : "bar-icon-glyph dim"
                          )
                        : "bar-icon-glyph dim"
                }
                halign={Gtk.Align.CENTER}
                valign={Gtk.Align.CENTER}
                label={""}
            />
        </button>
    )
}

export function WifiPopover() {
    return (
        <box class="popover-panel" vertical spacing={8}>
            <box class="popover-header">
                <label label="wifi" hexpand halign={Gtk.Align.START} />
                <switch
                    active={wifi ? createBinding(wifi, "enabled") : false}
                    onNotifyActive={(self) => wifi && (wifi.enabled = self.active)}
                />
            </box>

            <box class="network-list" vertical spacing={4}>
                {wifi ? (
                    <For each={createBinding(wifi, "accessPoints")}>
                        {(ap) => (
                            <button
                                class="network-item"
                                onClicked={() =>
                                    exec(`nmcli device wifi connect "${ap.ssid}"`)
                                }
                            >
                                <label label={ap.ssid ?? "unknown"} xalign={0} />
                            </button>
                        )}
                    </For>
                ) : null}
            </box>
        </box>
    )
}
