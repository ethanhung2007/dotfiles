// ~/.config/ags/widget/Workspaces.tsx
//
// Fixed 1-9 slots (never reflow — SUPER+7 always lands in visual position 7,
// even if 4-6 were never opened). Three brightness tiers:
//   - focused workspace: brightest (--ws-focused)
//   - occupied but not focused: medium (--ws-occupied)
//   - never-opened / empty: dim, near-invisible (--ws-empty)
// A thin underline slides beneath whichever slot is focused, driven purely
// by a CSS `left` transition — same trick as the mockup.
//
// NOTE: AstalHyprland's exact API (get_default, focusedWorkspace, workspaces,
// notify signals) should be double checked against `ags docs` / current
// astal-hyprland gir on the real machine — this library's surface moves
// between releases and I can't compile-check it in this sandbox.

import { Gtk } from "astal/gtk3"
import Hyprland from "gi://AstalHyprland"

const hypr = Hyprland.get_default()

const WORKSPACE_COUNT = 9
const SLOT_WIDTH = 22 // px — must match .workspace-slot width in style.scss

export default function Workspaces() {
    let underline: Gtk.Box
    let slots: Gtk.Label[] = []

    const occupiedIds = () => new Set(hypr.get_workspaces().map((w) => w.id))

    const render = () => {
        const occupied = occupiedIds()
        const focusedId = hypr.focusedWorkspace?.id ?? 1

        slots.forEach((label, i) => {
            const id = i + 1
            label.toggleClassName("focused", id === focusedId)
            label.toggleClassName("occupied", occupied.has(id) && id !== focusedId)
            label.toggleClassName("empty", !occupied.has(id) && id !== focusedId)
        })

        underline.set_margin_start((focusedId - 1) * SLOT_WIDTH)
    }

    return (
        <box className="workspaces" valign={Gtk.Align.CENTER}>
            <box className="workspace-row" vertical={false}>
                {Array.from({ length: WORKSPACE_COUNT }, (_, i) => {
                    const id = i + 1
                    return (
                        <button
                            className="workspace-slot"
                            onClicked={() => hypr.get_workspace(id)?.focus()}
                        >
                            <label
                                label={`${id}`}
                                setup={(self) => (slots[i] = self)}
                            />
                        </button>
                    )
                })}
            </box>

            <box
                className="workspace-underline"
                halign={Gtk.Align.START}
                setup={(self) => {
                    underline = self

                    hypr.connect("event", render) // covers focus + open/close
                    render()
                }}
            />
        </box>
    )
}

