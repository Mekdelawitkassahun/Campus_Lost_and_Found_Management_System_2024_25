document.addEventListener("DOMContentLoaded", () => {
    const claimsContainer = document.getElementById("claimsContainer");
  
    claimsContainer.addEventListener("click", async (event) => {
      const target = event.target;
  
      if (target.tagName === "BUTTON") {
        const claimId = target.getAttribute("data-id");
        const action = target.classList.contains("btn-success") ? "approve" : "reject";
        const url = `http://localhost:3000/claims/${claimId}/${action}`; // Replace with your actual backend URL
        const method = "PATCH";
  
        try {
          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Include a token if needed
            },
          });
  
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Something went wrong");
          }
  
          const result = await response.json();
          alert(`Claim ${action}ed successfully!`);
  
          // Update the UI
          if (action === "approve") {
            target.closest(".claim-card").remove(); // Remove the claim card on approval
          } else {
            const statusElement = target.closest(".claim-card").querySelector("p:nth-child(4)");
            statusElement.innerText = "Status: Rejected";
          }
        } catch (error) {
          console.error("Error:", error.message);
          alert(`Failed to ${action} claim: ${error.message}`);
        }
      }
    });
  });

  document.addEventListener("DOMContentLoaded", async () => {
    const claimsContainer = document.getElementById("claimsContainer");
  
    // Function to fetch claims from the backend
    async function fetchClaims() {
      try {
        const response = await fetch("http://localhost:3000/claims", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token if needed
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch claims");
        }
  
        const claims = await response.json();
        renderClaims(claims);
      } catch (error) {
        console.error("Error:", error.message);
        alert(`Error fetching claims: ${error.message}`);
      }
    }
  
    // Function to generate claim cards
    function renderClaims(claims) {
      claimsContainer.innerHTML = ""; // Clear existing content
      if (claims.length === 0) {
        claimsContainer.innerHTML = "<p>No claims available.</p>";
        return;
      }
  
      claims.forEach((claim) => {
        const claimCard = document.createElement("div");
        claimCard.classList.add("claim-card");
  
        claimCard.innerHTML = `
          <h4>Item Name: ${claim.lostItem?.name || "Unknown"}</h4>
          <p><strong>Claimant:</strong> ${claim.claimant || "Anonymous"}</p>
          <p><strong>Description:</strong> ${claim.lostItem?.description || "No description provided"}</p>
          <button class="btn btn-success" data-id="${claim.id}">Approve</button>
          <button class="btn btn-danger" data-id="${claim.id}">Reject</button>
        `;
  
        claimsContainer.appendChild(claimCard);
      });
    }
  
    // Call the fetchClaims function on page load
    await fetchClaims();
  
    // Add event listeners for approve/reject buttons (from previous implementation)
    claimsContainer.addEventListener("click", async (event) => {
      const target = event.target;
  
      if (target.tagName === "BUTTON") {
        const claimId = target.getAttribute("data-id");
        const action = target.classList.contains("btn-success") ? "approve" : "reject";
        const url = `http://localhost:3000/claims/${claimId}/${action}`;
  
        try {
          const response = await fetch(url, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
  
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Something went wrong");
          }
  
          alert(`Claim ${action}ed successfully!`);
          await fetchClaims(); // Refresh the claims list
        } catch (error) {
          console.error("Error:", error.message);
          alert(`Failed to ${action} claim: ${error.message}`);
        }
      }
    });
  });
  
  