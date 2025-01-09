document.addEventListener("DOMContentLoaded", () => {
    const claimsContainer = document.getElementById("claimsContainer") as HTMLElement;
  
    if (!claimsContainer) {
      console.error("Claims container not found!");
      return;
    }
  
    // Function to fetch claims from the backend
    const fetchClaims = async (): Promise<void> => {
      try {
        const response = await fetch("http://localhost:3000/claims", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`, // Include token if needed
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch claims");
        }
  
        const claims: Claim[] = await response.json();
        renderClaims(claims);
      } catch (error) {
        console.error("Error:", (error as Error).message);
        alert(`Error fetching claims: ${(error as Error).message}`);
      }
    };
  
    // Function to generate claim cards
    const renderClaims = (claims: Claim[]): void => {
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
    };
  
    // Add event listeners for approve/reject buttons
    claimsContainer.addEventListener("click", async (event: Event) => {
      const target = event.target as HTMLElement;
  
      if (target.tagName === "BUTTON") {
        const claimId = target.getAttribute("data-id");
        const action = target.classList.contains("btn-success") ? "approve" : "reject";
        const url = `http://localhost:3000/claims/${claimId}/${action}`;
  
        if (!claimId) {
          console.error("Claim ID not found!");
          return;
        }
  
        try {
          const response = await fetch(url, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          });
  
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Something went wrong");
          }
  
          alert(`Claim ${action}ed successfully!`);
          await fetchClaims(); // Refresh the claims list
        } catch (error) {
          console.error("Error:", (error as Error).message);
          alert(`Failed to ${action} claim: ${(error as Error).message}`);
        }
      }
    });
  
    // Call the fetchClaims function on page load
    fetchClaims();
  });
  
  // Define the structure of a claim
  interface Claim {
    id: string;
    claimant?: string;
    lostItem?: {
      name?: string;
      description?: string;
    };
  }
  