// Function to show alert messages
function showAlert(message, className) {
    const div = document.createElement("div"); // Create a div element
    div.className = `alert alert-${className} alert-dismissible fade show`; // Set the class for the div
    div.setAttribute("role", "alert"); // Set the role attribute for accessibility
    div.innerHTML = `
        <strong>${message}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `; // Set the inner HTML of the div

    const container = document.querySelector(".container"); // Select the container
    const main = document.querySelector(".main"); // Select the main element
    container.insertBefore(div, main); // Insert the div before the main element

    setTimeout(() => {
        if (div.parentElement) {
            div.remove(); // Remove the div after 5 seconds
        }
    }, 5000);
}

let counter = 2; // Initialize counter for student IDs

// Event listener for deleting a student record
let deleteTarget = null; // Variable to store the row to be deleted

// Event listener for showing the delete confirmation modal
document.querySelector(".student-list").addEventListener("click", (e) => {
    let target = e.target;
    if (target.classList.contains("btn-danger")) {
        deleteTarget = target.closest("tr");
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        deleteModal.show();

        // Event listener for the confirmDelete button
        document.getElementById('confirmDelete').addEventListener('click', () => {
            if (deleteTarget) {
                deleteTarget.remove();
                updateStudentNumbers();
                showAlert("Student Data Deleted", "danger");
                deleteTarget = null;
            }
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            deleteModal.hide();
        });
    }
});

// Function to update student numbers
function updateStudentNumbers() {
    const rows = document.querySelectorAll('.student-list tr');
    rows.forEach((row, index) => {
        row.children[0].innerText = index + 1; // Update the student number
    });
}

// Input fields
const inputFields = {
    name: document.getElementById('floatingName'),
    gender: document.getElementById('floatingSelect'),
    age: document.getElementById('floatingAge'),
    email: document.getElementById('floatingEmail'),
    province: document.getElementById('floatingSelectProvince')
};
const tableBody = document.querySelector('.student-list'); // Select the table body

const addButton = document.getElementById('addnew'); // Select the add button

let editingRow = null; // Variable to store the row being edited

const clearButton = document.getElementById('clear'); // Select the clear button

// Function to clear all input fields
function clearFields() {
    Object.values(inputFields).forEach(input => {
        input.value = '';
    });
    editingRow = null;
    addButton.innerText = 'Add';
    addButton.classList.remove('btn-success');
    addButton.classList.add('btn-primary');
    clearButton.style.display = 'none'; // Hide the clear button
}

// Add event listener to the clear button
clearButton.addEventListener('click', clearFields);

// Function to handle input changes
function handleInputChange() {
    // Check if any input field has a value
    const hasValue = Object.values(inputFields).some(input => input.value.trim() !== '');
    clearButton.style.display = hasValue ? 'inline-block' : 'none'; // Show/hide the clear button
}

// Add event listeners to input fields
Object.values(inputFields).forEach(input => {
    input.addEventListener('input', handleInputChange);
});

// Function to handle add/update button clicks
function handleAddUpdate() {
    const values = { // Get the values from the input fields
        name: inputFields.name.value.trim(),
        gender: inputFields.gender.value.trim(),
        age: inputFields.age.value.trim(),
        email: inputFields.email.value.trim(),
        province: inputFields.province.value.trim() 
    };

    let isValid = true; // Flag for validation
    let missingFields = []; // Array to store the names of missing fields

    // Check for empty fields
    for (let key in values) {
        if (values[key] === '') {
            missingFields.push(key);
            isValid = false;
        }
    }

    if (!isValid) {
        showAlert(`Please fill in all input fields. Missing: ${missingFields.join(', ')}`, "warning");
        return;
    }

    if (isEmailDuplicate(values.email) && (!editingRow || editingRow.children[4].innerText.toLowerCase() !== values.email.toLowerCase())) {
        showAlert("Email already exists", "danger");
        inputFields.email.focus();
        return;
    }

    // Validation checks
    if (!/^[A-Za-z\s]+$/.test(values.name)) {
        showAlert("Invalid name", "danger");
        inputFields.name.focus();   
        isValid = false;
    } else if (values.name.length < 5) {
        showAlert("Name must be at least 5 characters", "danger");
        inputFields.name.focus();
        isValid = false;
    } else if (values.name.length > 35) {
        showAlert("Name must not exceed 35 characters", "danger");
        inputFields.name.focus();
        isValid = false;
    } else if (!/^(?:(?:[A-Za-z]+ ?){0,2}[A-Za-z]+)?$/.test(values.name)) {
        showAlert("Name must contain only letters and at most 2 spaces", "danger");
        inputFields.name.focus();
        isValid = false;
    } else if (!/^\d{1,2}$/.test(values.age)) {
        showAlert("Age must be a valid number", "danger");
        inputFields.age.focus();
        isValid = false;
    } else if (!(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/).test(values.email)) {
        showAlert("Please input valid email", "danger");
        inputFields.email.focus();
        isValid = false;
    } else if (!values.province) {
        showAlert("Please select a province", "danger");
        inputFields.province.focus();
        isValid = false;
    } 

    if (!isValid) return;

    if (editingRow) {
        // Show confirmation modal for update
        const updateModal = new bootstrap.Modal(document.getElementById('updateModal'));
        updateModal.show();

        // Event listener for the confirmUpdate button
        const confirmUpdateButton = document.getElementById('confirmUpdate');
        // Remove existing listeners to prevent multiple bindings
        confirmUpdateButton.replaceWith(confirmUpdateButton.cloneNode(true));
        document.getElementById('confirmUpdate').addEventListener('click', () => {
            // Update the existing row with new values
            editingRow.children[1].innerText = values.name;
            editingRow.children[2].innerText = values.gender === "F" ? "F" : "M";
            editingRow.children[3].innerText = values.age;
            editingRow.children[4].innerText = values.email;
            editingRow.children[5].innerText = values.province;

            showAlert("Student Data Updated", "success");
            clearFields(); // Clear the input fields and reset the button
            updateModal.hide();
        });
    } else {
        // Create a new row and insert the data
        const newRow = document.createElement('tr');
        newRow.innerHTML = `    
            <td>${counter++}</td>
            <td>${values.name}</td>
            <td>${values.gender === "F" ? "F" : "M"}</td>
            <td>${values.age}</td>
            <td>${values.email}</td>
            <td>${values.province}</td>
            <td>
                <a href="#" class="btn btn-primary btn-sm">Edit</a>
                <a href="#" class="btn btn-danger btn-sm">Delete</a>
            </td>
        `;
        tableBody.appendChild(newRow); // Append the new row to the table
        showAlert("Data stored successfully", "success");
        clearFields(); // Clear the input fields and reset the button
    }
    updateStudentNumbers(); // Update student numbers
    clearButton.style.display = 'none'; // Hide the clear button
}

// Add event listener to the add/update button
addButton.addEventListener('click', handleAddUpdate);

// Event listener for editing a student record
tableBody.addEventListener("click", (e) => {
    let target = e.target;
    if (target.classList.contains("btn-primary")) { // Check if the clicked element has the class 'btn-primary'
        const row = target.closest("tr"); // Get the closest row
        editingRow = row; // Store the row being edited

        // Fill the input fields with the existing data
        inputFields.name.value = row.children[1].innerText;
        inputFields.gender.value = row.children[2].innerText === "F" ? "F" : "M";
        inputFields.age.value = row.children[3].innerText;
        inputFields.email.value = row.children[4].innerText;
        inputFields.province.value = row.children[5].innerText;

        // Change the add button to update button
        addButton.innerText = 'Update';
        addButton.classList.remove('btn-primary');
        addButton.classList.add('btn-success');

        clearButton.style.display = 'inline-block'; // Show the clear button
    }
});

// Input validation for the name field
inputFields.name.addEventListener("input", (event) => {
    event.target.value = event.target.value.replace(/[^a-zA-Z ]/g, "").slice(0, 35);
    if (event.target.value.length === 1 && event.target.value === " ") event.target.value = "";
    if (event.target.value.length < 2) return;
    event.target.value = event.target.value.split(" ").slice(0, 2).join(" ");
});

// Input validation for the email field
inputFields.email.addEventListener("input", (event) => {
    let inputValue = event.target.value;

    // Remove non-alphanumeric characters (except @ and .)
    inputValue = inputValue.replace(/[^a-zA-Z0-9@.]/g, "");
    if (inputValue.length === 1 && inputValue.match(/^\d$/)) {
        inputValue = "";
    }
    const digits = inputValue.replace(/[^0-9]/g, "");
    if (digits.length > 5) {
        inputValue = inputValue.slice(0, -1);
    }

    inputValue = inputValue.replace(/@/g, (match, index) => {
        if (index === 0) {
            return "";
        }
        return index === inputValue.indexOf("@") ? match : "";
    });
    inputValue = inputValue.replace(/\./g, (match, index) => {
        return index === inputValue.indexOf(".") ? match : "";
    });

    if (inputValue.includes("@")) {
        const atIndex = inputValue.indexOf("@");
        if (atIndex < 3) {
            inputValue = inputValue.slice(0, atIndex) + inputValue.slice(atIndex + 1);
        }
    }
    if (inputValue.endsWith(".com")) {
        event.preventDefault();
        return;
    }
    if (inputValue.includes(".")) {
        const atIndex = inputValue.indexOf(".");
        if (atIndex < 3) {
            inputValue = inputValue.slice(0, atIndex) + inputValue.slice(atIndex + 1);
        }
    }

    inputValue = inputValue.slice(0, 42).trim();
    event.target.value = inputValue;
});

// Input validation for the age field
inputFields.age.addEventListener("input", (event) => {
    let inputValue = event.target.value;

    // Remove non-numeric characters
    inputValue = inputValue.replace(/[^0-9]/g, "");

    // Check if the first character is 0
    if (inputValue.length === 1 && inputValue === "0") {
        inputValue = "";
    }

    // Limit the input length to 2 digits
    inputValue = inputValue.slice(0, 2);

    // Update the input field with the cleaned-up value
    event.target.value = inputValue;
});

// Function to check for duplicate emails
function isEmailDuplicate(email) {
    const tableRows = tableBody.rows;
    for (let i = 0; i < tableRows.length; i++) {
        const rowEmail = tableRows[i].children[4].innerText.toLowerCase();
        if (rowEmail === email.toLowerCase()) {
            return true;
        }
    }
    return false;
}