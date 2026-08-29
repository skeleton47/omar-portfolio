/**
 * Projects Archive Filtering & Live Search Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    initProjectsFilter();
});

function initProjectsFilter() {
    const searchInput = document.getElementById('projectSearchInput');
    const clearBtn = document.getElementById('clearSearchBtn');
    const filterTabs = document.querySelectorAll('.filter-tab');
    const cards = document.querySelectorAll('.archive-card');
    const emptyState = document.getElementById('archiveEmptyState');

    let currentFilter = 'all';
    let searchQuery = '';

    function applyFilterAndSearch() {
        let visibleCount = 0;

        cards.forEach(card => {
            const category = card.getAttribute('data-category');
            const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();
            const textContent = card.textContent.toLowerCase();

            const matchesCategory = (currentFilter === 'all' || category === currentFilter);
            const matchesSearch = (!searchQuery || keywords.includes(searchQuery) || textContent.includes(searchQuery));

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (emptyState) {
            emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    // Category Tabs
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.getAttribute('data-filter') || 'all';
            applyFilterAndSearch();
        });
    });

    // Search Input
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim().toLowerCase();
            if (clearBtn) {
                clearBtn.style.display = searchQuery.length > 0 ? 'block' : 'none';
            }
            applyFilterAndSearch();
        });
    }

    // Clear Search
    if (clearBtn && searchInput) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchQuery = '';
            clearBtn.style.display = 'none';
            applyFilterAndSearch();
        });
    }

    // Reset All Filters Helper
    window.resetFilters = function() {
        if (searchInput) searchInput.value = '';
        searchQuery = '';
        if (clearBtn) clearBtn.style.display = 'none';
        currentFilter = 'all';
        filterTabs.forEach(t => {
            if (t.getAttribute('data-filter') === 'all') {
                t.classList.add('active');
            } else {
                t.classList.remove('active');
            }
        });
        applyFilterAndSearch();
    };
}
