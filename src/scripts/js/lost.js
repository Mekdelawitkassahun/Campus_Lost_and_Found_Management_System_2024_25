document.addEventListener('DOMContentLoaded', () => {
    // Utility Functions
    function hideForm() {
        document.getElementById('formContainerAdmin').style.display = 'none';
    }

    function hideUpdateForm() {
        document.getElementById('updateFormContainerAdmin').style.display = 'none';
    }

    // Event Listeners
    setupAddItemListener();
    setupItemsContainerListeners();
    fetchLostItems();

    // Setup Add Item Listener
    function setupAddItemListener() {
        const addItemButtonAdmin = document.getElementById('addItemButtonAdmin');
        const formContainerAdmin = document.getElementById('formContainerAdmin');
        const form = document.getElementById('lostFoundFormAdmin');

        addItemButtonAdmin?.addEventListener('click', () => {
            formContainerAdmin.style.display = 'block';
        });

        form?.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData();
            const itemName = document.getElementById('itemNameAdmin')?.value;
            const description = document.getElementById('descriptionAdmin')?.value;
            const imageFile = document.getElementById('itemImageAdmin')?.files?.[0];
            const phoneNumber = document.getElementById('locationAdmin')?.value;

            formData.append('title', itemName || '');
            formData.append('description', description || '');
            formData.append('phoneNumber', phoneNumber || '');
            if (imageFile) formData.append('photo', imageFile);

            const token = localStorage.getItem('token');
            if (!token) {
                alert('You are not authenticated. Please log in.');
                return;
            }
            
            try {
                const response = await fetch('http://localhost:3000/lost-items', {
                    method: 'POST',
                    body: formData,
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    const error = await response.json();
                    alert(`Error: ${error.message || 'Failed to submit the item'}`);
                    return;
                }

                alert('Item added successfully!');
                form.reset();
                hideForm();
                fetchLostItems();
            } catch (error) {
                console.error('Error:', error);
                alert('Error submitting the item.');
            }
        });
    }

    // Fetch Lost Items
    async function fetchLostItems() {
        const itemsContainer = document.getElementById('itemsContainerAdmin');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You are not authenticated. Please log in.');
                return;
            }

            const response = await fetch('http://localhost:3000/lost-items', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch lost items');
            }

            const items = await response.json();
            renderLostItems(items);
        } catch (error) {
            console.error('Error:', error);
            alert(`Error fetching lost items: ${error.message}`);
        }
    }

    // Render Lost Items
    function renderLostItems(items) {
        const itemsContainer = document.getElementById('itemsContainerAdmin');
        itemsContainer.innerHTML = '';
        if (items.length === 0) {
            itemsContainer.innerHTML = '<p>No lost items available.</p>';
            return;
        }

        items.forEach((item) => {
            const itemCard = document.createElement('div');
            itemCard.classList.add('item-card', 'p-3', 'border', 'rounded');

            itemCard.innerHTML = `
                <img src="${`http://localhost:3000${item.photo}` || '../images/placeholder.png'}" alt="${item.title}" />
                <h5 class="mt-2">${item.title}</h5>
                <p>${item.description}</p>
                <div class="button-container">
                    <button class="btn btn-warning" data-id="${item.id}" data-action="update">Update</button>
                    <button class="btn btn-danger" data-id="${item.id}" data-action="delete">Delete</button>
                </div>
            `;

            itemsContainer.appendChild(itemCard);
        });
    }

    // Setup Item Container Listeners
    function setupItemsContainerListeners() {
        const itemsContainer = document.getElementById('itemsContainerAdmin');

        itemsContainer.addEventListener('click', (event) => {
            const target = event.target;
            const itemId = target.dataset.id;

            if (target.tagName === 'BUTTON') {
                if (target.dataset.action === 'update') {
                    showUpdateForm(itemId);
                } else if (target.dataset.action === 'delete') {
                    deleteItem(itemId);
                }
            }
        });
    }

    // Show Update Form
    function showUpdateForm(itemId) {
        const updateFormContainer = document.getElementById('updateFormContainerAdmin');
        const updateForm = document.getElementById('updateFormAdmin');

        updateFormContainer.style.display = 'block';

        updateForm.onsubmit = async (e) => {
            e.preventDefault();

            const updatedTitle = document.getElementById('updateTitle').value;
            const updatedDescription = document.getElementById('updateDescription').value;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3000/lost-items/${itemId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ title: updatedTitle, description: updatedDescription }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to update item');
                }

                alert('Item updated successfully!');
                hideUpdateForm();
                await fetchLostItems();
            } catch (error) {
                console.error('Error:', error);
                alert(`Failed to update item: ${error.message}`);
            }
        };
    }

    // Delete Item
    async function deleteItem(itemId) {
        const confirmDelete = confirm('Are you sure you want to delete this item?');
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/lost-items/${itemId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete item');
            }

            alert('Item deleted successfully!');
            await fetchLostItems();
        } catch (error) {
            console.error('Error:', error);
            alert(`Failed to delete item: ${error.message}`);
        }
    }
});
