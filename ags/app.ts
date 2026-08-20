// ~/.config/ags/app.ts
// Entry point. AGS v3 (ags + gnim) — run with `ags run` from this directory.

import app from "ags/gtk3/app"
import Bar from "./widget/Bar"
import style from "./style.scss"

app.start({
    css: style,
    main() {
        // One bar per connected monitor. Adjust if you're on a single-monitor
        // desktop vs a multi-monitor setup later.
        app.get_monitors().forEach(Bar)
    },
})
