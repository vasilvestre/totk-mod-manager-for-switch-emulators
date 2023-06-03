# Zelda: Tears of the Kingdom Mod Manager

<img src="src-tauri/icons/Square30x30Logo.png" alt='logo with a sword and a shield, in the zelda style'> [![License](https://img.shields.io/badge/License-BSD_3--Clause-blue.svg?style=for-the-badge)](https://opensource.org/licenses/BSD-3-Clause) ![GitHub all releases](https://img.shields.io/github/downloads/vasilvestre/totk-mod-manager-for-switch-emulators/total?style=for-the-badge) [![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/yyeMqCXB) <a href="https://gamebanana.com/tools/13300"><img src="https://gamebanana.com/tools/embeddables/13300?type=medium"/></a>


Zelda: Tears of the Kingdom Mod Manager is an open-source application designed to assist players of Zelda: Tears of the Kingdom on the Yuzu & Ryujinx emulators in managing mods for the game.
It fetch distant mod collection and install/update the mods for you.

They are sourced from https://github.com/HolographicWings/TOTK-Mods-collection

## Features

-   **Mod Management**: Easily manage mods for Zelda: Tears of the Kingdom by enabling, updating or removing them from your game installation.
-   **Mod compatibility**: The application will automatically detect which mods are compatible with others
-   **Intuitive User Interface**: The application provides a user-friendly interface, making it simple to navigate and manage mods efficiently.
-   **Desktop Client**: The mod manager is built using Tauri, providing a cross-platform desktop client that runs seamlessly on Windows and Linux.
-   **Emulator compatiblity**: Work on Ryujinx and Yuzu

## Possible future features

- **Merge mods**: To prevent duplicated code and mod loaded twice
- **Support Ryujinx**: To help more people!
- **Support more games**: Require modders or community help 

## How to install

- (Recommended) Windows installation is in the [latest release](https://github.com/vasilvestre/totk-mod-manager-for-switch-emulators/releases/latest).
- Portable windows Installation is in the [latest release](https://github.com/vasilvestre/totk-mod-manager-for-switch-emulators/releases/latest/download/Zelda.Tears.of.the.Kingdom.Mod.Manager.exe).
    - If the app don't run, install WebView2 Runtime from [here](https://developer.microsoft.com/en-us/microsoft-edge/webview2/).
- Linux installation is possible via AppImage and .deb.
  - `Error : zelda-tears-of-the-kingdom-mod-manager: error while loading shared libraries: libssl.so.1.1: cannot open shared object file: No such file or directory` see : https://stackoverflow.com/a/72633324 

### How to setup the path

#### Yuzu
- Your Yuzu is located at C:\Users\myUser\AppData\Roaming\yuzu ? It should work instantly.
- If the mod ask you to locate Yuzu, please refer to this : https://yuzu-emu.org/wiki/user-directory/
    - There's another path for Yuzu, which isn't the one required.

#### Ryujinx
- Locate the directory shown in their documentation : https://github.com/Ryujinx/Ryujinx/wiki/Ryujinx-Setup-&-Configuration-Guide#managing-mods
  - Linux : `~/.config/ryujinx`
  - Windows : `%appdata%/Roaming/Ryujinx`

## Contributing

Please refer to [CONTRIBUTING](docs/CONTRIBUTING.md).

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/vasilvestre/totk-mod-manager-for-switch-emulators/blob/main/LICENSE) file for more information.

## Acknowledgements

- Most assets comes from [daisyui](https://daisyui.com).
- Icons from [iconify](https://icon-sets.iconify.design/carbon/).
- See [thank-you.md](https://github.com/vasilvestre/totk-mod-manager-for-switch-emulators/blob/main/.github/thank-you.md) for a full list of acknowledgements.

## Support

Join me on discord https://discord.gg/yyeMqCXB !
If you encounter any issues or have questions, please create an issue on the [issue tracker](https://github.com/vasilvestre/totk-mod-manager-for-switch-emulators/issues). We'll do our best to assist you.

## Roadmap

- Persistent Windows defender submission to prevent false positive.
- Implement automatic mod updates.
- Implement gamebanana.
- RPM distribution (not supported by Tauri now).

## Stay Updated

To stay updated with the latest news and announcements regarding Zelda: Tears of the Kingdom Mod Manager, be sure to watch the repository on GitHub.

We appreciate your interest in Zelda: Tears of the Kingdom Mod Manager! Happy modding!
