document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://127.0.0.1:5000/products';

    // Function to initialize DataTable
    function initializeDataTable() {
        const table = $('#product-table').DataTable({
            ajax: {
                url: apiUrl,
                dataSrc: 'products'
            },
            columns: [
                { data: 'name' },
                { data: 'price' },
                { data: 'stock' },
                {
                    data: null,
                    render: function (data, type, row) {
                        return `<button class="btn btn-warning btn-sm edit-btn" data-id="${row.id}">Edit</button>
                                <button class="btn btn-danger btn-sm delete-btn" data-id="${row.id}">Delete</button>`;
                    }
                }
            ]
        });

        // Event listener for edit button
        $('#product-table').on('click', '.edit-btn', function () {
            const productId = $(this).data('id');
            const newName = prompt('Enter new name:', table.row($(this).parents('tr')).data().name);
            const newPrice = prompt('Enter new price:', table.row($(this).parents('tr')).data().price);
            const newStock = prompt('Enter new stock:', table.row($(this).parents('tr')).data().stock);

            if (newName && newPrice && newStock) {
                const newData = { name: newName, price: newPrice, stock: newStock };

                fetch(`${apiUrl}/${productId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newData)
                })
                    .then(response => response.json())
                    .then(data => {
                        table.ajax.reload();
                    })
                    .catch(error => {
                        console.error('Error updating product:', error);
                    });
            }
        });

        // Event listener for delete button
        $('#product-table').on('click', '.delete-btn', function () {
            const productId = $(this).data('id');
            const confirmation = confirm('Are you sure you want to delete this product?');

            if (confirmation) {
                fetch(`${apiUrl}/${productId}`, {
                    method: 'DELETE'
                })
                    .then(response => response.json())
                    .then(data => {
                        table.ajax.reload();
                    })
                    .catch(error => {
                        console.error('Error deleting product:', error);
                    });
            }
        });
    }

    // Function to add product
    function addProduct(name, price, stock) {
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, price, stock })
        })
            .then(response => response.json())
            .then(data => {
                $('#product-table').DataTable().ajax.reload(); 
                document.getElementById('product-form').reset(); 
            })
            .catch(error => {
                console.error('Error adding product:', error);
            });
    }

    // Event listener for form submit
    document.getElementById('product-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const price = document.getElementById('price').value;
        const stock = document.getElementById('stock').value;

        addProduct(name, price, stock);
    });

    // Initialize DataTable
    initializeDataTable();
});
