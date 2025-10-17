// Minimal Dark Mode - Privacy-focused content script
// Compatible with both Manifest V2 and V3
// Security considerations:
// 1. No tracking or analytics
// 2. No external connections
// 3. Minimal DOM manipulation
// 4. Respects CSP policies
// 5. No data collection

(function () {
    'use strict';

    // Detect browser API (firefox uses 'browser', chrome uses 'chrome')
    const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

    // Check if we're in a privileged context that shouldn't be modified
    const privilegedUrls = [
        'about:',
        'chrome:',
        'moz-extension:',
        'file://'
    ];

    if (privilegedUrls.some(url => window.location.href.startsWith(url))) {
        return;
    }

    // List of sites with native dark mode (we skip these)
    const nativeDarkModeSites = [
        'github.com',
        'stackoverflow.com',
        'reddit.com',
        'twitter.com',
        'youtube.com',
        'twitch.tv',
        'discord.com',
        'developer.mozilla.org'
    ];

    const hasNativeDarkMode = nativeDarkModeSites.some(site =>
        window.location.hostname.includes(site)
    );

    // Security: Use storage API instead of localStorage to respect extension sandboxing
    async function getSettings() {
        try {
            const result = await browserAPI.storage.local.get({
                enabled: true,
                brightness: 90,
                excludedSites: []
            });
            return result;
        } catch (e) {
            console.error('[Minimal Dark Mode] Storage error:', e);
            return { enabled: true, brightness: 90, excludedSites: [] };
        }
    }

    async function applyDarkMode() {
        const settings = await getSettings();

        // Check if current site is excluded
        const currentHost = window.location.hostname;
        if (settings.excludedSites.includes(currentHost)) {
            return;
        }

        // Only apply if enabled
        if (!settings.enabled) {
            document.documentElement.removeAttribute('data-dark-mode');
            return;
        }

        // Mark if site has native dark mode
        if (hasNativeDarkMode) {
            document.documentElement.setAttribute('data-has-native-dark', 'true');
        }

        // Apply dark mode marker
        document.documentElement.setAttribute('data-dark-mode', 'true');

        // Apply brightness adjustment if needed
        if (settings.brightness !== 100) {
            const brightnessValue = settings.brightness / 100;
            document.documentElement.style.setProperty(
                'filter',
                `brightness(${brightnessValue})`,
                'important'
            );
        }
    }

    // Initial application
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyDarkMode);
    } else {
        applyDarkMode();
    }

    // Listen for settings changes
    browserAPI.storage.onChanged.addListener((changes, area) => {
        if (area === 'local') {
            applyDarkMode();
        }
    });

    // Monitor for dynamically loaded content
    // Security: Use minimal MutationObserver to avoid performance issues
    let timeoutId;
    const observer = new MutationObserver(() => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            const html = document.documentElement;
            if (!html.hasAttribute('data-dark-mode')) {
                applyDarkMode();
            }
        }, 100);
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: false // Only observe direct children for security
    });

    // Security: Clean up on unload
    window.addEventListener('unload', () => {
        observer.disconnect();
        clearTimeout(timeoutId);
    });

    // Listen for messages from popup
    browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'toggleDarkMode') {
            applyDarkMode();
            sendResponse({ success: true });
        } else if (message.action === 'excludeSite') {
            document.documentElement.removeAttribute('data-dark-mode');
            sendResponse({ success: true });
        }
        return true;
    });

})();
