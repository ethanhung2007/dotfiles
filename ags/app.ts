// ~/.config/ags/app.ts
// Entry point. AGS v2 (Astal) — run with `ags run` from this directory.

import { App } from "astal/gtk3"
import Bar from "./widget/Bar"
import style from "./style.scss"

App.start({
    css: style,
    main() {
        // One bar per connected monitor. Adjust if you're on a single-monitor
        // desktop vs a multi-monitor setup later.
        App.get_monitors().forEach(Bar)
    },
})
