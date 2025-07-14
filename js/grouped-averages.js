/**
 * Grouped Averages Module
 * Handles the calculation and display of survey component averages
 */

// Question group mappings
const QUESTION_GROUPS = {
    'Trust': ['Q3_num', 'Q4_num'],
    'Health': ['Q5_num', 'Q6_num'],
    'Relationships': ['Q7_num', 'Q8_num'],
    'Impact': ['Q9_num', 'Q10_num'],
    'Value': ['Q11_num', 'Q12_num'],
    'Engagement': ['Q13_num', 'Q14_num'],
    'Overall Satisfaction': ['Q17_num']
};

// Global variables
let baselineAverages = {};
let isTableInitialized = false;

/**
 * Calculate grouped averages for a given dataset
 * @param {Array} data - Array of survey response objects
 * @returns {Object} Object with group names as keys and averages as values
 */
function calculateGroupedAverages(data) {
    const groupedAverages = {};

    Object.keys(QUESTION_GROUPS).forEach(groupName => {
        const columns = QUESTION_GROUPS[groupName];
        let sum = 0;
        let count = 0;

        data.forEach((row, index) => {
            columns.forEach(col => {
                const value = parseFloat(row[col]);
                if (!isNaN(value)) {
                    sum += value;
                    count++;
                }
            });
        });

        const average = count > 0 ? sum / count : 0;
        groupedAverages[groupName] = average;
    });

    return groupedAverages;
}

/**
 * Create a table row for the grouped averages
 * @param {string} datasetName - Name of the dataset (e.g., "All Responses", "Filtered")
 * @param {Object} averages - Object with group averages
 * @param {boolean} isFiltered - Whether this is filtered data
 * @returns {HTMLTableRowElement} The created row element
 */
function createTableRow(datasetName, averages, isFiltered = false) {
    const row = document.createElement('tr');
    row.className = isFiltered ? 'filtered-row' : 'baseline-row';

    // Dataset name cell
    const datasetCell = document.createElement('td');
    datasetCell.className = 'dataset-name';
    datasetCell.textContent = datasetName;
    row.appendChild(datasetCell);

    // Average cells for each group
    Object.keys(QUESTION_GROUPS).forEach(groupName => {
        const cell = document.createElement('td');
        cell.className = 'group-average';

        const average = averages[groupName];
        cell.textContent = average.toFixed(1);

        // Apply conditional formatting if this is filtered data
        if (isFiltered && baselineAverages[groupName] !== undefined) {
            const baselineAvg = baselineAverages[groupName];
            if (average > baselineAvg) {
                cell.classList.add('score-green');
            } else if (average < baselineAvg) {
                cell.classList.add('score-red');
            } else {
                cell.classList.add('score-neutral');
            }
        }

        row.appendChild(cell);
    });

    return row;
}

/**
 * Update the grouped averages table
 * @param {Object} filters - Current filter state
 */
function updateGroupedAveragesTable(filters = null) {
    const tbody = document.getElementById('grouped-averages-tbody');
    if (!tbody) {
        console.error('Could not find grouped-averages-tbody element');
        return;
    }

    // Check if CSV data is available using the same pattern as KPI module
    if (!window.CSVLoaderModule || !window.CSVLoaderModule.isCSVDataLoaded()) {
        console.error('CSV data not loaded yet, skipping table update');
        return;
    }

    // Get data using the same pattern as other modules
    const allData = window.CSVLoaderModule.getCSVData();
    if (!allData || allData.length === 0) {
        console.error('No CSV data available for grouped averages table');
        return;
    }

    // Calculate baseline averages (always needed)
    const currentBaseline = calculateGroupedAverages(allData);

    // Store baseline for comparison
    if (!isTableInitialized) {
        baselineAverages = { ...currentBaseline };
        isTableInitialized = true;
    }

    // Clear existing rows
    tbody.innerHTML = '';

    // Get current comparison mode
    const comparisonMode = (window.DrawerModule && window.DrawerModule.getCurrentComparisonMode)
        ? window.DrawerModule.getCurrentComparisonMode()
        : 'baseline';

    // Update subtitle visibility based on comparison mode
    const subtitle = document.getElementById('grouped-averages-subtitle');
    if (subtitle) {
        if (comparisonMode === 'baseline') {
            subtitle.classList.remove('hidden');
        } else {
            subtitle.classList.add('hidden');
        }
    }

    // Handle different comparison modes
    if (comparisonMode === 'roles') {
        // Roles comparison mode - show individual role rows
        const selectedRoles = window.KPIModule.getSelectedComparisonItems('roles');
        if (selectedRoles && selectedRoles.length > 0) {
            selectedRoles.slice(0, 5).forEach(roleData => {
                const roleFilteredData = allData.filter(row => row.Job_Role === roleData.csvValue);
                if (roleFilteredData.length > 0) {
                    const roleAverages = calculateGroupedAverages(roleFilteredData);
                    const roleRow = createTableRow(roleData.displayName, roleAverages, true);
                    tbody.appendChild(roleRow);
                }
            });
        } else {
            // No roles selected, show empty state
            const emptyRow = document.createElement('tr');
            const emptyCell = document.createElement('td');
            emptyCell.colSpan = Object.keys(QUESTION_GROUPS).length + 1;
            emptyCell.textContent = 'Select roles to see comparison data';
            emptyCell.className = 'empty-state';
            emptyRow.appendChild(emptyCell);
            tbody.appendChild(emptyRow);
        }
    } else if (comparisonMode === 'location') {
        // Location comparison mode - show individual location rows
        const selectedLocations = window.KPIModule.getSelectedComparisonItems('location');
        if (selectedLocations && selectedLocations.length > 0) {
            selectedLocations.slice(0, 5).forEach(locationData => {
                const locationFilteredData = allData.filter(row => row.Location === locationData.csvValue);
                if (locationFilteredData.length > 0) {
                    const locationAverages = calculateGroupedAverages(locationFilteredData);
                    const locationRow = createTableRow(locationData.displayName, locationAverages, true);
                    tbody.appendChild(locationRow);
                }
            });
        } else {
            // No locations selected, show empty state
            const emptyRow = document.createElement('tr');
            const emptyCell = document.createElement('td');
            emptyCell.colSpan = Object.keys(QUESTION_GROUPS).length + 1;
            emptyCell.textContent = 'Select locations to see comparison data';
            emptyCell.className = 'empty-state';
            emptyRow.appendChild(emptyCell);
            tbody.appendChild(emptyRow);
        }
    } else {
        // Baseline mode - keep original behavior
        // Add baseline row
        const baselineRow = createTableRow('All Responses', baselineAverages, false);
        tbody.appendChild(baselineRow);

        // Check if filters are active (using same pattern as KPI module)
        const hasFilters = filters && (
            (filters.roleMode === 'compare' && filters.selectedRoles && filters.selectedRoles.length > 0) ||
            (filters.locationMode === 'compare' && filters.selectedLocations && filters.selectedLocations.length > 0)
        );

        if (hasFilters) {
            // Get filtered data using CSVLoaderModule
            const filteredData = window.CSVLoaderModule.getFilteredData(filters);

            if (filteredData.length > 0) {
                const filteredAverages = calculateGroupedAverages(filteredData);
                const filteredRow = createTableRow('Filtered Results', filteredAverages, true);
                tbody.appendChild(filteredRow);
            }
        }
    }
}

/**
 * Initialize the grouped averages table
 */
function initializeGroupedAveragesTable() {
    // Initial load with no filters
    updateGroupedAveragesTable();
}

// Export functions to global scope
window.updateGroupedAveragesTable = updateGroupedAveragesTable;
window.initializeGroupedAveragesTable = initializeGroupedAveragesTable;
window.calculateGroupedAverages = calculateGroupedAverages; 