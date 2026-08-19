#!/usr/bin/env bash
# install.sh — bootstrap the rice on a fresh/existing Arch install
set -euo pipefail

DOTFILES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_DIR="$HOME/.config"

echo "==> Dotfiles source: $DOTFILES_DIR"

# ---- 1. Pacman packages ----
PACMAN_PKGS=(
    hyprland
    hyprpaper
    hyprlock
    hyprsunset
    kitty
    wofi
    mako
    xdg-desktop-portal-hyprland
    polkit-kde-agent
    qt5-wayland
    qt6-wayland
    pipewire
    pipewire-pulse
    pipewire-alsa
    wireplumber
    network-manager-applet
    pavucontrol
    ttf-jetbrains-mono-nerd
    papirus-icon-theme
    yazi
    brightnessctl
    polkit
    git
)

echo "==> Installing pacman packages..."
sudo pacman -Syu --needed --noconfirm "${PACMAN_PKGS[@]}"

# ---- 2. AUR packages (requires yay) ----
if ! command -v yay &>/dev/null; then
    echo "==> yay not found, building it..."
    tmpdir=$(mktemp -d)
    git clone https://aur.archlinux.org/yay.git "$tmpdir/yay"
    (cd "$tmpdir/yay" && makepkg -si --noconfirm)
    rm -rf "$tmpdir"
fi

AUR_PKGS=(
    bibata-cursor-theme-bin
    aylurs-gtk-shell   # ags v2 CLI (Astal) — package name may shift, check AUR if this 404s
    gjs
)

# Astal widget libraries used by the bar — installed via astal's own
# install script since AUR package names/versions churn frequently for
# these. Check https://github.com/Aylur/astal for the current method.
if ! pkg-config --exists astal-hyprland 2>/dev/null; then
    echo "==> Astal libraries not detected — install manually per:"
    echo "    https://github.com/Aylur/astal (io, hyprland, wireplumber,"
    echo "    network, bluetooth, tray gobject introspection libraries)"
fi

echo "==> Installing AUR packages..."
yay -S --needed --noconfirm "${AUR_PKGS[@]}"

# ---- 3. Symlink configs ----
echo "==> Linking config files..."
mkdir -p "$CONFIG_DIR"

for dir in hypr ags kitty wofi mako gtk-3.0; do
    target="$CONFIG_DIR/$dir"
    if [ -e "$target" ] && [ ! -L "$target" ]; then
        echo "    backing up existing $target -> ${target}.bak"
        mv "$target" "${target}.bak"
    fi
    ln -sfn "$DOTFILES_DIR/$dir" "$target"
    echo "    linked $dir"
done

# ---- 4. Wallpaper dir ----
mkdir -p "$CONFIG_DIR/hypr/wallpapers"
echo "==> Drop a wallpaper into ~/.config/hypr/wallpapers/wall.png (referenced by hyprpaper.conf)"

echo ""
echo "==> Done. Log out and select Hyprland from your display manager, or run 'Hyprland' from a TTY."
echo "==> First things to check once you're in:"
echo "    - hyprctl monitors   (then fix the 'monitor=' line in hyprland.conf)"
echo "    - drop a wallpaper into ~/.config/hypr/wallpapers/wall.png"
