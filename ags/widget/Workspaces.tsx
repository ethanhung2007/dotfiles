// ~/.config/ags/widget/Workspaces.tsx
//
// Fixed 1-9 slots (never reflow — SUPER+7 always lands in visual position 7,
// even if 4-6 were never opened). Each slot is a symmetric square button;
// the focused one gets a full highlighted box background (see
// .workspace-slot.focused in style.scss) rather than an underline.

import { Gtk } from "ags/gtk3"
import { createBinding, createComputed } from "ags"
import Hyprland from "gi://AstalHyprland"

const hypr = Hyprland.get_default()

const WORKSPACE_COUNT = 9

const focusedId = createBinding(hypr, "focusedWorkspace")((w) => w?.id ?? 1)
const workspaces = createBinding(hypr, "workspaces")

export default function Workspaces() {
    return (
        <box class="workspaces" valign={Gtk.Align.CENTER}>
            <box class="workspace-row" spacing={2}>
                {Array.from({ length: WORKSPACE_COUNT }, (_, i) => {
                    const id = i + 1

                    const slotClass = createComputed(() => {
                        if (id === focusedId()) return "workspace-slot focused"
                        if (workspaces().some((w) => w.id === id)) return "workspace-slot occupied"
                        return "workspace-slot empty"
                    })

                    return (
                        <button
                            class={slotClass}
                            halign={Gtk.Align.CENTER}
                            valign={Gtk.Align.CENTER}
                            onClicked={() => hypr.get_workspace(id)?.focus()}
                        >
                            <label label={`${id}`} halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER} />
                        </button>
                    )
                })}
            </box>
        </box>
    )
}
