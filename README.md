# minimal-dark — Hyprland rice

A quiet, monochrome Wayland setup built around Hyprland + Kitty. No neon, no
gradients — just clean type, generous negative space, and one muted accent
color (`#8fa3b3`) used sparingly for active borders and highlights.

## Stack

| Component        | Choice                          |
|-------------------|----------------------------------|
| Compositor         | Hyprland                        |
| Bar                | Waybar                          |
| Terminal           | Kitty                           |
| Launcher           | Wofi                            |
| Notifications      | Mako                            |
| Wallpaper          | hyprpaper                       |
| Lock screen        | hyprlock                        |
| Font               | JetBrainsMono Nerd Font         |
| Cursor             | Bibata-Modern-Classic           |
| Icons              | Papirus-Dark                    |

## Palette

```
bg              #0f1013
bg-alt          #17181c
surface         #1e1f24
fg              #c8c9d0
fg-dim          #75767f
accent          #8fa3b3   <- used only for active border / highlight
border-inactive #2a2b30
```

## Setup on your PC

```bash
git clone <your-repo-url> ~/dotfiles
cd ~/dotfiles
chmod +x install.sh
./install.sh
```

The script installs packages via pacman + yay, then symlinks each config
folder into `~/.config/`. It backs up anything already there (`*.bak`).

### After first login
1. Run `hyprctl monitors` and update the `monitor=` line in
   `hypr/hyprland.conf` with your actual output name/resolution.
2. Drop a wallpaper at `~/.config/hypr/wallpapers/wall.png` — a plain dark
   color or subtle noise/gradient texture fits the theme best.
3. `SUPER + Return` for terminal, `SUPER + D` for launcher, `SUPER + Q` to
   close a window. Full keybind list is in `hypr/hyprland.conf`.

## Structure

```
dotfiles/
├── hypr/
│   ├── hyprland.conf
│   └── hyprpaper.conf
├── waybar/
│   ├── config.jsonc
│   └── style.css
├── kitty/
│   └── kitty.conf
├── wofi/
│   ├── config
│   └── style.css
├── mako/
│   └── config
├── gtk-3.0/
│   └── settings.ini
└── install.sh
```

## Things worth customizing later
- **Gaps/borders**: `general { gaps_in / gaps_out / border_size }` in
  hyprland.conf — currently tight (4/10) for a minimal look.
- **Blur**: subtle by default (`size = 3, passes = 2`). Bump for more glass,
  drop to 0 for max performance/minimalism.
- **Waybar modules**: trimmed to workspaces, window title, clock, audio,
  network, battery, tray. Add `cpu`/`memory` modules if you want system
  stats visible.
- **Opacity**: kitty and active windows sit at 0.94–0.95. Set to 1.0 across
  the board if you'd rather have zero transparency.
# dotfiles
