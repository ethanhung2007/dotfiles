// ~/.config/ags/widget/Media.tsx
//
// Now-playing widget, driven by MPRIS (works with Spotify, browser tabs
// playing audio, mpv, etc — anything that registers an mpris player).
// Hides itself entirely when nothing is playing, rather than showing an
// empty/placeholder state.

import { Gtk } from "ags/gtk3"
import { createBinding, With } from "ags"
import Mpris from "gi://AstalMpris"

export default function Media() {
    const mpris = Mpris.get_default()
    const players = createBinding(mpris, "players")

    return (
        <box class="media" visible={players((p) => p.length > 0)}>
            <With value={players}>
                {(players) => {
                    const player = players[0]
                    if (!player) return null

                    return (
                        <box spacing={6} valign={Gtk.Align.CENTER}>
                            <button
                                class="media-btn"
                                onClicked={() => player.previous()}
                            >
                                <label label="" />
                            </button>
                            <button
                                class="media-btn"
                                onClicked={() => player.play_pause()}
                            >
                                <label
                                    label={createBinding(player, "playbackStatus")((s) =>
                                        s === Mpris.PlaybackStatus.PLAYING ? "" : ""
                                    )}
                                />
                            </button>
                            <button
                                class="media-btn"
                                onClicked={() => player.next()}
                            >
                                <label label="" />
                            </button>
                            <label
                                class="media-title"
                                label={createBinding(player, "title")(
                                    (t) => `${t ?? "unknown"} · ${player.artist ?? ""}`
                                )}
                                maxWidthChars={28}
                                truncate
                            />
                        </box>
                    )
                }}
            </With>
        </box>
    )
}
