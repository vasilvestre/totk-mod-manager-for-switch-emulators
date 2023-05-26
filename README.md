# Zelda: Tears of the Kingdom Mod Manager

<img src="src-tauri/icons/Square30x30Logo.png" alt='logo with a sword and a shield, in the zelda style'> [![License](https://img.shields.io/badge/license-BSD3-blue.svg)](https://github.com/vasilvestre/totk-mod-manager-for-yuzu/blob/main/LICENSE.md)

Zelda: Tears of the Kingdom Mod Manager is an open-source application built with Next.js and Tauri, designed to assist players of Zelda: Tears of the Kingdom on the Yuzu emulator in managing mods for the game.

They are sourced from https://github.com/HolographicWings/TOTK-Mods-collection

## Features

-   **Mod Management**: Easily manage mods for Zelda: Tears of the Kingdom by enabling, updating or removing them from your game installation.
-   **Mod compatibility**: The application will automatically detect which mods are compatible with others
-   **Intuitive User Interface**: The application provides a user-friendly interface, making it simple to navigate and manage mods efficiently.
-   **Desktop Client**: The mod manager is built using Tauri, providing a cross-platform desktop client that runs seamlessly on Windows and Linux.

## How to install

- (Recommended) Windows installation is in the [latest release](https://github.com/vasilvestre/totk-mod-manager-for-yuzu/releases/latest.
- Portable windows Installation is in the [latest release](https://github.com/vasilvestre/totk-mod-manager-for-yuzu/releases/latest).
    - If the app don't run, install WebView2 Runtime from [here](https://developer.microsoft.com/en-us/microsoft-edge/webview2/).
- Linux installation is possible via AppImage and .deb.
  - Error : zelda-tears-of-the-kingdom-mod-manager: error while loading shared libraries: libssl.so.1.1: cannot open shared object file: No such file or directory
    - https://stackoverflow.com/a/72633324 for now

### Best case scenario

- Your Yuzu is located at C:\Users\myUser\AppData\Roaming\yuzu ? It should work instantly.
- That's it, that's the scenario. If not, you may have to give your yuzu path at all launch.

## Contribution install

### Pre-requisites

- Simply follow [Tauri guide] https://tauri.app/v1/guides/getting-started/prerequisites/

### To build

1. Clone the repository:

```bash
git clone https://github.com/vasilvestre/totk-mod-manager-for-yuzu.git
```

2. Navigate to the project directory:

```bash
cd totk-mod-manager-for-yuzu
```

3. Install the dependencies:

```bash
pnpm install
```

4. Start the application:

```bash
pnpm tauri dev
```

The application will open a window.

## Contributing

Contributions are welcome! If you'd like to contribute to Zelda: Tears of the Kingdom Mod Manager, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make the necessary changes and commit your code.
4. Push your branch to your forked repository.
5. Submit a pull request to the main repository.

Please ensure that your code adheres to the project's coding standards and includes appropriate documentation and tests.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/vasilvestre/totk-mod-manager-for-yuzu/blob/main/LICENSE) file for more information.

## Acknowledgements

- Most assets comes from [hyperui.dev](https://www.hyperui.dev/), a UI library for Tailwind.
- See [thank-you.md](https://github.com/vasilvestre/totk-mod-manager-for-yuzu/blob/main/.github/thank-you.md) for a full list of acknowledgements.

## Support

If you encounter any issues or have questions, please create an issue on the [issue tracker](https://github.com/vasilvestre/totk-mod-manager-for-yuzu/issues). We'll do our best to assist you.

## Roadmap

- Alert you if something succeeded
- Implement automatic mod updates.
- Enhance user interface with additional features.

## Stay Updated

To stay updated with the latest news and announcements regarding Zelda: Tears of the Kingdom Mod Manager, be sure to watch the repository on GitHub.

We appreciate your interest in Zelda: Tears of the Kingdom Mod Manager! Happy modding!
