// Global state to track current view
let currentView = 'patient';

// View switching function
function switchView(view) {
    currentView = view;
    if (view === 'patient') {
        renderPatientView();
    } else {
        renderAdminView();
    }
}

// Patient View
function renderPatientView() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="patient-view">
            <h2>Patient Check-in</h2>
            <form id="patientForm" onsubmit="handlePatientCheckIn(event)">
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="card_number">Health Card Number</label>
                    <input type="text" id="card_number" name="card_number" required>
                </div>
                <div class="form-group">
                    <label for="medical_issue">Medical Issue</label>
                    <select id="medical_issue" name="medical_issue" required>
                        <option value="">Select Severity</option>
                        <option value="Emergency(Life Threatning)">Emergency(Life Threatning)</option>
                        <option value="Urgent">Urgent</option>
                        <option value="Non-Urgent">Non-Urgent</option>
                    </select>
                </div>
                <button type="submit">Check In</button>
            </form>
        </div>
    `;
}

// Admin View
function renderAdminView() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="admin-view">
            <h2>Admin Dashboard</h2>
            <div class="controls">
                <select id="filterSeverity" onchange="filterPatients()">
                    <option value="all">All Severities</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Urgent(Life Threatning)">Urgent(Life Threatning)</option>
                    <option value="Non-Urgent">Non-Urgent</option>
                </select>
                <button onclick="loadPatients()">Refresh List</button>
            </div>
            <div id="patientList">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Card Number</th>
                            <th>Medical Issue</th>
                            <th>Arrival Time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="patientTableBody">
                        <!-- Patient data will be loaded here -->
                    </tbody>
                </table>
            </div>
        </div>
    `;
    loadPatients();
}

// Handle patient check-in
async function handlePatientCheckIn(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    try {
        const response = await fetch('/api/patients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: formData.get('name'),
                card_number: formData.get('card_number'),
                medical_issue: formData.get('medical_issue')
            })
        });

        if (response.ok) {
            alert('Check-in successful!');
            form.reset();
        } else {
            alert('Error during check-in. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error during check-in. Please try again.');
    }
}

// Load patients for admin view
async function loadPatients() {
    try {
        const response = await fetch('/api/patients');
        const patients = await response.json();
        
        const tableBody = document.getElementById('patientTableBody');
        tableBody.innerHTML = patients.map(patient => `
            <tr>
                <td>${patient.name}</td>
                <td>${patient.card_number}</td>
                <td>${patient.medical_issue}</td>
                <td>${new Date(patient.arrival_time).toLocaleString()}</td>
                <td>
                    <button onclick="updatePatient(${patient.patient_id})">Update</button>
                    <button onclick="removePatient(${patient.patient_id})">Remove</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('patientList').innerHTML = 'Error loading patients';
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    renderPatientView(); // Show patient view by default
});

// Additional admin functions
async function updatePatient(patientId) {
    // Implement update functionality
    alert('Update functionality coming soon');
}

async function removePatient(patientId) {
    if (confirm('Are you sure you want to remove this patient?')) {
        try {
            const response = await fetch(`/api/patients/${patientId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                loadPatients(); // Refresh the list
            } else {
                alert('Error removing patient');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error removing patient');
        }
    }
}

function filterPatients() {
    // Implement filter functionality
    const severity = document.getElementById('filterSeverity').value;
    loadPatients(); // For now, just reload all patients
}