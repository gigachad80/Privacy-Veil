// Privacy Veil - Popup Script
// Compatible with both Manifest V2 and V3
// Security: All operations are local, no external calls

// Detect browser API (firefox uses 'browser', chrome uses 'chrome')
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

const enableToggle = document.getElementById('enableToggle');
const brightnessSlider = document.getElementById('brightnessSlider');
const brightnessValue = document.getElementById('brightnessValue');
const excludeBtn = document.getElementById('excludeBtn');
const clearExcluded = document.getElementById('clearExcluded');
const excludedList = document.getElementById('excludedList');

// Load current settings
async function loadSettings() {
    try {
        const settings = await browserAPI.storage.local.get({
            enabled: true,
            brightness: 90,
            excludedSites: []
        });

        enableToggle.checked = settings.enabled;
        brightnessSlider.value = settings.brightness;
        brightnessValue.textContent = `${settings.brightness}%`;

        renderExcludedSites(settings.excludedSites);
    } catch (e) {
        console.error('Failed to load settings:', e);
    }
}

// Render excluded sites list
function renderExcludedSites(sites) {
    if (sites.length === 0) {
        excludedList.innerHTML = '<div style="color: #666; text-align: center; padding: 8px; font-size: 12px;">No excluded sites</div>';
        return;
    }

    excludedList.innerHTML = sites.map(site => `
    <div class="excluded-site">
      <span>${site}</span>
      <button class="remove-site" data-site="${site}">Remove</button>
    </div>
  `).join('');

    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-site').forEach(btn => {
        btn.addEventListener('click', () => removeSite(btn.dataset.site));
    });
}

// Save settings
async function saveSettings(updates) {
    try {
        await browserAPI.storage.local.set(updates);

        // Notify all tabs to update
        const tabs = await browserAPI.tabs.query({});
        for (const tab of tabs) {
            try {
                await browserAPI.tabs.sendMessage(tab.id, {
                    action: 'toggleDarkMode'
                });
            } catch (e) {
                // Ignore errors for privileged tabs
            }
        }
    } catch (e) {
        console.error('Failed to save settings:', e);
    }
}

// Event listeners
enableToggle.addEventListener('change', () => {
    saveSettings({ enabled: enableToggle.checked });
});

brightnessSlider.addEventListener('input', () => {
    const value = parseInt(brightnessSlider.value);
    brightnessValue.textContent = `${value}%`;
    saveSettings({ brightness: value });
});

excludeBtn.addEventListener('click', async () => {
    try {
        const [tab] = await browserAPI.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.url) {
            const url = new URL(tab.url);
            const hostname = url.hostname;

            const settings = await browserAPI.storage.local.get({ excludedSites: [] });
            const excludedSites = settings.excludedSites;

            if (!excludedSites.includes(hostname)) {
                excludedSites.push(hostname);
                await browserAPI.storage.local.set({ excludedSites });

                // Reload the current tab
                await browserAPI.tabs.reload(tab.id);

                // Update the list
                renderExcludedSites(excludedSites);
            } else {
                alert('This site is already excluded');
            }
        }
    } catch (e) {
        console.error('Failed to exclude site:', e);
        alert('Cannot exclude this type of page');
    }
});

clearExcluded.addEventListener('click', async () => {
    if (confirm('Remove all site exclusions?')) {
        await browserAPI.storage.local.set({ excludedSites: [] });
        renderExcludedSites([]);

        // Reload all tabs to apply dark mode
        const tabs = await browserAPI.tabs.query({});
        for (const tab of tabs) {
            try {
                await browserAPI.tabs.reload(tab.id);
            } catch (e) {
                // Ignore errors
            }
        }
    }
});

async function removeSite(hostname) {
    const settings = await browserAPI.storage.local.get({ excludedSites: [] });
    const excludedSites = settings.excludedSites.filter(site => site !== hostname);
    await browserAPI.storage.local.set({ excludedSites });
    renderExcludedSites(excludedSites);

    // Reload tabs with this hostname
    const tabs = await browserAPI.tabs.query({});
    for (const tab of tabs) {
        try {
            const url = new URL(tab.url);
            if (url.hostname === hostname) {
                await browserAPI.tabs.reload(tab.id);
            }
        } catch (e) {
            // Ignore errors
        }
    }
}

// Initialize
loadSettings();
