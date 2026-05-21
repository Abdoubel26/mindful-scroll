# Mindful Scroll

**Mindful Scroll** is a Chrome extension that helps you browse social media intentionally. Before diving into sites like Reddit, YouTube, or X (Twitter), it asks **“What are you going to do?”** and **“How long?”**. This breaks the autopilot cycle and lets you set a time limit. At the end of your session, the site is blocked until you consciously extend or leave.

![Screenshot of popup](/assets/screenshot1.png)  
![Screenshot of block screen](/assets/screenshot2.png)

## Features  
- **Intentional browsing:** Prompted every time you open a social site, so you decide your goal ahead of time.  
- **Timed sessions:** Set a fixed duration for each visit.  
- **Session end screen:** When time’s up, a friendly block screen reminds you to either extend or stop browsing.  
- **Multi-site support:** Keeps separate timers for each domain (Reddit vs. YouTube vs. X).  
- **Open source:** Fully customizable—adjust or contribute on GitHub.

## Installation (Developer)  
1. Clone or download this repository.  
2. Go to `chrome://extensions` in Chrome.  
3. Enable **Developer mode** (toggle in top-right).  
4. Click **Load unpacked** and select this repository’s folder.  

Then visit a supported site to see it in action.

## Usage  
- Upon opening a social media site, a popup appears.  
- Enter what you plan to do and for how many minutes.  
- Choose “Start Session” to proceed, or “Leave Site” to go elsewhere.  
- When the timer ends, the site shows a “Session Ended” overlay (with options to extend or stop).  
- To restart, click **“Start New Session”** on the block screen.

## Configuration  
- No external servers or accounts needed (all data is stored locally).  
- **Supported sites:** By default, YouTube, Reddit, Twitter/X, and Instagram.  
- To modify or add sites, edit the `matches` in `manifest.json`.

## Development Setup  
To set up a development environment:  
- Install [Node.js](https://nodejs.org/) and run `npm install` to set up linters.  
- Run `npm run lint` to check code style.  
- If you change source files, reload the extension via `chrome://extensions`.

## Contributing  
Contributions are welcome! 
- Fork the repo and create a feature branch.  
- Write clear commit messages and document your changes.  
- Test your code changes with the steps above.  
- Submit a Pull Request for review.

## Screenshots  
- See `/assets/screenshot1.png` and `/assets/screenshot2.png` (in 1280×800 resolution) for example flows.  

## License  
This project is **MIT licensed**. See [LICENSE](LICENSE) for details.
