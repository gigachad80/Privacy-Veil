# 🌙 Project Name: PrivacyVeil

PrivacyVeil: A privacy-first dark mode extension for Firefox/LibreWolf that respects ResistFingerprinting, requires zero permissions abuse, and keeps your browsing data completely local—no tracking, no analytics, no compromise.

![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Firefox](https://img.shields.io/badge/Firefox-Compatible-orange.svg)
![LibreWolf](https://img.shields.io/badge/LibreWolf-Compatible-red.svg)
<a href="https://github.com/gigachad80/privacyveil/issues"><img src="https://img.shields.io/badge/contributions-welcome-purple.svg?style=flat"></a>

### Table of Contents

* [📌 Overview](#-overview)
* [✨ Features](#-features)
* [🏗️ Architecture & How It Works](#%EF%B8%8F-architecture--how-it-works)
* [⚙️ Browser Compatibility](#%EF%B8%8F-browser-compatibility)
* [📚 Requirements & Dependencies](#-requirements--dependencies)
* [📥 Installation Guide](#-installation-guide)
* [🚀 Usage](#-usage)
  - [Basic Usage](#basic-usage)
  - [Advanced Configuration](#advanced-configuration)
* [🔐 Security & Privacy](#-security--privacy)
* [🤔 Why This Name?](#-why-this-name)
* [⌚ Development Time](#-development-time)
* [🙃 Why I Created This](#-why-i-created-this)
* [📞 Contact](#-contact)
* [📄 License](#-license)

---

### 📌 Overview

PrivacyVeil is a dark mode extension engineered specifically for privacy-conscious users running LibreWolf or Firefox with ResistFingerprinting (RFP) enabled. Unlike Dark Reader and other mainstream dark mode solutions, PrivacyVeil prioritizes security and privacy above all else.

**Key Capabilities:**
* Client-side dark mode injection without exposing color scheme preferences
* Intelligent site exclusion for pages with native dark mode
* Real-time brightness adjustment (60-100%)
* Context menu quick-exclude for problematic sites
* Zero external network requests or telemetry
* ~1,100 lines of fully auditable code (430 JS + 650 CSS/HTML)

---

### ✨ Features

### 🎯 Privacy-First Dark Mode
- **No Permission Abuse** - Minimal permissions (storage, activeTab only)
- **Zero Tracking** - No analytics, no telemetry, no data collection
- **RFP Compatible** - Works perfectly with LibreWolf's ResistFingerprinting protection
- **Client-Side Only** - Dark mode applied locally, websites cannot detect preferences
- **Open Source** - Fully auditable ~1,100 lines of code

### ⚡ Intelligent Site Management
- **Auto-Detection** - Automatically detects sites with native dark mode (GitHub, Reddit, YouTube, etc.)
- **Quick Exclude** - Right-click context menu to exclude problematic sites
- **Per-Site Control** - Exclude specific sites if they don't render well
- **Smart Defaults** - Pre-configured to skip major sites with built-in dark mode

### 🔧 User-Friendly Customization
- **Brightness Slider** - Adjust darkness from 60% to 100%
- **One-Click Toggle** - Enable/disable dark mode instantly
- **Easy Exclusion List** - View and manage all excluded sites
- **Quick Removal** - Remove individual sites from exclusion list anytime
- **Clear All** - Reset all exclusions with one click

### 🛡️ Security-First Design
- **No eval() or unsafe code** - Zero dynamic code execution
- **CSP Compliant** - Respects Content Security Policies
- **Minimal DOM Manipulation** - Limited attack surface
- **Sandboxed Execution** - Runs within Firefox's secure extension sandbox
- **No Form Interception** - Never accesses sensitive data or credentials

### 🚀 Performance Optimized
- **Lightweight** - ~1,100 lines of code, minimal memory footprint
- **Fast Loading** - Applies dark mode before page renders
- **Efficient Updates** - Debounced MutationObserver for dynamic content
- **Zero CPU Impact** - Minimal processing overhead
- **Automatic Cleanup** - Proper resource management on page unload

---

### 🏗️ Architecture & How It Works



#### System Architecture Diagram

<img width="1990" height="2632" alt="Untitled diagram-2025-10-17-062701" src="https://github.com/user-attachments/assets/36db3e8c-1cc1-4ddd-ab0f-92e4f5f5a84b" />

#### How It Works - Step by Step

**Step 1: User Opens Website**
```
Website Loads → content.js Injects → Reads Settings
```

**Step 2: Settings Retrieved**
```
browser.storage.local.get() → Returns:
{
  enabled: true,
  brightness: 90,
  excludedSites: ['github.com', 'reddit.com']
}
```

**Step 3: Dark Mode Decision**
```
IF site NOT in excludedSites:
   ✅ Add data-dark-mode="true" to <html>
   ✅ Apply brightness filter if brightness ≠ 100
   ✅ Inject dark-mode.css styles
ELSE:
   ❌ Skip dark mode, show original colors
```

**Step 4: CSS Activation**
```
dark-mode.css detects [data-dark-mode="true"]
↓
Applies dark colors to all elements:
├─ Background: #1a1a1e
├─ Text: #e8e6e3
├─ Links: #58a6ff
└─ Borders: #4a4a52
```

**Step 5: Real-Time Updates**
```
User changes settings in popup
↓
background.js saves to storage
↓
All open tabs receive message
↓
content.js updates dark mode instantly
```

**Step 6: Dynamic Content**
```
MutationObserver watches for new DOM nodes
↓
If page structure changes, re-apply dark mode
↓
Debounced to prevent performance issues
```

#### Data Flow Diagram


<img width="600" height="2632" alt="Untitled diagram-2025-10-17-063032" src="https://github.com/user-attachments/assets/ed6b03ad-6c7e-45a6-b327-46638256020c" />

#### Security Architecture

```
WEBSITE CONTEXT (Untrusted)
├─ Can read data-dark-mode attribute ✓
├─ Cannot access extension storage ✗
├─ Cannot intercept communication ✗
└─ Cannot steal any data ✗

CONTENT SCRIPT (Sandboxed)
├─ Can modify DOM ✓
├─ Can read storage ✓
├─ Cannot access website localStorage ✗
├─ Cannot make external requests ✗
└─ Cannot execute website code ✗

EXTENSION CONTEXT (Trusted)
├─ Controls all storage ✓
├─ Manages all communication ✓
├─ Enforces settings ✓
├─ No external access ✗
└─ No tracking capability ✗
```

#### Z-Index Layer Stack


<img width="2892" height="440" alt="Untitled diagram-2025-10-17-065950" src="https://github.com/user-attachments/assets/e8da6e3e-e21d-4f6f-b06b-a511f32447c2" />


### ⚙️ Browser Compatibility

**PrivacyVeil supports both Manifest V2 and V3**, making it compatible with:

#### Manifest V3 (Modern)
- ✅ **Firefox 109+** (Full support)
- ✅ **LibreWolf** (All versions with MV3 support)
- ✅ **Chrome 88+** (Full support)
- ✅ **Edge 88+** (Full support)

#### Manifest V2 (Legacy)
- ✅ **Firefox Developer Edition** (with MV2 enabled)
- ✅ **Older Firefox versions** (pre-109)
- ✅ **Chrome <88** (Legacy support)

---

### 📚 Requirements & Dependencies

- **Firefox** 109+ OR **LibreWolf** (latest) OR **Chrome** 88+
- **ResistFingerprinting** support (optional but recommended for LibreWolf)
- No external dependencies
- No npm packages required
- No CDN resources
- ~1,100 lines of self-contained code

---

### 📥 Installation Guide

### ⚡ Quick Install

Install addon from here : 

---


### ⚠️ Important Note: Known Limitations

> [!WARNING]
> **Z-Index Layer & Search UI**
> 
> The z-index layering system (used for proper visual hierarchy) may occasionally cause UI overlap issues during search operations, particularly when using browser search bars or autocomplete dropdowns on complex websites. This is a known trade-off between maintaining privacy protections and achieving pixel-perfect UI rendering.
> 
> **Why This Trade-Off Exists:**
> Privacy and security must sometimes take precedence over UI perfection. Implementing proper DOM isolation and z-index management protects your data and fingerprinting vectors, but can occasionally interact unexpectedly with complex website structures. We believe protecting your privacy is worth this minor visual compromise.
> 
> **Contributing & Feedback:**
> If you encounter UI issues or have suggestions for improvement, please open an issue or submit a PR on GitHub. We continuously work to improve PrivacyVeil while maintaining our privacy-first approach. Feel free to fork and modify the code to better suit your needs.
> 
> **Philosophy:** To gain better privacy and security protection, some UI refinement may need to be sacrificed. This is an intentional design choice—we prioritize your privacy over flawless aesthetics.
### 🚀 Usage

### Basic Usage

```bash
# Enable/Disable Dark Mode
1. Click PrivacyVeil icon in toolbar
2. Toggle "Dark Mode" on/off
3. Changes apply instantly

# Adjust Brightness
1. Open PrivacyVeil popup
2. Drag brightness slider (60-100%)
3. Lower = darker, Higher = lighter

# Exclude a Site
Method A (Popup):
  1. Open problematic site
  2. Click PrivacyVeil icon
  3. Click "Exclude Current Site"
  4. Page reloads without dark mode

Method B (Context Menu):
  1. Right-click anywhere on page
  2. Select "Exclude this site from dark mode"
  3. Site added to exclusion list

# Manage Exclusions
1. Open PrivacyVeil popup
2. Scroll to "Excluded Sites" section
3. Click "Remove" to re-enable dark mode
4. Click "Clear All Exclusions" to reset
```

  ### Advanced Configuration

  #### Manually Edit Settings

  Navigate to `about:debugging` → Inspect Extension → Storage tab:

  ```javascript
  // Default settings stored in browser.storage.local:
  {
    enabled: true,           // Dark mode on/off
    brightness: 90,          // 60-100 (60=darkest, 100=lightest)
    excludedSites: [         // Sites to skip dark mode
      "github.com",
      "reddit.com",
      "youtube.com"
    ]
  }
  ```

  #### Customize Dark Mode Colors

  Edit `dark-mode.css` to change colors:

  ```css
  :root {
    --dm-bg: #1a1a1e;        /* Background color */
    --dm-text: #e8e6e3;      /* Text color */
    --dm-link: #58a6ff;      /* Link color */
  }
  ```

  ---
---

### 🔐 Security & Privacy

#### What We Protect

✅ **No Fingerprinting** - Dark mode applied client-side only  
✅ **RFP Compatible** - Works with LibreWolf ResistFingerprinting  
✅ **No Data Collection** - Zero tracking or analytics  
✅ **No Network Requests** - Completely offline operation  
✅ **Minimal Permissions** - Only `storage` and `activeTab`  

#### Security Audit Results

```
✅ No eval() or unsafe code execution
✅ No external dependencies
✅ No network access
✅ No localStorage/sessionStorage (web APIs)
✅ No form interception
✅ No credential theft
✅ No tracking pixels
✅ CSP compliant
✅ Sandboxed execution
✅ ~1,100 lines of auditable code
```

#### Comparison with Dark Reader

| Feature | PrivacyVeil | Dark Reader |
|---------|-----------|-------------|
| Privacy | 🟢 Zero tracking | 🟡 Unknown |
| Permissions | 🟢 Minimal | 🟡 Broad |
| Code Size | 🟢 ~1,100 lines | 🔴 50,000+ lines |
| RFP Compatible | 🟢 Yes | 🔴 Conflicts |
| Network Requests | 🟢 Zero | 🔴 Potential |
| Open Source | 🟢 Fully | 🟢 Fully |

---

### 🤔 Why This Name?

**PrivacyVeil** represents a protective layer that:
- 🌙 Veils your eyes from harsh light
- 🔒 Veils your privacy from fingerprinting
- 🛡️ Veils your data from tracking

The name captures the essence: **Privacy Protection + Dark Mode** working together as one unified shield for your browsing experience.

---

### ⌚ Development Time

**Total Time:** 2 hrs 50 mins 33 secs

### Breakdown:

- **Development:** 34 mins 33 secs
- **Firefox Submission:** 45 mins  
  _This was my first time publishing an extension, and I encountered several issues:_
  - The `manifest.json` file wasn't being detected in the root directory.
  - Faced multiple validation errors.
  - Versioning issues also occurred.
- **README Writing:** 31 mins
- **Mermaid.js Diagram Creation:** 1 hr  
  _I wasn't familiar with Mermaid.js syntax, so extra time was needed to learn and implement it._

---

### 🙃 Why I Created This

During my OSINT research , I prefer to maintain privacy with LibreWolf and ResistFingerprinting enabled. I faced a dilemma:

**The Problem:**
- Dark Reader requires broad permissions and makes external requests
- Native Firefox dark mode is blocked by ResistFingerprinting (intentionally)
- Other extensions either tracked me or didn't respect RFP
- I was forced to use light mode for sensitive OSINT work
- I needed dark mode that was completely private and auditable

**The Solution:**
I created **PrivacyVeil** - a dark mode extension that:
- Works perfectly with ResistFingerprinting
- Requires zero permissions abuse
- Makes zero external requests
- Is completely auditable (~1,100 lines)
- Keeps all data local

---

### 📞 Contact

📧 **Email**: pookielinuxuser@tutamail.com 

🐱 **GitHub**: [@gigachad80](https://github.com/gigachad80)  

---

### 📄 License

Licensed under the **MIT License**.  
See [`LICENSE.md`](LICENSE.md) for details.

**First Published**: October 09, 2025  
**Last Updated**: October 09, 2025  
**Version**: 1.0.0  
**Status**: ✅ Published on Firefox Add-ons Store

---

**Made with ❤️ for privacy-conscious security researchers, OSINT practitioners, and anyone who refuses to compromise privacy for comfort.**

🔒 **PrivacyVeil: Your Privacy, Protected. Your Eyes, Comfortable.**
