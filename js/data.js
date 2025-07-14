/**
 * Data Module - Role and Location Data Management
 * Contains all data definitions and population functions
 */

/**
 * Role options data with clean IDs mapped to CSV values
 */
const ROLE_OPTIONS = [
    { value: 'accounting', text: 'Accounting', csvValue: 'Accounting' },
    { value: 'admin-support', text: 'Administrative Support', csvValue: 'Administrative Support' },
    { value: 'detailing', text: 'Detailing', csvValue: 'Detailing' },
    { value: 'document-control', text: 'Document Control', csvValue: 'Document Control' },
    { value: 'engineering', text: 'Engineering', csvValue: 'Engineering' },
    { value: 'estimating', text: 'Estimating', csvValue: 'Estimating' },
    { value: 'exec-leadership', text: 'Executive Leadership', csvValue: 'Executive Leadership' },
    { value: 'field-operations', text: 'Field Operations', csvValue: 'Field Operations' },
    { value: 'front-office', text: 'Front Office', csvValue: 'Front Office' },
    { value: 'hr', text: 'HR', csvValue: 'HR' },
    { value: 'it', text: 'IT', csvValue: 'IT' },
    { value: 'other', text: 'Other', csvValue: 'Other' },
    { value: 'precon-sales', text: 'Pre-Con/Sales', csvValue: 'Pre-Con/Sales' },
    { value: 'programmer', text: 'Programmer', csvValue: 'Programmer' },
    { value: 'project-mgmt', text: 'Project Management', csvValue: 'Project Management' },
    { value: 'purchasing', text: 'Purchasing', csvValue: 'Purchasing' },
    { value: 'quality-control', text: 'Quality Control', csvValue: 'Quality Control' },
    { value: 'receiving-super', text: 'Receiving Supervisor', csvValue: 'Receiving Supervisor' },
    { value: 'shipping-super', text: 'Shipping Supervisor', csvValue: 'Shipping Supervisor' },
    { value: 'shop-employee', text: 'Shop Employee', csvValue: 'Shop Employee' },
    { value: 'shop-leadership', text: 'Shop Leadership', csvValue: 'Shop Leadership' }
];

/**
 * Location options data with clean IDs mapped to CSV values
 */
const LOCATION_OPTIONS = [
    { value: 'allen-tx-o', text: 'Allen, TX', csvValue: 'Texas - Allen Office' },
    { value: 'atlanta-ga-o', text: 'Atlanta, GA', csvValue: 'Georgia - Atlanta Office' },
    { value: 'austin-tx-o', text: 'Austin, TX', csvValue: 'Texas - Austin Office' },
    { value: 'baltimore-md-o', text: 'Baltimore, MD (O)', csvValue: 'Maryland - Baltimore Office' },
    { value: 'baltimore-md-s', text: 'Baltimore, MD (S)', csvValue: 'Maryland - Baltimore Shop' },
    { value: 'brentwood-tn-o', text: 'Brentwood, TN', csvValue: 'Tennessee - Brentwood Office' },
    { value: 'charleston-sc-o', text: 'Charleston, SC', csvValue: 'South Carolina - Charleston Office' },
    { value: 'charlotte-nc-o', text: 'Charlotte, NC (Corporate)', csvValue: 'North Carolina - Charlotte Corporate Office (Westport and Old Dowd)' },
    { value: 'charlotte-nc-s', text: 'Charlotte, NC (S)', csvValue: 'North Carolina - Charlotte Shop' },
    { value: 'dublin-ga-s', text: 'Dublin, GA', csvValue: 'Georgia - Dublin Shop' },
    { value: 'durant-ok-s', text: 'Durant, OK', csvValue: 'Oklahoma - Durant Shop' },
    { value: 'emporia-va-s', text: 'Emporia, VA', csvValue: 'Virginia - Emporia Shop' },
    { value: 'fayetteville-nc', text: 'Fayetteville, NC', csvValue: 'North Carolina - Fayetteville' },
    { value: 'florence-sc-os', text: 'Florence, SC', csvValue: 'South Carolina - Florence Office and Shop' },
    { value: 'oakwood-tx-os', text: 'Oakwood, TX', csvValue: 'Texas - Oakwood Office and Shop' },
    { value: 'phoenix-az-o', text: 'Phoenix, AZ (O)', csvValue: 'Arizona - Phoenix Office' },
    { value: 'phoenix-az-s', text: 'Phoenix, AZ (S)', csvValue: 'Arizona - Phoenix Shop' },
    { value: 'portland-or-o', text: 'Portland, OR', csvValue: 'Oregon - Portland Office' },
    { value: 'raleigh-nc-o', text: 'Raleigh, NC', csvValue: 'North Carolina - Raleigh Office' },
    { value: 'roanoke-al-os', text: 'Roanoke, AL', csvValue: 'Alabama - Roanoke Office and Shop' },
    { value: 'specialty-metals', text: 'Specialty Metals', csvValue: 'South Carolina - Specialty Metals Division' },
    { value: 'spokane-wa-s', text: 'Spokane, WA', csvValue: 'Washington - Spokane Shop' },
    { value: 'tangent-or-os', text: 'Tangent, OR', csvValue: 'Oregon - Tangent Office and Shop' },
    { value: 'washington-dc-o', text: 'Washington, DC', csvValue: 'Virginia- - Washington DC Office' },
    { value: 'york-pa-s', text: 'York, PA', csvValue: 'Pennsylvania - York Shop' },
    { value: 'york-sc-os', text: 'York, SC', csvValue: 'South Carolina - York Office and Shop' },
];

/**
 * Default values for dropdowns - Currently unused, selects start empty
 */
const DEFAULT_VALUES = {
    role: 'project-mgmt',
    location: 'charlotte-nc-o'
};

/**
 * Lookup tables for bidirectional filtering
 */
let roleToLocations = {};
let locationToRoles = {};

/**
 * Build lookup tables from CSV data for bidirectional filtering
 * @param {Array} csvData - Array of survey response objects
 */
function buildLookupTables(csvData) {
    roleToLocations = {};
    locationToRoles = {};

    if (!csvData || csvData.length === 0) {
        return;
    }

    // Build the lookup tables
    csvData.forEach(row => {
        const role = row.Job_Role; // Role is stored in 'Job_Role' column
        const location = row.Location;

        if (!role || !location) return;

        // Build role -> locations mapping
        if (!roleToLocations[role]) {
            roleToLocations[role] = new Set();
        }
        roleToLocations[role].add(location);

        // Build location -> roles mapping
        if (!locationToRoles[location]) {
            locationToRoles[location] = new Set();
        }
        locationToRoles[location].add(role);
    });

    // Convert Sets to Arrays for easier handling
    Object.keys(roleToLocations).forEach(role => {
        roleToLocations[role] = Array.from(roleToLocations[role]);
    });

    Object.keys(locationToRoles).forEach(location => {
        locationToRoles[location] = Array.from(locationToRoles[location]);
    });

}

/**
 * Get available locations for selected roles
 * @param {Array} selectedRoles - Array of selected role CSV values
 * @returns {Array} Array of available location CSV values
 */
function getAvailableLocationsForRoles(selectedRoles) {
    if (!selectedRoles || selectedRoles.length === 0) {
        // If no roles selected, show all locations
        return LOCATION_OPTIONS.map(option => option.csvValue);
    }

    // Get intersection of locations for all selected roles
    let availableLocations = null;

    selectedRoles.forEach(role => {
        const locationsForRole = roleToLocations[role] || [];

        if (availableLocations === null) {
            availableLocations = [...locationsForRole];
        } else {
            // Find intersection
            availableLocations = availableLocations.filter(location =>
                locationsForRole.includes(location)
            );
        }
    });

    return availableLocations || [];
}

/**
 * Get available roles for selected locations
 * @param {Array} selectedLocations - Array of selected location CSV values
 * @returns {Array} Array of available role CSV values
 */
function getAvailableRolesForLocations(selectedLocations) {
    if (!selectedLocations || selectedLocations.length === 0) {
        // If no locations selected, show all roles
        return ROLE_OPTIONS.map(option => option.csvValue);
    }

    // Get intersection of roles for all selected locations
    let availableRoles = null;

    selectedLocations.forEach(location => {
        const rolesForLocation = locationToRoles[location] || [];

        if (availableRoles === null) {
            availableRoles = [...rolesForLocation];
        } else {
            // Find intersection
            availableRoles = availableRoles.filter(role =>
                rolesForLocation.includes(role)
            );
        }
    });

    return availableRoles || [];
}

/**
 * Clear all options from a select element
 * @param {HTMLElement} selectElement - The select element to clear
 */
function clearSelectOptions(selectElement) {
    const existingOptions = selectElement.querySelectorAll('sl-option');
    existingOptions.forEach(option => option.remove());
}

/**
 * Populate role select with comparison options
 * @param {HTMLElement} selectElement - The role select element
 * @param {Array} selectedLocations - Array of selected location CSV values for filtering
 */
function populateRoleOptions(selectElement, selectedLocations = []) {
    // Get available roles based on selected locations
    const availableRoleCsvValues = getAvailableRolesForLocations(selectedLocations);

    // Filter ROLE_OPTIONS to only include available roles
    const filteredRoleOptions = ROLE_OPTIONS.filter(option =>
        availableRoleCsvValues.includes(option.csvValue)
    );

    // Create options HTML string
    const optionsHTML = filteredRoleOptions.map(option =>
        `<sl-option value="${option.value}" data-csv-value="${option.csvValue}">${option.text}</sl-option>`
    ).join('');

    // Set innerHTML and let Shoelace handle the initialization
    selectElement.innerHTML = optionsHTML;

    if (filteredRoleOptions.length === 0) {
        selectElement.innerHTML = '<sl-option value="" disabled>No roles available for selected locations</sl-option>';
    }
}

/**
 * Populate location select with comparison options
 * @param {HTMLElement} selectElement - The location select element
 * @param {Array} selectedRoles - Array of selected role CSV values for filtering
 */
function populateLocationOptions(selectElement, selectedRoles = []) {
    // Preserve any existing HTML default value before populating options
    const existingValue = selectElement.value || selectElement.getAttribute('value');

    // Get available locations based on selected roles
    const availableLocationCsvValues = getAvailableLocationsForRoles(selectedRoles);

    // Filter LOCATION_OPTIONS to only include available locations
    const filteredLocationOptions = LOCATION_OPTIONS.filter(option =>
        availableLocationCsvValues.includes(option.csvValue)
    );

    // Create options HTML string
    const optionsHTML = filteredLocationOptions.map(option =>
        `<sl-option value="${option.value}" data-csv-value="${option.csvValue}">${option.text}</sl-option>`
    ).join('');

    // Set innerHTML and let Shoelace handle the initialization
    selectElement.innerHTML = optionsHTML;

    if (filteredLocationOptions.length === 0) {
        selectElement.innerHTML = '<sl-option value="" disabled>No locations available for selected roles</sl-option>';
    } else {
        // Restore the HTML default value if it exists and is still available
        if (existingValue) {
            const isValueAvailable = filteredLocationOptions.some(option => option.value === existingValue);
            if (isValueAvailable) {
                // Use setTimeout to ensure Shoelace has processed the new options
                setTimeout(() => {
                    selectElement.value = [existingValue];
                }, 50);
            }
        }
    }
}

/**
 * Get filtered data based on current filter settings
 * @returns {Array} Filtered CSV data
 */
function getFilteredData() {
    if (!window.DataModule.csvData) return [];

    // Get current filter state
    const filters = window.FiltersModule?.getCurrentFilterState() || {
        roleMode: 'all',
        locationMode: 'all',
        selectedRoles: [],
        selectedLocations: []
    };

    let filteredData = [...window.DataModule.csvData];

    // Apply role filter
    if (filters.roleMode === 'compare' && filters.selectedRoles.length > 0) {
        const roleCSVValues = filters.selectedRoles.map(roleValue => {
            const roleOption = ROLE_OPTIONS.find(option => option.value === roleValue);
            return roleOption ? roleOption.csvValue : null;
        }).filter(Boolean);

        filteredData = filteredData.filter(row => {
            return roleCSVValues.includes(row.Job_Role);
        });
    }

    // Apply location filter
    if (filters.locationMode === 'compare' && filters.selectedLocations.length > 0) {
        const locationCSVValues = filters.selectedLocations.map(locationValue => {
            const locationOption = LOCATION_OPTIONS.find(option => option.value === locationValue);
            return locationOption ? locationOption.csvValue : null;
        }).filter(Boolean);

        filteredData = filteredData.filter(row => {
            return locationCSVValues.includes(row.Location);
        });
    }

    return filteredData;
}

// Export functions for use in other modules
window.DataModule = {
    ROLE_OPTIONS,
    LOCATION_OPTIONS,
    DEFAULT_VALUES,
    populateRoleOptions,
    populateLocationOptions,
    clearSelectOptions,
    buildLookupTables,
    getAvailableLocationsForRoles,
    getAvailableRolesForLocations,
    getFilteredData,
    csvData: null, // Will be set when CSV loads
    ROLE_OPTIONS,
    LOCATION_OPTIONS
}; 