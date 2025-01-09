document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = './login.html'; // Redirect to login if no token
    }
  
    // Fetch the lost items from the API
    fetchLostItems();
  
    // Logout handler
    document.getElementById('logoutButton').addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = './index.html';
    });
  });
  
  // Function to fetch lost items
  async function fetchLostItems() {
    const token = localStorage.getItem('token');
    console.log(token)

    const BACKEND_URL = 'http://localhost:3000';
    const response = await fetch(`${BACKEND_URL}/lost-items`, {
    headers: {
        'Authorization': `Bearer ${token}`,
    },
});
  
    if (response.ok) {
      const items = await response.json();
      console.log()
      displayItems(items);
    } else {
      alert('Failed to load lost items');
    }
  }
  
  // Function to display lost items on the page
  function displayItems(items) {
    const itemsList = document.getElementById('itemsList');
    itemsList.innerHTML = ''; // Clear any existing items
  
    items.forEach(item => {
      const itemCard = document.createElement('div');
      itemCard.classList.add('col-md-4', 'mb-4');
      itemCard.innerHTML = `
        <div class="card">
        <img src="${`http://localhost:3000${item.photo}` || '../images/placeholder.png'}" alt="${item.title}" />
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
            <p class="card-text">${item.description}</p>
            <button class="btn btn-primary" onclick="openClaimModal(${item.id})">Claim</button>
          </div>
        </div>
      `;
      itemsList.appendChild(itemCard);
    });
  }
  
  // Function to open the claim modal
  function openClaimModal(itemId) {
    const claimModal = new bootstrap.Modal(document.getElementById('claimModal'));
    claimModal.show();
  
    // Handle claiming the item
    document.getElementById('confirmClaim').onclick = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You are not logged in! Please log in to claim an item.');
            return;
        }

        try {
      const response = await fetch(`http://localhost:3000/claims/${itemId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Claim submitted successfully!');
        claimModal.hide();
      } else {
        const errorData = await response.json();
        alert(`Failed to submit claim: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error during claim submission:', error);
      alert('An error occurred while submitting the claim.');
    }
    };
  }