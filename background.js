// Privacy Veil - Background Service Worker/Script
// Compatible with both Manifest V3 (service_worker) and MV2 (scripts)
// Security principles:
// 1. No external network requests
// 2. No tracking or telemetry
// 3. Minimal permissions usage
// 4. Secure storage handling

// Detect if running as Service Worker or Background Script
const isServiceWorker = typeof ServiceWorkerGlobalScope !== 'undefined' && self instanceof ServiceWorkerGlobalScope;
const isBackgroundScript = typeof chrome !== 'undefined' || typeof browser !== 'undefined';

// Use appropriate browser API
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// Initialize default settings on install
browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'install') {
        await browser.storage.local.set({
            enabled: true,
            brightness: 90,
            excludedSites: [],
            version: '1.0.0'
        });

        // Open welcome page
        browser.tabs.create({
            url: browser.runtime.getURL('welcome.html')
        });
    }
});

// Handle messages from content scripts and popup
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getSettings') {
        browser.storage.local.get({
            enabled: true,
            brightness: 90,
            excludedSites: []
        }).then(settings => {
            sendResponse(settings);
        });
        return true;
    }

    if (message.action === 'updateSettings') {
        browser.storage.local.set(message.settings).then(() => {
            // Notify all tabs to update
            browser.tabs.query({}).then(tabs => {
                tabs.forEach(tab => {
                    browser.tabs.sendMessage(tab.id, {
                        action: 'toggleDarkMode'
                    }).catch(() => {
                        // Ignore errors for tabs that don't have content script
                    });
                });
            });
            sendResponse({ success: true });
        });
        return true;
    }

    if (message.action === 'excludeCurrentSite') {
        if (sender.tab) {
            const url = new URL(sender.tab.url);
            const hostname = url.hostname;

            browser.storage.local.get({ excludedSites: [] }).then(result => {
                const excludedSites = result.excludedSites;
                if (!excludedSites.includes(hostname)) {
                    excludedSites.push(hostname);
                    browser.storage.local.set({ excludedSites }).then(() => {
                        sendResponse({ success: true, hostname });
                    });
                } else {
                    sendResponse({ success: false, message: 'Already excluded' });
                }
            });
            return true;
        }
    }
});

// Context menu for quick exclude
browser.contextMenus.create({
    id: 'exclude-site',
    title: 'Exclude this site from dark mode',
    contexts: ['page']
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'exclude-site' && tab) {
        const url = new URL(tab.url);
        const hostname = url.hostname;

        browser.storage.local.get({ excludedSites: [] }).then(result => {
            const excludedSites = result.excludedSites;
            if (!excludedSites.includes(hostname)) {
                excludedSites.push(hostname);
                browser.storage.local.set({ excludedSites }).then(() => {
                    // Reload the tab
                    browser.tabs.reload(tab.id);
                });
            }
        });
    }
});

// Security: No external connections, no analytics, no tracking
// This extension operates entirely locally within the browser
