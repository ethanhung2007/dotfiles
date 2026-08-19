// ~/.config/ags/widget/Media.tsx
//
// Now-playing widget, driven by MPRIS (works with Spotify, browser tabs
// playing audio, mpv, etc — anything that registers an mpris player).
// Hides itself entirely when nothing is playing, rather than showing an
// empty/placeholder state.
//
// NOTE: AstalMpris API — check current docs on the real machine, same
// caveat as Workspaces.tsx.

import { Gtk } from "astal/gtk3"
import { bind } from "astal"
import Mpris from "gi://AstalMpris"

export default function Media() {
    const mpris = Mpris.get_default()

    return (
        <box
            className="media"
            visible={bind(mpris, "players").as((p) => p.length > 0)}
        >
            {bind(mpris, "players").as((players) => {
                const player = players[0]
                if (!player) return <box />

                return (
                    <box spacing={6} valign={Gtk.Align.CENTER}>
                        <button
                            className="media-btn"
                            onClicked={() => player.previous()}
                        >
                            <label label="" />
                        </button>
                        <button
                            className="media-btn"
                            onClicked={() => player.play_pause()}
                        >
                            <label
                                label={bind(player, "playbackStatus").as((s) =>
                                    s === Mpris.PlaybackStatus.PLAYING ? "" : ""
                                )}
                            />
                        </button>
                        <button
                            className="media-btn"
                            onClicked={() => player.next()}
                        >
                            <label label="" />
                        </button>
                        <label
                            className="media-title"
                            label={bind(player, "title").as(
                                (t) => `${t ?? "unknown"} · ${player.artist ?? ""}`
                            )}
                            maxWidthChars={28}
                            truncate
                        />
                    </box>
                )
            })}
        </box>
    )
}
