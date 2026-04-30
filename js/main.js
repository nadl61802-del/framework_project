function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');

    if (sidebar) {
        sidebar.classList.toggle('collapsed');
    }
}

function syncSidebarActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const sidebarLinks = document.querySelectorAll('.sidebar ul li a');

    sidebarLinks.forEach((link) => {
        const linkPage = link.getAttribute('href');
        link.classList.toggle('active', linkPage === currentPage);
    });
}

function initializeSettingsToggles() {
    const defaultLabels = {
        openState: '\u0645\u0641\u062a\u0648\u062d',
        closedState: '\u0645\u063a\u0644\u0642',
        openBadge: '\u0627\u0644\u0645\u0648\u0642\u0639 \u064a\u0639\u0645\u0644',
        closedBadge: '\u0627\u0644\u0645\u0648\u0642\u0639 \u0645\u063a\u0644\u0642'
    };

    document.querySelectorAll('.settings-actions').forEach((action, index) => {
        const toggle = action.querySelector('.toggle-checkbox');
        const toggleLabel = action.querySelector('.settings-toggle');

        if (!toggle || action.dataset.toggleInitialized === 'true') {
            return;
        }

        const currentId = toggle.id?.trim();
        const duplicateCount = currentId
            ? document.querySelectorAll(`[id="${currentId}"]`).length
            : 0;

        if (toggleLabel) {
            if (!currentId || duplicateCount > 1) {
                const uniqueId = `settings-toggle-${index + 1}`;
                toggle.id = uniqueId;
                toggleLabel.setAttribute('for', uniqueId);
            } else if (toggleLabel.getAttribute('for') !== currentId) {
                toggleLabel.setAttribute('for', currentId);
            }
        }

        const scope = action.closest('[data-toggle-scope]')
            || action.closest('.settings-control')
            || action.parentElement
            || action;
        const stateText = action.querySelector('.settings-state');
        const statusBadge = scope?.querySelector('.status-badge');
        const statusBadgeText = statusBadge?.querySelector('.status-badge-text');
        const messageFieldId = action.dataset.closeMessageTarget || scope?.dataset.closeMessageTarget;
        const messageField = messageFieldId ? document.getElementById(messageFieldId) : null;
        const labels = {
            openState: action.dataset.openState || scope?.dataset.openState || defaultLabels.openState,
            closedState: action.dataset.closedState || scope?.dataset.closedState || defaultLabels.closedState,
            openBadge: action.dataset.openBadge || scope?.dataset.openBadge || defaultLabels.openBadge,
            closedBadge: action.dataset.closedBadge || scope?.dataset.closedBadge || defaultLabels.closedBadge
        };

        const updateToggleState = () => {
            const isOpen = toggle.checked;

            if (stateText) {
                stateText.textContent = isOpen ? labels.openState : labels.closedState;
                stateText.classList.toggle('is-open', isOpen);
                stateText.classList.toggle('is-closed', !isOpen);
            }

            if (statusBadge && statusBadgeText) {
                statusBadgeText.textContent = isOpen ? labels.openBadge : labels.closedBadge;
                statusBadge.classList.toggle('online', isOpen);
                statusBadge.classList.toggle('offline', !isOpen);
            }

            if (messageField) {
                messageField.placeholder = isOpen
                    ? 'Close Message Content'
                    : 'Type The Close Message Here';
            }
        };

        action.dataset.toggleInitialized = 'true';
        toggle.addEventListener('change', updateToggleState);
        updateToggleState();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    syncSidebarActiveLink();
    initializeSettingsToggles();
});
