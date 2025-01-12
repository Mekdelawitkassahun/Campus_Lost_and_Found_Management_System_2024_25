document.addEventListener('DOMContentLoaded', () => {
    // Utility Functions
    function hideForm(): void {
        const formContainer = document.getElementById('formContainerAdmin') as HTMLElement;
        if (formContainer) formContainer.style.display = 'none';
    }

    function hideUpdateForm(): void {
        const updateFormContainer = document.getElementById('updateFormContainerAdmin') as HTMLElement;
        if (updateFormContainer) updateFormContainer.style.display = 'none';
    }

    // Event Listeners
    setupAddItemListener();
    setupItemsContainerListeners();
    fetchLostItems();

    // Setup Add Item Listener
    function setupAddItemListener(): void {
        const addItemButtonAdmin = document.getElementById('addItemButtonAdmin') as HTMLButtonElement | null;
        const formContainerAdmin = document.getElementById('formContainerAdmin') as HTMLElement | null;
        const form = document.getElementById('lostFoundFormAdmin') as HTMLFormElement | null;

        addItemButtonAdmin?.addEventListener('click', () => {
            if (formContainerAdmin) formContainerAdmin.style.display = 'block';
        });

        form?.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData();
            const itemName = (document.getElementById('itemNameAdmin') as HTMLInputElement | null)?.value;
            const description = (document.getElementById('descriptionAdmin') as HTMLInputElement | null)?.value;
            const imageFile = (document.getElementById('itemImageAdmin') as HTMLInputElement | null)?.files?.[0];
            const phoneNumber = (document.getElementById('locationAdmin') as HTMLInputElement | null)?.value;

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
    async function fetchLostItems(): Promise<void> {
        const itemsContainer = document.getElementById('itemsContainerAdmin') as HTMLElement | null;
        if (!itemsContainer) return;

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

            const items: LostItem[] = await response.json();
            renderLostItems(items);
        } catch (error) {
            console.error('Error:', error);
            alert(`Error fetching lost items: ${(error as Error).message}`);
        }
    }

    // Render Lost Items
    function renderLostItems(items: LostItem[]): void {
        const itemsContainer = document.getElementById('itemsContainerAdmin') as HTMLElement | null;
        if (!itemsContainer) return;

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
    function setupItemsContainerListeners(): void {
        const itemsContainer = document.getElementById('itemsContainerAdmin') as HTMLElement | null;
        if (!itemsContainer) return;

        itemsContainer.addEventListener('click', (event: Event) => {
            const target = event.target as HTMLElement;
            const itemId = target.dataset.id;

            if (target.tagName === 'BUTTON' && itemId) {
                if (target.dataset.action === 'update') {
                    showUpdateForm(itemId);
                } else if (target.dataset.action === 'delete') {
                    deleteItem(itemId);
                }
            }
        });
    }

    // Show Update Form
    function showUpdateForm(itemId: string): void {
        const updateFormContainer = document.getElementById('updateFormContainerAdmin') as HTMLElement | null;
        const updateForm = document.getElementById('updateFormAdmin') as HTMLFormElement | null;
        if (!updateFormContainer || !updateForm) return;

        updateFormContainer.style.display = 'block';

        updateForm.onsubmit = async (e: SubmitEvent) => {
            e.preventDefault();

            const updatedTitle = (document.getElementById('updateTitle') as HTMLInputElement | null)?.value;
            const updatedDescription = (document.getElementById('updateDescription') as HTMLInputElement | null)?.value;

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
                alert(`Failed to update item: ${(error as Error).message}`);
            }
        };
    }

    // Delete Item
    async function deleteItem(itemId: string): Promise<void> {
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
            alert(`Failed to delete item: ${(error as Error).message}`);
        }
    }
});

// Interfaces
interface LostItem {
    id: string;
    title: string;
    description: string;
    photo: string;
}
