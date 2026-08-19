// ~/.config/ags/widget/Volume.tsx
//
// Two exports: the bar icon (handles scroll-to-adjust + click-to-toggle-popup)
// and the popover content (volume slider + output device list).
//
// NOTE: AstalWp (Wireplumber bindings) API — get_default(), audio.defaultSpeaker,
// speakers list, volume/mute props — check against current astal-wireplumber
// docs on the real machine.

import { Gtk } from "astal/gtk3"
import { Variable, bind } from "astal"
import Wp from "gi://AstalWp"

const wp = Wp.get_default()
export const volumePopoverOpen = Variable(false)

export function VolumeIcon() {
    const speaker = wp?.audio.defaultSpeaker

    return (
        <button
            className="bar-icon"
            onClicked={() => volumePopoverOpen.set(!volumePopoverOpen.get())}
            onScrollUp={() => speaker && (speaker.volume += 0.05)}
            onScrollDown={() => speaker && (speaker.volume -= 0.05)}
        >
            <label
                label={
                    speaker
                        ? bind(speaker, "volume").as((v) => `${Math.round(v * 100)}%`)
                        : "—"
                }
            />
        </button>
    )
}

export function VolumePopover() {
    const speaker = wp?.audio.defaultSpeaker
    const speakers = wp?.audio.speakers ?? []

    return (
        <box className="popover-panel" vertical spacing={10}>
            <slider
                className="volume-slider"
                min={0}
                max={1}
                value={speaker ? bind(speaker, "volume") : 0}
                onDragged={({ value }) => speaker && (speaker.volume = value)}
            />

            <box className="output-list" vertical spacing={4}>
                {speakers.map((s) => (
                    <button
                        className={
                            s === speaker ? "output-item output-item-active" : "output-item"
                        }
                        onClicked={() => wp && (wp.audio.defaultSpeaker = s)}
                    >
                        <label label={s.description ?? s.name} truncate maxWidthChars={24} />
                    </button>
                ))}
            </box>
        </box>
    )
}
