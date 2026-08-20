// ~/.config/ags/widget/Volume.tsx
//
// Two exports: the bar icon (handles scroll-to-adjust + click-to-toggle-popup)
// and the popover content (volume slider + output device list).
//
// Scroll is captured via an eventbox wrapper + the raw Gtk "scroll-event"
// signal — Astal.Button has no scroll-up/scroll-down convenience signals in
// this version of libastal, so we read Gdk.EventScroll.direction directly.

import { Gdk } from "ags/gtk3"
import { createState, createBinding } from "ags"
import Wp from "gi://AstalWp"

const wp = Wp.get_default()
export const [volumePopoverOpen, setVolumePopoverOpen] = createState(false)

export function VolumeIcon() {
    const speaker = wp?.audio.defaultSpeaker

    return (
        <eventbox
            onScrollEvent={(_, event) => {
                if (!speaker) return
                if (event.direction === Gdk.ScrollDirection.UP) speaker.volume += 0.05
                else if (event.direction === Gdk.ScrollDirection.DOWN) speaker.volume -= 0.05
            }}
        >
            <button
                class="bar-pill bar-icon"
                onClicked={() => setVolumePopoverOpen((v) => !v)}
            >
                <box spacing={4}>
                    <label class="bar-icon-glyph" label={""} />
                    <label
                        label={
                            speaker
                                ? createBinding(speaker, "volume")((v) => `${Math.round(v * 100)}%`)
                                : "—"
                        }
                    />
                </box>
            </button>
        </eventbox>
    )
}

export function VolumePopover() {
    const speaker = wp?.audio.defaultSpeaker
    const speakers = wp?.audio.speakers ?? []

    return (
        <box class="popover-panel" vertical spacing={10}>
            <slider
                class="volume-slider"
                min={0}
                max={1}
                value={speaker ? createBinding(speaker, "volume") : 0}
                onDragged={(self) => speaker && (speaker.volume = self.value)}
            />

            <box class="output-list" vertical spacing={4}>
                {speakers.map((s) => (
                    <button
                        class={
                            s === speaker ? "output-item output-item-active" : "output-item"
                        }
                        onClicked={() => wp && (wp.audio.defaultSpeaker = s)}
                    >
                        <label label={s.description ?? s.name} truncate maxWidthChars={24} xalign={0} />
                    </button>
                ))}
            </box>
        </box>
    )
}
