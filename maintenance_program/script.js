// Wait until the HTML document is fully loaded and parsed
document.addEventListener('DOMContentLoaded', () => {

    // --- Get References to frequently used DOM Elements ---
    const boardContainer = document.getElementById('boardContainer');
    const addColumnContainer = document.querySelector('.add-column-container');
    const addColumnBtn = document.getElementById('addColumnBtn');
    const cardEditModalElement = document.getElementById('cardEditModal');
    const cardEditModal = new bootstrap.Modal(cardEditModalElement);

    // Navigation Buttons
    const showBoardBtn = document.getElementById('showBoardBtn');
    const showCustomersBtn = document.getElementById('showCustomersBtn');
    const showTechniciansBtn = document.getElementById('showTechniciansBtn');
    const quickAddJobBtn = document.getElementById('quickAddJobBtn');
    const navbarTitle = document.getElementById('navbarTitle');

    // Modal Fields - Customer Section
    const cardEditCustomerId = document.getElementById('cardEditCustomerId');
    const cardEditContactInfoDisplay = document.getElementById('cardEditContactInfoDisplay');
    const cardEditAddressDisplay = document.getElementById('cardEditAddressDisplay');

    // Quick Add Customer Elements
    const quickAddCustomerBtn = document.getElementById('quickAddCustomerBtn');
    const quickAddCustomerForm = document.getElementById('quickAddCustomerForm');
    const cancelQuickAddCustomer = document.getElementById('cancelQuickAddCustomer');
    const quickCustomerName = document.getElementById('quickCustomerName');
    const quickCustomerContact = document.getElementById('quickCustomerContact');
    const quickCustomerAddress = document.getElementById('quickCustomerAddress');
    const saveQuickAddCustomerBtn = document.getElementById('saveQuickAddCustomerBtn');

    // Modal Fields - Job Details
    const cardEditDescription = document.getElementById('cardEditDescription');
    const cardEditAppointmentTime = document.getElementById('cardEditAppointmentTime');
    const cardEditDueDate = document.getElementById('cardEditDueDate');
    const cardEditAssignee = document.getElementById('cardEditAssignee');
    const cardEditLabelsList = document.getElementById('cardEditLabelsList');

    // Quick Add Technician Elements
    const quickAddTechnicianBtn = document.getElementById('quickAddTechnicianBtn');
    const quickAddTechnicianForm = document.getElementById('quickAddTechnicianForm');
    const cancelQuickAddTechnician = document.getElementById('cancelQuickAddTechnician');
    const quickTechnicianName = document.getElementById('quickTechnicianName');
    const quickTechnicianColor = document.getElementById('quickTechnicianColor');
    const saveQuickAddTechnicianBtn = document.getElementById('saveQuickAddTechnicianBtn');

    // Modal Buttons & Label Creation
    const saveCardChangesBtn = document.getElementById('saveCardChangesBtn');
    const deleteCardBtn = document.getElementById('deleteCardBtn');
    const newLabelText = document.getElementById('newLabelText');
    const newLabelColorPalette = document.getElementById('newLabelColorPalette');
    const createLabelBtn = document.getElementById('createLabelBtn');

    // --- References for Customer Management ---
    const customerManagementSection = document.getElementById('customerManagementSection');
    const customerListContainer = document.getElementById('customerListContainer');
    const addEditCustomerFormContainer = document.getElementById('addEditCustomerFormContainer');
    const showAddCustomerFormBtn = document.getElementById('showAddCustomerFormBtn');
    const cancelCustomerFormBtn = document.getElementById('cancelCustomerFormBtn');
    const customerForm = document.getElementById('customerForm');
    const customerFormTitle = document.getElementById('customerFormTitle');
    const customerIdInput = document.getElementById('customerId');
    const customerNameInput = document.getElementById('customerName');
    const customerContactInput = document.getElementById('customerContact');
    const customerAddressInput = document.getElementById('customerAddress');
    const customerNotesInput = document.getElementById('customerNotes');
    const customerSearchInput = document.getElementById('customerSearchInput');

    // --- References for Technician Management ---
    const technicianManagementSection = document.getElementById('technicianManagementSection');
    const technicianListContainer = document.getElementById('technicianListContainer');
    const addEditTechnicianFormContainer = document.getElementById('addEditTechnicianFormContainer');
    const showAddTechnicianFormBtn = document.getElementById('showAddTechnicianFormBtn');
    const cancelTechnicianFormBtn = document.getElementById('cancelTechnicianFormBtn');
    const technicianForm = document.getElementById('technicianForm');
    const technicianFormTitle = document.getElementById('technicianFormTitle');
    const technicianIdInput = document.getElementById('technicianId');
    const technicianNameInput = document.getElementById('technicianName');
    const technicianPhoneInput = document.getElementById('technicianPhone');
    const technicianEmailInput = document.getElementById('technicianEmail');
    const technicianColorInput = document.getElementById('technicianColor');
    const technicianSpecialtiesInput = document.getElementById('technicianSpecialties');
    const technicianNotesInput = document.getElementById('technicianNotes');

    // --- References for Equipment Management (NEW) ---
    const addEquipmentBtn = document.getElementById('addEquipmentBtn');
    const equipmentListContainer = document.getElementById('equipmentListContainer');
    const equipmentFormContainer = document.getElementById('equipmentFormContainer');
    const equipmentFormTitle = document.getElementById('equipmentFormTitle');
    const equipmentForm = document.getElementById('equipmentForm');
    const cancelEquipmentFormBtn = document.getElementById('cancelEquipmentFormBtn'); // Top-right X button
    const cancelEquipmentFormBtnImplicit = document.getElementById('cancelEquipmentFormBtnImplicit'); // Explicit Cancel button
    const saveEquipmentFormBtn = document.getElementById('saveEquipmentFormBtn');
    const equipmentItemId = document.getElementById('equipmentItemId');
    const equipmentType = document.getElementById('equipmentType');
    const equipmentCategory = document.getElementById('equipmentCategory');
    const equipmentUnitNumber = document.getElementById('equipmentUnitNumber');
    const equipmentServes = document.getElementById('equipmentServes');
    const equipmentLocation = document.getElementById('equipmentLocation');
    const equipmentManufacturer = document.getElementById('equipmentManufacturer');
    const equipmentModel = document.getElementById('equipmentModel');
    const equipmentSerialNumber = document.getElementById('equipmentSerialNumber');
    const equipmentRefrigerantType = document.getElementById('equipmentRefrigerantType');
    const equipmentNotes = document.getElementById('equipmentNotes');

    // --- Application State Variables ---
    let currentEditingCard = null;
    let currentEditingColumnId = null;
    let columnCount = 0;
    let currentEditingCustomerId = null;
    let currentEditingTechnicianId = null;
    let filteredCustomers = []; // For search functionality
    let currentCardEquipment = []; // Holds equipment for the card being edited (NEW)
    let currentEditingEquipmentId = null; // (NEW)

    // --- Application Data ---
    const predefinedLabelColors = [
        '#dc3545', '#fd7e14', '#ffc107', '#198754', '#0dcaf0', '#0d6efd', '#6f42c1', '#d63384',
        '#6c757d', '#adb5bd', '#343a40', '#20c997'
    ];

    let availableLabels = [ // Default labels
        { id: 'lbl-1', text: 'Repair', color: '#dc3545' },
        { id: 'lbl-2', text: 'Maintenance', color: '#198754' },
        { id: 'lbl-3', text: 'Installation', color: '#0d6efd' },
        { id: 'lbl-4', text: 'Quote', color: '#ffc107' },
        { id: 'lbl-5', text: 'Emergency', color: '#fd7e14' },
        { id: 'lbl-6', text: 'Follow Up', color: '#6f42c1' },
    ];

    let selectedNewLabelColor = null;
    const LOCAL_STORAGE_KEY = 'hvacJobTrackerData';
    const CUSTOMER_DATA_KEY = 'hvacCustomerData';
    const TECHNICIAN_DATA_KEY = 'hvacTechnicianData';
    let customers = [];
    let technicians = [];

    // --- Core Utility Functions ---

    /** Shows an inline form (input) for adding/editing list titles. */
    function showInlineForm(container, inputType, placeholder, initialValue, onSave, onCancel) {
        hideInlineForm(container);
        const form = document.createElement('div');
        form.className = 'inline-form p-2 border rounded bg-light d-flex align-items-center';
        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.className = 'form-control form-control-sm me-2 flex-grow-1';
        inputElement.placeholder = placeholder;
        inputElement.value = initialValue;
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.className = 'btn btn-success btn-sm me-2';
        saveButton.onclick = () => {
            const value = inputElement.value.trim();
            if (value) {
                onSave(value);
                hideInlineForm(container);
            } else { inputElement.classList.add('is-invalid'); }
        };
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.className = 'btn btn-secondary btn-sm';
        cancelButton.onclick = () => {
            hideInlineForm(container);
            if (onCancel) onCancel();
        };
        inputElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); saveButton.click(); }
            else if (e.key === 'Escape') { cancelButton.click(); }
        });
        inputElement.addEventListener('input', () => inputElement.classList.remove('is-invalid'));
        form.appendChild(inputElement);
        form.appendChild(saveButton);
        form.appendChild(cancelButton);
        container.appendChild(form);
        inputElement.focus();
        inputElement.select();
    }

    /** Hides any inline form within a given container. */
    function hideInlineForm(container) {
        const existingForm = container.querySelector('.inline-form');
        if (existingForm) existingForm.remove();
    }

    /** Populates the assignee dropdown in the modal */
    function populateAssigneeDropdown(selectedTechnicianId = null) {
        cardEditAssignee.innerHTML = '<option selected value="">-- Unassigned --</option>';
        technicians.sort((a, b) => a.name.localeCompare(b.name));
        technicians.forEach(technician => {
            const option = document.createElement('option');
            option.value = technician.id;
            option.textContent = technician.name;
            if (technician.id === selectedTechnicianId) option.selected = true;
            cardEditAssignee.appendChild(option);
        });
    }

    /** Initializes SortableJS for drag-and-drop on a list element */
    const initSortable = (listElement) => {
        if (!listElement) { console.error("Attempted to initialize Sortable on a null element."); return; }
        new Sortable(listElement, {
            group: 'shared-cards',
            animation: 150,
            ghostClass: 'sortable-ghost',
            dragClass: 'sortable-drag',
            filter: '.modal, .inline-form', // Elements Sortable should ignore
            preventOnFilter: false, // Allow clicks on filtered elements
            onEnd: function (evt) { saveBoardState(); console.log('Card moved', evt); }
        });
    };

    /** Populates the color palette for creating new labels */
    function populateColorPalette() {
        newLabelColorPalette.innerHTML = '';
        predefinedLabelColors.forEach(color => {
            const square = document.createElement('span');
            square.className = 'color-palette-square';
            square.style.backgroundColor = color;
            square.dataset.color = color;
            square.addEventListener('click', handleColorSelection);
            newLabelColorPalette.appendChild(square);
        });
    }

    /** Handles clicking a color square in the palette */
    function handleColorSelection(event) {
        selectedNewLabelColor = event.target.dataset.color;
        const previouslySelected = newLabelColorPalette.querySelector('.selected');
        if (previouslySelected) previouslySelected.classList.remove('selected');
        event.target.classList.add('selected');
        newLabelColorPalette.classList.remove('border', 'border-danger');
    }

    /** Simple HTML escaping function */
    function escapeHtml(unsafe) {
        if (unsafe === null || unsafe === undefined) return '';
        return unsafe
            .toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /** Formats datetime-local string for display */
    function formatAppointmentTime(dateTimeString) {
        if (!dateTimeString) return '';
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
            }).replace(',', '');
        } catch (e) { console.error("Error formatting date:", dateTimeString, e); return dateTimeString; }
    }

    /**
     * Creates a new card element DOM structure.
     * Returns the HTMLElement, but doesn't populate visuals yet (updateCardVisuals does that).
     */
    function createCardElement(cardId = null) {
        const card = document.createElement('div');
        card.className = 'trello-card';
        card.draggable = true;

        // Assign a unique ID to the card
        card.dataset.cardId = cardId || `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Initialize essential data attributes
        card.dataset.customerId = '';
        card.dataset.technicianId = '';
        card.dataset.description = '';
        card.dataset.appointmentTime = '';
        card.dataset.dueDate = '';
        card.dataset.assignee = ''; // Storing assignee name for quicker display
        card.dataset.labels = '';
        card.dataset.equipment = '[]'; // Initialize equipment list as empty JSON array string (NEW)

        // Create basic inner HTML structure
        card.innerHTML = `
            <div class="card-content">
                <span class="card-customer-name">Loading...</span>
                <span class="card-job-type"></span>
                <span class="card-appointment-time"></span>
                <span class="card-address"></span>
            </div>
            <div class="card-details-footer"></div>
        `;

        return card;
    }

    /**
     * Updates the visual display elements of a card based on its data attributes.
     * @param {HTMLElement} cardElement The card element to update.
     */
    function updateCardVisuals(cardElement) {
        if (!cardElement || !cardElement.dataset) { console.error("Invalid cardElement passed to updateCardVisuals"); return; }

        // Get data attributes
        const customerId = cardElement.dataset.customerId;
        const technicianId = cardElement.dataset.technicianId || '';
        const appointmentTime = cardElement.dataset.appointmentTime || '';
        const dueDate = cardElement.dataset.dueDate || '';
        const assignee = cardElement.dataset.assignee || ''; // Use stored name
        const labelIds = (cardElement.dataset.labels || '').split(',').filter(id => id);

        // Find linked customer
        const customer = customers.find(c => c.id === customerId);
        const customerName = customer ? customer.name : 'Unknown Customer';
        const address = customer ? customer.address : '';

        // Get technician info (primarily for color)
        const technician = technicians.find(t => t.id === technicianId);
        const technicianColor = technician ? technician.color : '#6c757d'; // Default color

        // Find or create content div
        let contentDiv = cardElement.querySelector('.card-content');
        if (!contentDiv) {
            contentDiv = document.createElement('div');
            contentDiv.className = 'card-content';
            Array.from(cardElement.childNodes).forEach(node => { if (node.nodeType !== Node.ELEMENT_NODE) node.remove(); });
            cardElement.innerHTML = ''; // Ensure clean slate
            cardElement.appendChild(contentDiv);
        }

        // Find or create spans
        let nameSpan = contentDiv.querySelector('.card-customer-name') || document.createElement('span'); nameSpan.className = 'card-customer-name'; contentDiv.appendChild(nameSpan);
        let jobTypeSpan = contentDiv.querySelector('.card-job-type') || document.createElement('span'); jobTypeSpan.className = 'card-job-type'; contentDiv.appendChild(jobTypeSpan);
        let appointmentSpan = contentDiv.querySelector('.card-appointment-time') || document.createElement('span'); appointmentSpan.className = 'card-appointment-time'; contentDiv.appendChild(appointmentSpan);
        let addressSpan = contentDiv.querySelector('.card-address') || document.createElement('span'); addressSpan.className = 'card-address'; contentDiv.appendChild(addressSpan);

        // Find or create footer
        let footerDiv = cardElement.querySelector('.card-details-footer') || document.createElement('div'); footerDiv.className = 'card-details-footer'; cardElement.appendChild(footerDiv);

        // --- Populate Content Spans ---
        nameSpan.textContent = escapeHtml(customerName);
        addressSpan.textContent = escapeHtml(address); addressSpan.style.display = address ? 'block' : 'none';
        appointmentSpan.textContent = escapeHtml(formatAppointmentTime(appointmentTime)); appointmentSpan.style.display = appointmentTime ? 'block' : 'none';
        const primaryLabel = availableLabels.find(lbl => lbl.id === labelIds[0]);
        if (primaryLabel) {
            jobTypeSpan.textContent = escapeHtml(primaryLabel.text);

            // Apply the color from the label itself instead of using primary-color
            jobTypeSpan.style.backgroundColor = primaryLabel.color + '20'; // Add transparency to color
            jobTypeSpan.style.color = primaryLabel.color;
            jobTypeSpan.style.display = 'inline-block';
        } else {
            jobTypeSpan.textContent = 'Uncategorized';
            jobTypeSpan.style.backgroundColor = '#e9ecef';
            jobTypeSpan.style.color = '#6c757d';
            jobTypeSpan.style.display = 'inline-block';
        };
        // --- Populate Badges in Footer ---
        footerDiv.innerHTML = '';
        if (dueDate) {
            const dateBadge = document.createElement('span'); dateBadge.className = 'badge bg-secondary card-badge me-1'; dateBadge.textContent = `Due: ${escapeHtml(dueDate)}`; dateBadge.title = `Internal Due Date: ${escapeHtml(dueDate)}`; footerDiv.appendChild(dateBadge);
        }
        if (assignee) { // Use the stored assignee name
            const assigneeBadge = document.createElement('span'); assigneeBadge.className = 'badge card-badge'; assigneeBadge.style.backgroundColor = technicianColor; assigneeBadge.style.color = 'white'; assigneeBadge.textContent = `${escapeHtml(assignee)}`; assigneeBadge.title = `Assigned To: ${escapeHtml(assignee)}`; footerDiv.appendChild(assigneeBadge);
        }

        // Add customer ID as a title attribute
        cardElement.title = customerId ? `Customer ID: ${customerId}` : `No Customer Linked`;
    }

    /** Creates a label element for display in the modal */
    function createModalLabelElement(labelData, isSelected) {
        const labelElement = document.createElement('span');
        labelElement.className = 'modal-label';
        labelElement.style.backgroundColor = labelData.color;
        labelElement.textContent = escapeHtml(labelData.text);
        labelElement.dataset.labelId = labelData.id;
        if (isSelected) labelElement.classList.add('selected');
        labelElement.addEventListener('click', () => labelElement.classList.toggle('selected'));
        return labelElement;
    }

    /** Populates the customer dropdown in the edit modal */
    function populateCustomerDropdown(selectedCustomerId = null) {
        cardEditCustomerId.innerHTML = '<option value="">-- Select a Customer --</option>';
        customers.sort((a, b) => a.name.localeCompare(b.name));
        customers.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.id;
            option.textContent = escapeHtml(customer.name);
            if (customer.id === selectedCustomerId) option.selected = true;
            cardEditCustomerId.appendChild(option);
        });
        cardEditCustomerId.classList.remove('is-invalid');
    }

    /** Updates the read-only display fields in the modal based on selected customer */
    function updateModalCustomerDisplay(customerId) {
        const customer = customers.find(c => c.id === customerId);
        cardEditContactInfoDisplay.value = customer?.contact || '';
        cardEditAddressDisplay.value = customer?.address || '';
    }

    /**
     * Shows the modal to edit card details or add a new card.
     * @param {HTMLElement | null} cardElement - The card element to edit, or null if adding a new card.
     * @param {string | null} columnId - The ID of the column to add the new card to (only used if cardElement is null).
     */
    const showCardDetails = (cardElement, columnId = null) => {
        currentEditingCard = cardElement;
        currentEditingColumnId = cardElement ? null : columnId;
        currentCardEquipment = []; // Reset equipment list for the modal

        let cardData = {};
        let appliedLabelIds = [];
        let modalTitle = 'Add New Job';
        let linkedCustomerId = null;
        let linkedTechnicianId = null;

        if (cardElement) {
            modalTitle = 'Edit Job Details';
            cardData = { ...cardElement.dataset }; // Copy dataset
            appliedLabelIds = (cardData.labels || '').split(',').filter(id => id);
            linkedCustomerId = cardData.customerId || null;
            linkedTechnicianId = cardData.technicianId || null;

            // Load and parse equipment data (NEW)
            try {
                currentCardEquipment = JSON.parse(cardData.equipment || '[]');
                if (!Array.isArray(currentCardEquipment)) currentCardEquipment = [];
            } catch (e) { console.error("Error parsing equipment data:", e); currentCardEquipment = []; }

        } else {
            // Define default structure for a new card, including equipment
            cardData = {
                description: '',
                appointmentTime: '',
                dueDate: '',
                assignee: '', // Will be populated by dropdown selection if assigned
                labels: '',
                customerId: '',
                technicianId: '',
                equipment: '[]' // Start with empty equipment list string
            };
            linkedCustomerId = null;
            linkedTechnicianId = null;
        }

        // --- Populate Modal Fields ---
        document.getElementById('cardEditModalLabel').textContent = modalTitle;
        populateCustomerDropdown(linkedCustomerId);
        updateModalCustomerDisplay(linkedCustomerId);
        populateAssigneeDropdown(linkedTechnicianId);
        cardEditDescription.value = cardData.description || '';
        cardEditAppointmentTime.value = cardData.appointmentTime || '';
        cardEditDueDate.value = cardData.dueDate || '';

        // Populate labels
        cardEditLabelsList.innerHTML = '';
        availableLabels.forEach(labelData => {
            const isSelected = appliedLabelIds.includes(labelData.id);
            const labelElement = createModalLabelElement(labelData, isSelected);
            cardEditLabelsList.appendChild(labelElement);
        });

        // --- Populate Equipment List (NEW) ---
        renderEquipmentList();
        hideEquipmentForm(); // Ensure form is hidden initially

        // --- Reset Create Label Form ---
        newLabelText.value = '';
        selectedNewLabelColor = null;
        const selectedColorSquare = newLabelColorPalette.querySelector('.selected');
        if (selectedColorSquare) selectedColorSquare.classList.remove('selected');
        newLabelText.classList.remove('is-invalid');
        newLabelColorPalette.classList.remove('border', 'border-danger');
        const collapseElement = document.getElementById('createLabelCollapse');
        const collapseInstance = bootstrap.Collapse.getInstance(collapseElement);
        if (collapseInstance) collapseInstance.hide();


        // --- Hide quick add forms ---
        quickAddCustomerForm.style.display = 'none'; quickCustomerName.classList.remove('is-invalid');
        quickAddTechnicianForm.style.display = 'none'; quickTechnicianName.classList.remove('is-invalid');

        // --- Clear Validation States on Main Fields ---
        cardEditCustomerId.classList.remove('is-invalid');

        // --- Show the Modal ---
        cardEditModal.show();
    };

    /** Creates a new column (list) element */
    function createColumnElement(columnName, columnId = null) {
        // Generate a unique ID for the column if one isn't provided
        const internalId = columnId || `${columnName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
        columnCount++;

        const column = document.createElement('div');
        column.className = 'board-column';
        column.dataset.internalId = internalId;

        // Set the inner HTML structure for the column
        column.innerHTML = `
            <div class="column-header d-flex justify-content-between align-items-center">
                <span class="column-title">${escapeHtml(columnName)}</span>
                <div class="column-controls">
                    <button class="btn btn-sm btn-outline-secondary edit-column-btn" aria-label="Rename column">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-column-btn" aria-label="Delete column">
                      <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
            <div class="cards-container" data-column-id="${internalId}"></div>
            <div class="add-card-controls mt-2">
                <button class="btn btn-outline-primary btn-sm add-card-btn w-100">
                  <i class="bi bi-plus"></i> Add Job
                </button>
            </div>
        `;

        // Initialize SortableJS on the newly created cards container
        const newCardsContainer = column.querySelector('.cards-container');
        initSortable(newCardsContainer); // Ensure Sortable is initialized

        return column;
    }

    // --- View Switching Functions ---
    function showBoardView() {
        boardContainer.style.display = 'flex';
        customerManagementSection.style.display = 'none';
        technicianManagementSection.style.display = 'none';
        hideAddCustomerForm();
        hideAddTechnicianForm();
    }

    function showCustomerView() {
        boardContainer.style.display = 'none';
        customerManagementSection.style.display = 'block';
        technicianManagementSection.style.display = 'none';
        renderCustomerList(); // Initial render without search text
        hideAddTechnicianForm();
        customerSearchInput.value = ''; // Clear search on view switch
    }

    function showTechnicianView() {
        boardContainer.style.display = 'none';
        customerManagementSection.style.display = 'none';
        technicianManagementSection.style.display = 'block';
        renderTechnicianList();
        hideAddCustomerForm();
    }

    // --- Customer Data Functions ---

    /** Generates a unique ID for new customers */
    function generateCustomerId() {
        return `cust-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /** Renders the list of customers in the table */
    function renderCustomerList(searchText = '') {
        customerListContainer.innerHTML = '';

        // Filter customers if search text is provided
        filteredCustomers = searchText
            ? customers.filter(customer =>
                customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
                (customer.contact && customer.contact.toLowerCase().includes(searchText.toLowerCase())) ||
                (customer.address && customer.address.toLowerCase().includes(searchText.toLowerCase())) ||
                (customer.notes && customer.notes.toLowerCase().includes(searchText.toLowerCase()))
            )
            : [...customers]; // Use a copy of the full list if no search

        if (filteredCustomers.length === 0) {
            customerListContainer.innerHTML = searchText
                ? '<p class="text-muted text-center">No customers found matching your search.</p>'
                : '<p class="text-muted text-center">No customers added yet.</p>';
            return;
        }

        const table = document.createElement('table');
        table.className = 'table table-striped table-hover';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Address</th>
                    <th>Notes</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;
        const tbody = table.querySelector('tbody');

        // Sort filtered customers by name before rendering
        filteredCustomers.sort((a, b) => a.name.localeCompare(b.name));

        filteredCustomers.forEach(customer => {
            const row = tbody.insertRow();
            // Use escapeHtml to prevent XSS issues
            row.innerHTML = `
                <td>${escapeHtml(customer.name)}</td>
                <td>${escapeHtml(customer.contact || '')}</td>
                <td>${escapeHtml(customer.address || '')}</td>
                <td>${escapeHtml(customer.notes || '')}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary edit-customer-btn" data-customer-id="${escapeHtml(customer.id)}">
                      <i class="bi bi-pencil"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-customer-btn" data-customer-id="${escapeHtml(customer.id)}">
                      <i class="bi bi-trash"></i> Delete
                    </button>
                </td>
            `;
        });

        customerListContainer.appendChild(table);

        // Add event listeners for the newly added buttons
        addCustomerActionListeners();
    }

    /** Adds listeners to Edit/Delete buttons in the customer list */
    function addCustomerActionListeners() {
        // Use event delegation on the container for potentially dynamically added buttons
        customerListContainer.querySelectorAll('.edit-customer-btn').forEach(btn => {
            // Remove old listener before adding new one to prevent duplicates if re-rendering
            btn.removeEventListener('click', handleEditCustomerClick);
            btn.addEventListener('click', handleEditCustomerClick);
        });
        customerListContainer.querySelectorAll('.delete-customer-btn').forEach(btn => {
            // Remove old listener
            btn.removeEventListener('click', handleDeleteCustomerClick);
            btn.addEventListener('click', handleDeleteCustomerClick);
        });
    }

    // Named handlers for customer buttons
    function handleEditCustomerClick(e) {
        const customerId = e.target.closest('.edit-customer-btn').dataset.customerId;
        editCustomer(customerId);
    }

    function handleDeleteCustomerClick(e) {
        const customerId = e.target.closest('.delete-customer-btn').dataset.customerId;
        deleteCustomer(customerId);
    }

    /** Shows the form for adding/editing a customer */
    function showAddCustomerForm(customerData = null) {
        currentEditingCustomerId = customerData ? customerData.id : null;

        // Set form title and populate fields
        customerFormTitle.textContent = customerData ? 'Edit Customer' : 'Add New Customer';
        customerIdInput.value = customerData?.id || '';
        customerNameInput.value = customerData?.name || '';
        customerContactInput.value = customerData?.contact || '';
        customerAddressInput.value = customerData?.address || '';
        customerNotesInput.value = customerData?.notes || '';

        // Clear validation state and show the form
        customerNameInput.classList.remove('is-invalid');
        addEditCustomerFormContainer.style.display = 'block';
        customerNameInput.focus();
    }

    /** Hides the add/edit customer form */
    function hideAddCustomerForm() {
        addEditCustomerFormContainer.style.display = 'none';
        customerForm.reset();
        customerIdInput.value = '';
        currentEditingCustomerId = null;
        customerNameInput.classList.remove('is-invalid');
    }

    /** Handles the submission of the customer form (add or edit) */
    function handleCustomerFormSubmit(event) {
        event.preventDefault();

        const name = customerNameInput.value.trim();
        if (!name) { customerNameInput.classList.add('is-invalid'); return; }
        customerNameInput.classList.remove('is-invalid');

        // Gather data
        const customerData = {
            id: currentEditingCustomerId || generateCustomerId(),
            name: name,
            contact: customerContactInput.value.trim(),
            address: customerAddressInput.value.trim(),
            notes: customerNotesInput.value.trim()
        };

        if (currentEditingCustomerId) {
            // Editing
            const index = customers.findIndex(c => c.id === currentEditingCustomerId);
            if (index !== -1) customers[index] = customerData;
            else console.error("Customer not found for editing:", currentEditingCustomerId);
        } else {
            // Adding
            customers.push(customerData);
        }

        saveCustomers();
        renderCustomerList(customerSearchInput.value.trim()); // Re-render list with current filter
        populateCustomerDropdown(cardEditCustomerId.value); // Update job modal dropdown
        hideAddCustomerForm();
    }

    /** Opens the form to edit a specific customer */
    function editCustomer(customerId) {
        const customer = customers.find(c => c.id === customerId);
        if (customer) showAddCustomerForm(customer);
        else { console.error("Customer not found for editing:", customerId); alert("Could not find the customer to edit."); }
    }

    /** Deletes a customer after confirmation */
    function deleteCustomer(customerId) {
        const customerIndex = customers.findIndex(c => c.id === customerId);
        if (customerIndex === -1) { console.error("Customer not found for deletion:", customerId); alert("Could not find the customer to delete."); return; }

        const customerName = customers[customerIndex].name;
        if (!confirm(`Are you sure you want to delete customer "${escapeHtml(customerName)}"? This cannot be undone.`)) return;

        // Check if customer is used in any job cards
        const usedInCards = [];
        boardContainer.querySelectorAll('.trello-card').forEach(card => {
            if (card.dataset.customerId === customerId) usedInCards.push(card);
        });

        if (usedInCards.length > 0) {
            if (!confirm(`${escapeHtml(customerName)} is linked to ${usedInCards.length} job card(s). Deleting this customer will unlink them. Continue?`)) return;

            // Update affected cards (unlink customer)
            usedInCards.forEach(card => {
                card.dataset.customerId = '';
                updateCardVisuals(card); // Update card display
            });
            saveBoardState(); // Save changes to cards
        }

        // Remove customer
        customers.splice(customerIndex, 1);
        saveCustomers();
        renderCustomerList(customerSearchInput.value.trim()); // Update list view
        populateCustomerDropdown(cardEditCustomerId.value === customerId ? '' : cardEditCustomerId.value); // Update modal dropdown
        hideAddCustomerForm(); // Ensure form is hidden if it was open for this customer
    }

    /** Quick add customer directly from job edit modal */
    function handleQuickAddCustomer() {
        const name = quickCustomerName.value.trim();
        if (!name) { quickCustomerName.classList.add('is-invalid'); return false; }
        quickCustomerName.classList.remove('is-invalid');

        // Create new customer
        const newCustomer = {
            id: generateCustomerId(),
            name: name,
            contact: quickCustomerContact.value.trim(),
            address: quickCustomerAddress.value.trim(),
            notes: ''
        };

        customers.push(newCustomer);
        saveCustomers();

        // Clear form and hide it
        quickCustomerName.value = '';
        quickCustomerContact.value = '';
        quickCustomerAddress.value = '';
        quickAddCustomerForm.style.display = 'none';

        // Update dropdown and select the new customer
        populateCustomerDropdown(newCustomer.id);
        updateModalCustomerDisplay(newCustomer.id); // Update read-only fields

        return newCustomer.id; // Return ID for potential success message
    }

    // --- Technician Management Functions ---

    /** Generates a unique ID for new technicians */
    function generateTechnicianId() {
        return `tech-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /** Shows the form for adding/editing a technician */
    function showAddTechnicianForm(technicianData = null) {
        currentEditingTechnicianId = technicianData ? technicianData.id : null;

        // Set form title and populate fields
        technicianFormTitle.textContent = technicianData ? 'Edit Technician' : 'Add New Technician';
        technicianIdInput.value = technicianData?.id || '';
        technicianNameInput.value = technicianData?.name || '';
        technicianPhoneInput.value = technicianData?.phone || '';
        technicianEmailInput.value = technicianData?.email || '';
        technicianColorInput.value = technicianData?.color || '#0d6efd';
        technicianSpecialtiesInput.value = technicianData?.specialties || '';
        technicianNotesInput.value = technicianData?.notes || '';

        // Clear validation state and show the form
        technicianNameInput.classList.remove('is-invalid');
        addEditTechnicianFormContainer.style.display = 'block';
        technicianNameInput.focus();
    }

    /** Hides the add/edit technician form */
    function hideAddTechnicianForm() {
        addEditTechnicianFormContainer.style.display = 'none';
        technicianForm.reset();
        technicianIdInput.value = '';
        currentEditingTechnicianId = null;
        technicianNameInput.classList.remove('is-invalid');
    }

    /** Handles the submission of the technician form (add or edit) */
    function handleTechnicianFormSubmit(event) {
        event.preventDefault();

        const name = technicianNameInput.value.trim();
        if (!name) { technicianNameInput.classList.add('is-invalid'); return; }
        technicianNameInput.classList.remove('is-invalid');

        // Gather data
        const technicianData = {
            id: currentEditingTechnicianId || generateTechnicianId(),
            name: name,
            phone: technicianPhoneInput.value.trim(),
            email: technicianEmailInput.value.trim(),
            color: technicianColorInput.value,
            specialties: technicianSpecialtiesInput.value.trim(),
            notes: technicianNotesInput.value.trim()
        };

        if (currentEditingTechnicianId) {
            // Editing
            const index = technicians.findIndex(t => t.id === currentEditingTechnicianId);
            if (index !== -1) technicians[index] = technicianData;
            else console.error("Technician not found for editing:", currentEditingTechnicianId);
        } else {
            // Adding
            technicians.push(technicianData);
        }

        saveTechnicians();
        renderTechnicianList();
        populateAssigneeDropdown(cardEditAssignee.value); // Update job modal dropdown
        hideAddTechnicianForm();
    }

    /** Get initials from a name */
    function getInitials(name) {
        if (!name) return '';
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2) // Max 2 initials
            .join('');
    }

    /** Renders the list of technicians in the table */
    function renderTechnicianList() {
        technicianListContainer.innerHTML = '';

        if (technicians.length === 0) {
            technicianListContainer.innerHTML = '<p class="text-muted text-center">No technicians added yet.</p>';
            return;
        }

        const table = document.createElement('table');
        table.className = 'table table-striped table-hover';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Technician</th>
                    <th>Contact</th>
                    <th>Specialties</th>
                    <th>Notes</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        const tbody = table.querySelector('tbody');

        // Sort technicians by name
        technicians.sort((a, b) => a.name.localeCompare(b.name));

        technicians.forEach(technician => {
            const row = tbody.insertRow();
            const initials = getInitials(technician.name);
            // Use escapeHtml
            row.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <div class="tech-avatar" style="background-color: ${escapeHtml(technician.color)};">
                            ${escapeHtml(initials)}
                        </div>
                        ${escapeHtml(technician.name)}
                    </div>
                </td>
                <td>
                    ${technician.phone ? `<div class="small"><i class="bi bi-telephone me-1"></i>${escapeHtml(technician.phone)}</div>` : ''}
                    ${technician.email ? `<div class="small"><i class="bi bi-envelope me-1"></i>${escapeHtml(technician.email)}</div>` : ''}
                    ${!technician.phone && !technician.email ? '<span class="text-muted small">N/A</span>' : ''}
                </td>
                <td class="small">${escapeHtml(technician.specialties || '')}</td>
                <td class="small">${escapeHtml(technician.notes || '')}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary edit-technician-btn" data-technician-id="${escapeHtml(technician.id)}">
                        <i class="bi bi-pencil"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-technician-btn" data-technician-id="${escapeHtml(technician.id)}">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </td>
            `;
        });

        technicianListContainer.appendChild(table);
        addTechnicianActionListeners(); // Add listeners for new buttons
    }

    /** Adds listeners to Edit/Delete buttons in the technician list */
    function addTechnicianActionListeners() {
        technicianListContainer.querySelectorAll('.edit-technician-btn').forEach(btn => {
            btn.removeEventListener('click', handleEditTechnicianClick); // Prevent duplicates
            btn.addEventListener('click', handleEditTechnicianClick);
        });
        technicianListContainer.querySelectorAll('.delete-technician-btn').forEach(btn => {
            btn.removeEventListener('click', handleDeleteTechnicianClick); // Prevent duplicates
            btn.addEventListener('click', handleDeleteTechnicianClick);
        });
    }

    // Named handlers for technician buttons
    function handleEditTechnicianClick(e) {
        const technicianId = e.target.closest('.edit-technician-btn').dataset.technicianId;
        editTechnician(technicianId);
    }

    function handleDeleteTechnicianClick(e) {
        const technicianId = e.target.closest('.delete-technician-btn').dataset.technicianId;
        deleteTechnician(technicianId);
    }

    /** Opens the form to edit a specific technician */
    function editTechnician(technicianId) {
        const technician = technicians.find(t => t.id === technicianId);
        if (technician) showAddTechnicianForm(technician);
        else { console.error("Technician not found for editing:", technicianId); alert("Could not find the technician to edit."); }
    }

    /** Deletes a technician after confirmation */
    function deleteTechnician(technicianId) {
        const technicianIndex = technicians.findIndex(t => t.id === technicianId);
        if (technicianIndex === -1) { console.error("Technician not found for deletion:", technicianId); alert("Could not find the technician to delete."); return; }

        const technicianName = technicians[technicianIndex].name;
        if (!confirm(`Are you sure you want to delete technician "${escapeHtml(technicianName)}"? This cannot be undone.`)) return;

        // Check if technician is assigned to any job cards
        const usedInCards = [];
        boardContainer.querySelectorAll('.trello-card').forEach(card => {
            if (card.dataset.technicianId === technicianId) usedInCards.push(card);
        });

        if (usedInCards.length > 0) {
            if (!confirm(`${escapeHtml(technicianName)} is assigned to ${usedInCards.length} job(s). Deleting this technician will unassign them. Continue?`)) return;

            // Update affected cards (unassign technician)
            usedInCards.forEach(card => {
                card.dataset.technicianId = '';
                card.dataset.assignee = ''; // Clear stored name too
                updateCardVisuals(card);
            });
            saveBoardState(); // Save card changes
        }

        // Remove technician
        technicians.splice(technicianIndex, 1);
        saveTechnicians();
        renderTechnicianList();
        populateAssigneeDropdown(); // Update job modal dropdown (remove deleted tech)
        hideAddTechnicianForm();
    }

    /** Quick add technician directly from job edit modal */
    function handleQuickAddTechnician() {
        const name = quickTechnicianName.value.trim();
        if (!name) { quickTechnicianName.classList.add('is-invalid'); return false; }
        quickTechnicianName.classList.remove('is-invalid');


        // Create new technician
        const newTechnician = {
            id: generateTechnicianId(),
            name: name,
            phone: '', email: '',
            color: quickTechnicianColor.value,
            specialties: '', notes: ''
        };

        technicians.push(newTechnician);
        saveTechnicians();

        // Clear form and hide it
        quickTechnicianName.value = '';
        // Optionally reset color picker? quickTechnicianColor.value = '#0d6efd';
        quickAddTechnicianForm.style.display = 'none';

        // Update dropdown and select the new technician
        populateAssigneeDropdown(newTechnician.id);

        return newTechnician.id; // Return ID for potential success message
    }

    // --- Equipment Management Functions (NEW) ---

    /** Generates a unique ID for new equipment items within a card */
    function generateEquipmentId() {
        return `equip-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    }

    /** Renders the equipment list in the modal */
    function renderEquipmentList() {
        equipmentListContainer.innerHTML = '';
        if (currentCardEquipment.length === 0) {
            equipmentListContainer.innerHTML = '<p class="text-muted text-center small m-2">No equipment added yet.</p>';
            return;
        }

        currentCardEquipment.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'equipment-item';
            itemDiv.dataset.equipmentId = item.id;

            // Create info container
            const infoDiv = document.createElement('div');
            infoDiv.className = 'equipment-info';

            // Primary info
            const primaryInfo = document.createElement('div');
            primaryInfo.className = 'equipment-primary';
            let displayText = escapeHtml(item.type || 'N/A');
            if (item.unitNumber) displayText += ` (${escapeHtml(item.unitNumber)})`;
            primaryInfo.textContent = displayText;

            // Secondary info
            const secondaryInfo = document.createElement('div');
            secondaryInfo.className = 'equipment-secondary';
            let secondaryText = escapeHtml(item.category || 'N/A');
            if (item.location) secondaryText += ` - ${escapeHtml(item.location)}`;
            if (item.manufacturer) secondaryText += ` - Manufacturer: ${escapeHtml(item.manufacturer)}`;
            secondaryInfo.textContent = secondaryText;

            // Add info elements to container
            infoDiv.appendChild(primaryInfo);
            infoDiv.appendChild(secondaryInfo);

            // Create controls
            const controlsDiv = document.createElement('div');
            controlsDiv.className = 'equipment-controls';

            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.className = 'btn btn-sm btn-outline-secondary edit-equipment-btn';
            editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
            editBtn.ariaLabel = 'Edit Equipment';
            editBtn.addEventListener('click', () => editEquipmentItem(item.id));

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'btn btn-sm btn-outline-danger remove-equipment-btn';
            removeBtn.innerHTML = '<i class="bi bi-trash"></i>';
            removeBtn.ariaLabel = 'Remove Equipment';
            removeBtn.addEventListener('click', () => removeEquipmentItem(item.id));

            controlsDiv.appendChild(editBtn);
            controlsDiv.appendChild(removeBtn);

            // Assemble the item
            itemDiv.appendChild(infoDiv);
            itemDiv.appendChild(controlsDiv);
            equipmentListContainer.appendChild(itemDiv);
        });
    }

    /** Shows the equipment add/edit form */
    function showEquipmentForm(equipmentData = null) {
        currentEditingEquipmentId = equipmentData ? equipmentData.id : null;
        equipmentFormTitle.textContent = equipmentData ? 'Edit Equipment' : 'Add New Equipment';

        // Populate form fields from equipmentData or clear them
        equipmentItemId.value = equipmentData?.id || ''; // Store ID if editing
        equipmentType.value = equipmentData?.type || '';
        equipmentCategory.value = equipmentData?.category || '';
        equipmentUnitNumber.value = equipmentData?.unitNumber || '';
        equipmentServes.value = equipmentData?.serves || '';
        equipmentLocation.value = equipmentData?.location || '';
        equipmentManufacturer.value = equipmentData?.manufacturer || '';
        equipmentModel.value = equipmentData?.model || '';
        equipmentSerialNumber.value = equipmentData?.serialNumber || '';
        equipmentRefrigerantType.value = equipmentData?.refrigerantType || '';
        equipmentNotes.value = equipmentData?.notes || '';

        // Clear validation classes
        equipmentType.classList.remove('is-invalid');
        equipmentCategory.classList.remove('is-invalid');

        equipmentFormContainer.style.display = 'block';
        equipmentType.focus(); // Focus the first field
    }

    /** Hides the equipment add/edit form and resets it */
    function hideEquipmentForm() {
        equipmentForm.reset(); // Reset form fields to default values
        equipmentItemId.value = ''; // Clear hidden ID
        currentEditingEquipmentId = null; // Clear editing state
        equipmentFormContainer.style.display = 'none';
        // Clear validation classes
        equipmentType.classList.remove('is-invalid');
        equipmentCategory.classList.remove('is-invalid');
    }

    /** Handles saving equipment from the form */
    function handleSaveEquipment() {
        // --- Validation ---
        const typeValue = equipmentType.value.trim();
        const categoryValue = equipmentCategory.value;
        let isValid = true;
        // Clear previous validation
        equipmentType.classList.remove('is-invalid');
        equipmentCategory.classList.remove('is-invalid');

        if (!typeValue) {
            equipmentType.classList.add('is-invalid');
            isValid = false;
        }
        if (!categoryValue) {
            equipmentCategory.classList.add('is-invalid');
            isValid = false;
        }
        if (!isValid) return; // Stop if validation fails

        // --- Gather Data ---
        const equipmentData = {
            id: currentEditingEquipmentId || generateEquipmentId(), // Use existing ID or generate new one
            type: typeValue,
            category: categoryValue,
            unitNumber: equipmentUnitNumber.value.trim(),
            serves: equipmentServes.value.trim(),
            location: equipmentLocation.value.trim(),
            manufacturer: equipmentManufacturer.value.trim(),
            model: equipmentModel.value.trim(),
            serialNumber: equipmentSerialNumber.value.trim(),
            refrigerantType: equipmentRefrigerantType.value.trim(),
            notes: equipmentNotes.value.trim()
        };

        if (currentEditingEquipmentId) {
            // Editing existing item: Find and replace in the array
            const index = currentCardEquipment.findIndex(item => item.id === currentEditingEquipmentId);
            if (index !== -1) {
                currentCardEquipment[index] = equipmentData;
            } else {
                console.error("Couldn't find equipment item to update with ID:", currentEditingEquipmentId);
                // Optionally add it anyway, or show an error
                // currentCardEquipment.push(equipmentData); // Add if not found? Decide behavior.
            }
        } else {
            // Adding new item: Push to the array
            currentCardEquipment.push(equipmentData);
        }

        renderEquipmentList(); // Update the displayed list in the modal
        hideEquipmentForm();   // Hide the form
        // Note: Changes are only in memory (in currentCardEquipment) until the main modal "Save Job Details" is clicked
    }

    /** Opens the form to edit a specific equipment item */
    function editEquipmentItem(itemId) {
        const itemToEdit = currentCardEquipment.find(eq => eq.id === itemId);
        if (itemToEdit) {
            showEquipmentForm(itemToEdit); // Populate form with this item's data
        } else {
            console.error("Could not find equipment item to edit with ID:", itemId);
            alert("Error: Could not find the equipment item to edit.");
        }
    }

    /** Removes an equipment item from the list */
    function removeEquipmentItem(itemId) {
        // Find item details for confirmation message (optional)
        const itemToRemove = currentCardEquipment.find(eq => eq.id === itemId);
        const confirmMsg = itemToRemove
            ? `Are you sure you want to remove equipment: ${escapeHtml(itemToRemove.type || 'N/A')} ${itemToRemove.unitNumber ? `(${escapeHtml(itemToRemove.unitNumber)})` : ''}?`
            : `Are you sure you want to remove this equipment item?`;

        if (confirm(confirmMsg)) {
            currentCardEquipment = currentCardEquipment.filter(item => item.id !== itemId); // Filter out the item
            renderEquipmentList(); // Update the displayed list
            // Note: Changes are only in memory until the main modal "Save Job Details" is clicked
        }
    }

    // --- Persistence Functions ---

    /** Saves the current board state (columns, cards, labels, equipment) to localStorage. */
    function saveBoardState() {
        console.log("Saving board state...");
        try {
            const boardData = {
                columns: [],
                labels: availableLabels // Save current labels
            };

            boardContainer.querySelectorAll('.board-column').forEach(columnElement => {
                if (!columnElement.dataset || !columnElement.dataset.internalId) {
                    console.warn("Column missing data-internal-id during save:", columnElement); return;
                }
                const columnId = columnElement.dataset.internalId;
                const columnTitle = columnElement.querySelector('.column-title')?.textContent || '';
                const column = { id: columnId, name: columnTitle, cards: [] };

                columnElement.querySelectorAll('.cards-container .trello-card').forEach(cardElement => {
                    if (!cardElement.dataset || !cardElement.dataset.cardId) {
                        console.warn("Card missing data-card-id during save:", cardElement); return;
                    }
                    // Save all relevant data attributes, INCLUDING equipment string
                    const cardData = { ...cardElement.dataset };
                    // Ensure equipment is saved (should be updated before calling saveBoardState)
                    if (typeof cardData.equipment === 'undefined') {
                        console.warn(`Card ${cardData.cardId} missing equipment data during save. Saving empty array.`);
                        cardData.equipment = '[]';
                    }
                    column.cards.push(cardData);
                });
                boardData.columns.push(column);
            });

            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(boardData));
            console.log("Board state saved.");

        } catch (error) {
            console.error("Error saving board state:", error);
            alert("Error saving board state. Changes might be lost on refresh.");
        }
    }

    /** Loads board state (columns, cards, labels, equipment) from localStorage. */
    function loadBoardState() {
        console.log("Attempting to load board state...");
        try {
            const savedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (!savedDataString) {
                console.log("No saved board data found. Initializing default board.");
                initializeDefaultBoard();
                return;
            }

            const boardData = JSON.parse(savedDataString);

            // --- Load Labels ---
            if (boardData.labels && Array.isArray(boardData.labels) && boardData.labels.length > 0) {
                availableLabels = boardData.labels;
            } else {
                console.log("Using default labels (none found or invalid in saved data).");
                // Keep the default availableLabels defined earlier
            }
            populateColorPalette(); // Populate palette with loaded/default colors

            // --- Clear existing columns ---
            boardContainer.querySelectorAll('.board-column').forEach(col => col.remove());

            // --- Recreate Columns and Cards ---
            if (boardData.columns && Array.isArray(boardData.columns) && boardData.columns.length > 0) {
                boardData.columns.forEach(columnData => {
                    if (!columnData || !columnData.id || typeof columnData.name !== 'string') {
                        console.warn("Skipping invalid column data during load:", columnData); return;
                    }
                    const columnElement = createColumnElement(columnData.name, columnData.id);
                    const cardsContainer = columnElement.querySelector('.cards-container');

                    if (cardsContainer && columnData.cards && Array.isArray(columnData.cards)) {
                        columnData.cards.forEach(cardData => {
                            if (!cardData || !cardData.cardId) {
                                console.warn("Skipping invalid card data during load:", cardData); return;
                            }
                            // Create card element with ID
                            const cardElement = createCardElement(cardData.cardId);

                            // Restore *all* saved data attributes from 'cardData'
                            Object.keys(cardData).forEach(key => {
                                // Ensure equipment string is loaded correctly
                                if (key === 'equipment' && typeof cardData[key] !== 'string') {
                                    console.warn(`Invalid equipment data for card ${cardData.cardId}, resetting.`, cardData[key]);
                                    cardElement.dataset[key] = '[]';
                                } else {
                                    cardElement.dataset[key] = cardData[key];
                                }
                            });

                            // Make sure essential defaults exist if missing from saved data (backward compatibility)
                            if (!cardElement.dataset.equipment) cardElement.dataset.equipment = '[]';


                            cardsContainer.appendChild(cardElement);
                            // Note: updateCardVisuals will be called later after customers/techs are loaded
                        });
                    }
                    boardContainer.insertBefore(columnElement, addColumnContainer);
                });
            } else {
                console.log("Saved data contained no columns or columns array was invalid.");
                if (boardContainer.querySelectorAll('.board-column').length === 0) {
                    // If loading failed AND there are no columns, initialize default
                    initializeDefaultBoard();
                }
            }

            // --- Post-Load State Update ---
            columnCount = boardContainer.querySelectorAll('.board-column').length;
            console.log("Board structure loaded successfully. Visuals pending customer/technician data.");

        } catch (error) {
            console.error("Error loading board state:", error);
            localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear corrupted data
            alert("Error loading saved board data. Initializing a default board.");
            initializeDefaultBoard();
        }
    }

    /** Initializes a minimal default board if no saved data exists or loading fails. */
    // function initializeDefaultBoard() {
    //     console.log("Initializing default board structure...");
    //     populateColorPalette(); // Ensure palette is ready

    //     // Clear any potentially existing columns first
    //     boardContainer.querySelectorAll('.board-column').forEach(col => col.remove());

    //     // Create default columns
    //     const defaultColumns = ["To Do", "In Progress", "Done"];
    //     defaultColumns.forEach(title => {
    //         const defaultCol = createColumnElement(title);
    //         boardContainer.insertBefore(defaultCol, addColumnContainer);
    //     });

    //     columnCount = defaultColumns.length;


    //     console.log("Default board initialized.");
    //     // IMPORTANT: Save this default state immediately so it persists
    //     saveBoardState();
    // }

    /** Initializes a minimal default board if no saved data exists or loading fails. */
    function initializeDefaultBoard() {
        console.log("Initializing default board structure...");
        populateColorPalette(); // Ensure palette is ready

        // Clear any potentially existing columns first
        boardContainer.querySelectorAll('.board-column').forEach(col => col.remove());

        // Create default columns
        const defaultColumns = ["To Do", "In Progress", "Done"];
        const columns = [];

        defaultColumns.forEach(title => {
            const defaultCol = createColumnElement(title);
            boardContainer.insertBefore(defaultCol, addColumnContainer);
            columns.push(defaultCol);
        });

        // Add default cards after columns are created
        if (columns.length >= 2) {
            // Add two cards to the "To Do" column
            const toDoColumn = columns[0];
            const toDoCardsContainer = toDoColumn.querySelector('.cards-container');

            // First default card
            if (customers.length > 0) {
                const card1 = createCardElement();
                card1.dataset.customerId = customers[0].id;
                card1.dataset.description = "AC not cooling properly, making unusual noise";
                card1.dataset.appointmentTime = "2025-04-10T09:00";
                card1.dataset.labels = "lbl-1"; // Repair
                card1.dataset.dueDate = "2025-04-15";
                card1.dataset.equipment = JSON.stringify([{
                    id: generateEquipmentId(),
                    type: "Central AC Unit",
                    category: "Residential",
                    unitNumber: "AC-12345",
                    manufacturer: "CoolAir",
                    location: "Rooftop"
                }]);
                toDoCardsContainer.appendChild(card1);
                updateCardVisuals(card1);
            }

            // Second default card
            if (customers.length > 1) {
                const card2 = createCardElement();
                card2.dataset.customerId = customers[1].id;
                card2.dataset.description = "Annual maintenance check";
                card2.dataset.appointmentTime = "2025-04-15T13:30";
                card2.dataset.labels = "lbl-2"; // Maintenance
                card2.dataset.dueDate = "2025-04-20";
                toDoCardsContainer.appendChild(card2);
                updateCardVisuals(card2);
            }

            // Add one card to "In Progress" column
            const inProgressColumn = columns[1];
            const inProgressCardsContainer = inProgressColumn.querySelector('.cards-container');

            if (customers.length > 0 && technicians.length > 0) {
                const card3 = createCardElement();
                card3.dataset.customerId = customers[0].id;
                card3.dataset.technicianId = technicians[0].id;
                card3.dataset.assignee = technicians[0].name;
                card3.dataset.description = "Replacing furnace and upgrading thermostat";
                card3.dataset.labels = "lbl-3"; // Installation
                card3.dataset.dueDate = "2025-04-30";
                inProgressCardsContainer.appendChild(card3);
                updateCardVisuals(card3);
            }
        }

        columnCount = defaultColumns.length;
        console.log("Default board initialized with sample cards.");
        // IMPORTANT: Save this default state immediately so it persists
        saveBoardState();
    }

    // --- Customer Persistence Functions ---
    function saveCustomers() {
        console.log("Saving customer data...");
        try { localStorage.setItem(CUSTOMER_DATA_KEY, JSON.stringify(customers)); }
        catch (error) { console.error("Error saving customer data:", error); alert("Error saving customer data."); }
    }

    function loadCustomers() {
        console.log("Attempting to load customer data...");
        try {
            const savedCustomerData = localStorage.getItem(CUSTOMER_DATA_KEY);
            if (savedCustomerData) {
                customers = JSON.parse(savedCustomerData);
                if (!Array.isArray(customers)) { console.warn("Loaded customer data wasn't array, resetting."); customers = []; }
                console.log(`Customer data loaded (${customers.length} customers).`);
            } else {
                // Initialize with default customers if none found
                customers = [
                    { id: generateCustomerId(), name: 'Sample Customer A', contact: '555-1111', address: '1 Main St', notes: 'Prefers morning appointments' },
                    { id: generateCustomerId(), name: 'Sample Customer B', contact: '555-2222', address: '2 Oak Ave', notes: '' }
                ];
                saveCustomers(); // Save the defaults
                console.log("No saved customer data found. Initialized default customers.");
            }
        } catch (error) {
            console.error("Error loading customer data:", error);
            localStorage.removeItem(CUSTOMER_DATA_KEY);
            customers = []; // Start fresh on error
            alert("Error loading customer data. Starting with empty list.");
        }
    }

    // --- Technician Persistence Functions ---
    function saveTechnicians() {
        console.log("Saving technician data...");
        try { localStorage.setItem(TECHNICIAN_DATA_KEY, JSON.stringify(technicians)); }
        catch (error) { console.error("Error saving technician data:", error); alert("Error saving technician data."); }
    }

    function loadTechnicians() {
        console.log("Attempting to load technician data...");
        try {
            const savedTechnicianData = localStorage.getItem(TECHNICIAN_DATA_KEY);
            if (savedTechnicianData) {
                technicians = JSON.parse(savedTechnicianData);
                if (!Array.isArray(technicians)) { console.warn("Loaded technician data wasn't array, resetting."); technicians = []; }
                console.log(`Technician data loaded (${technicians.length} technicians).`);
            } else {
                // Initialize with default technicians
                technicians = [
                    { id: generateTechnicianId(), name: 'Alice Johnson', phone: '555-1234', email: 'alice@example.com', color: '#0d6efd', specialties: 'Installation, Repair', notes: '' },
                    { id: generateTechnicianId(), name: 'Bob Smith', phone: '555-5678', email: 'bob@example.com', color: '#198754', specialties: 'Maintenance, Commercial', notes: '' }
                ];
                saveTechnicians(); // Save defaults
                console.log("No saved technician data found. Initialized default technicians.");
            }
        } catch (error) {
            console.error("Error loading technician data:", error);
            localStorage.removeItem(TECHNICIAN_DATA_KEY);
            technicians = []; // Start fresh on error
            alert("Error loading technician data. Starting with empty list.");
        }
    }

    // --- Event Listeners Setup ---

    // Event Delegation for clicks within the main board container
    boardContainer.addEventListener('click', (event) => {
        const target = event.target;
        const addCardBtn = target.closest('.add-card-btn');
        const deleteColumnBtn = target.closest('.delete-column-btn');
        const editColumnBtn = target.closest('.edit-column-btn');
        // Ensure we don't trigger modal when clicking buttons inside the card or during drag
        const clickedCard = target.closest('.trello-card:not(.sortable-chosen):not(.sortable-drag)');

        // --- Handle "Add Job" Button Click ---
        if (addCardBtn) {
            const columnElement = addCardBtn.closest('.board-column');
            if (columnElement?.dataset?.internalId) {
                showCardDetails(null, columnElement.dataset.internalId);
            } else { console.error("Could not find column ID for Add Job button."); }
        }
        // --- Handle Column Delete Button Click ---
        else if (deleteColumnBtn) {
            const columnElement = deleteColumnBtn.closest('.board-column');
            if (columnElement) {
                const columnTitle = columnElement.querySelector('.column-title')?.textContent || 'this list';
                if (confirm(`Are you sure you want to delete list "${escapeHtml(columnTitle)}" and all its jobs?`)) {
                    columnElement.remove();
                    saveBoardState(); // PERSISTENCE
                }
            }
        }
        // --- Handle Column Edit Button Click (Initiate Rename) ---
        else if (editColumnBtn) {
            const columnHeader = editColumnBtn.closest('.column-header');
            if (!columnHeader) return;
            const columnTitleSpan = columnHeader.querySelector('.column-title');
            const columnControls = columnHeader.querySelector('.column-controls');
            const currentTitle = columnTitleSpan.textContent;

            columnTitleSpan.style.display = 'none';
            columnControls.style.display = 'none';

            showInlineForm(columnHeader, 'input', 'Enter new list title...', currentTitle,
                (newTitle) => { // onSave
                    columnTitleSpan.textContent = newTitle;
                    columnTitleSpan.style.display = '';
                    columnControls.style.display = '';
                    saveBoardState(); // PERSISTENCE
                },
                () => { // onCancel
                    columnTitleSpan.style.display = '';
                    columnControls.style.display = '';
                }
            );
        }
        // --- Handle Card Click (to open edit modal) ---
        // Check if the click was directly on the card & not on an interactive element within it
        else if (clickedCard && !target.closest('button, a, input, select, textarea, .badge, .modal-label, .edit-equipment-btn, .remove-equipment-btn')) {
            showCardDetails(clickedCard);
        }
    });

    // --- Listener for the main "Add New List" (column) button ---
    addColumnBtn.addEventListener('click', () => {
        addColumnBtn.style.display = 'none'; // Hide button
        showInlineForm(addColumnContainer, 'input', 'Enter list title...', '',
            (columnName) => { // onSave
                const newColumn = createColumnElement(columnName);
                boardContainer.insertBefore(newColumn, addColumnContainer);
                addColumnBtn.style.display = ''; // Show button again
                saveBoardState(); // PERSISTENCE
            },
            () => { // onCancel
                addColumnBtn.style.display = ''; // Show button again
            }
        );
    });

    // --- Navigation button listeners ---
    showBoardBtn.addEventListener('click', showBoardView);
    showCustomersBtn.addEventListener('click', showCustomerView);
    showTechniciansBtn.addEventListener('click', showTechnicianView);
    navbarTitle.addEventListener('click', showBoardView); // Click title to go to board

    // Quick Add Job button listener
    quickAddJobBtn.addEventListener('click', () => {
        const firstColumn = boardContainer.querySelector('.board-column'); // Find first column
        if (firstColumn?.dataset?.internalId) {
            showCardDetails(null, firstColumn.dataset.internalId); // Open modal for first column
        } else {
            alert("Please add a list (column) first before adding a job.");
        }
    });

    // --- Listener for Customer Selection Change in Modal ---
    cardEditCustomerId.addEventListener('change', (event) => {
        updateModalCustomerDisplay(event.target.value); // Update read-only fields
        cardEditCustomerId.classList.remove('is-invalid'); // Clear validation
    });

    // --- Quick Add Customer Listeners (in Modal) ---
    quickAddCustomerBtn.addEventListener('click', () => {
        quickAddCustomerForm.style.display = 'block';
        quickCustomerName.focus();
    });
    cancelQuickAddCustomer.addEventListener('click', () => {
        quickAddCustomerForm.style.display = 'none';
        quickCustomerName.value = ''; quickCustomerContact.value = ''; quickCustomerAddress.value = '';
        quickCustomerName.classList.remove('is-invalid');
    });
    saveQuickAddCustomerBtn.addEventListener('click', () => {
        const newCustomerId = handleQuickAddCustomer(); // Attempts to add/save
        if (newCustomerId) { // Show brief success feedback if added
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success alert-sm mt-2 mb-0 py-1 px-2'; // Smaller alert
            successMessage.textContent = 'Customer added!';
            saveQuickAddCustomerBtn.insertAdjacentElement('afterend', successMessage);
            setTimeout(() => { successMessage.remove(); }, 2500); // Remove after 2.5s
        }
    });

    // --- Quick Add Technician Listeners (in Modal) ---
    quickAddTechnicianBtn.addEventListener('click', () => {
        quickAddTechnicianForm.style.display = 'block';
        quickTechnicianName.focus();
    });
    cancelQuickAddTechnician.addEventListener('click', () => {
        quickAddTechnicianForm.style.display = 'none';
        quickTechnicianName.value = '';
        quickTechnicianName.classList.remove('is-invalid');
    });
    saveQuickAddTechnicianBtn.addEventListener('click', () => {
        const newTechnicianId = handleQuickAddTechnician();
        if (newTechnicianId) { // Show brief success feedback
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success alert-sm mt-2 mb-0 py-1 px-2';
            successMessage.textContent = 'Technician added!';
            saveQuickAddTechnicianBtn.insertAdjacentElement('afterend', successMessage);
            setTimeout(() => { successMessage.remove(); }, 2500);
        }
    });

    // --- Listener for "Save Changes" in the job modal ---
    saveCardChangesBtn.addEventListener('click', () => {
        // --- Validation ---
        const selectedCustomerId = cardEditCustomerId.value;
        if (!selectedCustomerId) { cardEditCustomerId.classList.add('is-invalid'); return; }
        cardEditCustomerId.classList.remove('is-invalid');

        // --- Gather Data ---
        const selectedLabelNodes = cardEditLabelsList.querySelectorAll('.modal-label.selected');
        const selectedLabelIds = Array.from(selectedLabelNodes).map(node => node.dataset.labelId);
        const selectedTechnicianId = cardEditAssignee.value;
        const selectedTechnician = technicians.find(t => t.id === selectedTechnicianId);

        // Gather all card data, including the stringified equipment list
        const cardData = {
            customerId: selectedCustomerId,
            technicianId: selectedTechnicianId,
            description: cardEditDescription.value.trim(),
            appointmentTime: cardEditAppointmentTime.value,
            dueDate: cardEditDueDate.value,
            assignee: selectedTechnician ? selectedTechnician.name : '', // Store name for display
            labels: selectedLabelIds.join(','),
            equipment: JSON.stringify(currentCardEquipment) // *** Save equipment array as string ***
        };

        if (currentEditingCard) {
            // --- Editing existing card ---
            Object.keys(cardData).forEach(key => {
                currentEditingCard.dataset[key] = cardData[key]; // Update dataset
            });
            updateCardVisuals(currentEditingCard); // Refresh card display
        } else if (currentEditingColumnId) {
            // --- Adding new card ---
            const newCard = createCardElement(); // Create basic structure
            const targetColumn = boardContainer.querySelector(`.board-column[data-internal-id="${currentEditingColumnId}"]`);
            const cardsContainer = targetColumn?.querySelector('.cards-container');

            if (cardsContainer) {
                Object.keys(cardData).forEach(key => { newCard.dataset[key] = cardData[key]; }); // Set dataset
                updateCardVisuals(newCard); // Populate visuals
                cardsContainer.appendChild(newCard); // Add to column
            } else { console.error("Target column not found:", currentEditingColumnId); alert("Error adding card."); cardEditModal.hide(); return; }
        } else { console.error("Save clicked without target card or column."); cardEditModal.hide(); return; }

        cardEditModal.hide();
        saveBoardState(); // PERSISTENCE for card add/edit
    });

    // --- Listener for "Delete Card" in the modal ---
    deleteCardBtn.addEventListener('click', () => {
        if (currentEditingCard) {
            if (confirm('Are you sure you want to delete this job? This cannot be undone.')) {
                const cardToRemove = currentEditingCard;
                currentEditingCard = null; // Clear reference first
                cardEditModal.hide();
                cardToRemove.remove();
                saveBoardState(); // PERSISTENCE
            }
        }
    });

    // --- Listener for when the modal has finished hiding ---
    cardEditModalElement.addEventListener('hidden.bs.modal', () => {
        // Reset state when modal closes completely
        currentEditingCard = null;
        currentEditingColumnId = null;
        currentCardEquipment = []; // Clear temporary equipment array (NEW)
        hideEquipmentForm(); // Ensure equipment form is hidden (NEW)
        // Clear validation states
        cardEditCustomerId.classList.remove('is-invalid');
        newLabelText.classList.remove('is-invalid');
        newLabelColorPalette.classList.remove('border', 'border-danger');
        quickCustomerName.classList.remove('is-invalid');
        quickTechnicianName.classList.remove('is-invalid');
        updateModalCustomerDisplay(null); // Clear read-only customer fields
        // Hide quick add forms that might be open
        quickAddCustomerForm.style.display = 'none';
        quickAddTechnicianForm.style.display = 'none';
    });

    // --- Listener for "Create & Apply" label button ---
    createLabelBtn.addEventListener('click', () => {
        const text = newLabelText.value.trim();
        let isValid = true;
        newLabelText.classList.remove('is-invalid');
        newLabelColorPalette.classList.remove('border', 'border-danger');

        if (!text) { newLabelText.classList.add('is-invalid'); isValid = false; }
        if (!selectedNewLabelColor) { newLabelColorPalette.classList.add('border', 'border-danger'); isValid = false; }
        if (text && availableLabels.some(lbl => lbl.text.toLowerCase() === text.toLowerCase())) {
            alert('A label with this name already exists.'); // Provide feedback
            newLabelText.classList.add('is-invalid'); isValid = false;
        }
        if (!isValid) return;

        const newLabelData = { id: `lbl-${Date.now()}`, text: text, color: selectedNewLabelColor };
        availableLabels.push(newLabelData);
        saveBoardState(); // PERSISTENCE for labels

        // Add to current modal selection and mark as selected
        const newLabelElement = createModalLabelElement(newLabelData, true); // Create and select
        cardEditLabelsList.appendChild(newLabelElement);

        // Reset form
        newLabelText.value = ''; selectedNewLabelColor = null;
        const selectedSquare = newLabelColorPalette.querySelector('.selected');
        if (selectedSquare) selectedSquare.classList.remove('selected');
        // Optionally hide collapse section
        bootstrap.Collapse.getInstance(document.getElementById('createLabelCollapse'))?.hide();
    });

    // --- Customer Management View Listeners ---
    showAddCustomerFormBtn.addEventListener('click', () => showAddCustomerForm());
    cancelCustomerFormBtn.addEventListener('click', hideAddCustomerForm);
    customerForm.addEventListener('submit', handleCustomerFormSubmit);
    customerNameInput.addEventListener('input', () => customerNameInput.classList.remove('is-invalid')); // Clear validation on input
    customerSearchInput.addEventListener('input', (e) => renderCustomerList(e.target.value.trim())); // Search functionality

    // --- Technician Management View Listeners ---
    showAddTechnicianFormBtn.addEventListener('click', () => showAddTechnicianForm());
    cancelTechnicianFormBtn.addEventListener('click', hideAddTechnicianForm);
    technicianForm.addEventListener('submit', handleTechnicianFormSubmit);
    technicianNameInput.addEventListener('input', () => technicianNameInput.classList.remove('is-invalid')); // Clear validation on input

    // --- Equipment Management Listeners (NEW) ---
    addEquipmentBtn.addEventListener('click', () => showEquipmentForm()); // Show empty form
    cancelEquipmentFormBtn.addEventListener('click', hideEquipmentForm); // Hide form via X button
    cancelEquipmentFormBtnImplicit.addEventListener('click', hideEquipmentForm); // Hide form via Cancel button
    saveEquipmentFormBtn.addEventListener('click', handleSaveEquipment); // Handle save/update

    // Clear validation on input for required equipment fields
    equipmentType.addEventListener('input', () => equipmentType.classList.remove('is-invalid'));
    equipmentCategory.addEventListener('change', () => equipmentCategory.classList.remove('is-invalid'));

    // --- Load State & Initialize ---
    console.log("Starting application initialization...");
    // 1. Load CUSTOMERS FIRST (needed for card visuals)
    loadCustomers();

    // 2. Load TECHNICIANS SECOND (needed for card visuals & dropdowns)
    loadTechnicians();

    // 3. Load BOARD state (columns, cards, labels)
    loadBoardState(); // This now also loads card datasets including equipment strings

    // 4. Update visuals for ALL loaded cards now that customer/tech data is available
    console.log("Updating visuals for all loaded cards...");
    boardContainer.querySelectorAll('.trello-card').forEach(card => {
        updateCardVisuals(card); // Populate names, dates, badges etc.
    });
    console.log("Card visuals updated.");

    // --- Initially show the board view ---
    showBoardView(); // Display the board by default
    console.log("Initialization complete. Application ready.");

}); // End DOMContentLoaded