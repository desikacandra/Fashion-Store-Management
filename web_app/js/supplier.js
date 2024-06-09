document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'http://127.0.0.1:5000/suppliers';

    // Initialize DataTable
    const table = $('#supplier-table').DataTable({
        ajax: {
            url: apiUrl,
            dataSrc: 'suppliers'
        },
        columns: [
            { data: 'name' },
            { data: 'contact' },
            { data: 'email' },
            { 
                data: null,
                render: function (data, type, row) {
                    return `<button class="btn btn-warning btn-sm edit-btn" data-id="${row.id}">Edit</button>
                            <button class="btn btn-danger btn-sm delete-btn" data-id="${row.id}">Delete</button>`;
                }
            }
        ]
    });

    // Add Supplier
    document.getElementById('supplier-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const contact = document.getElementById('contact').value;
        const email = document.getElementById('email').value;

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, contact, email })
        })
        .then(response => response.json())
        .then(data => {
            table.ajax.reload();
            document.getElementById('supplier-form').reset();
        });
    });

    // Edit Action
    $('#supplier-table tbody').on('click', 'button.edit-btn', function() {
        const supplierId = $(this).data('id');
        const newName = prompt('Enter new name:');
        const newContact = prompt('Enter new contact:');
        const newEmail = prompt('Enter new email:');

        if (newName !== null && newContact !== null && newEmail !== null) {
            fetch(`${apiUrl}/${supplierId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: newName, contact: newContact, email: newEmail })
            })
            .then(response => response.json())
            .then(data => {
                table.ajax.reload();
            });
        }
    });

    // Delete Action
    $('#supplier-table tbody').on('click', 'button.delete-btn', function() {
        const supplierId = $(this).data('id');
        const confirmation = confirm('Are you sure you want to delete this supplier?');

        if (confirmation) {
            fetch(`${apiUrl}/${supplierId}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                table.ajax.reload();
            });
        }
    });
});
