document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;
        // Add sample activities if not already present
        if (Object.keys(activities).length === 0) {
          // Sports
          activities["Basketball"] = {
            description: "Team sport played on a rectangular court.",
            schedule: "Mondays 18:00-20:00",
            max_participants: 12,
            participants: []
          };
          activities["Swimming"] = {
            description: "Improve your swimming skills with a coach.",
            schedule: "Wednesdays 17:00-18:30",
            max_participants: 10,
            participants: []
          };
          // Artistic
          activities["Painting"] = {
            description: "Explore your creativity with acrylics and watercolors.",
            schedule: "Fridays 15:00-17:00",
            max_participants: 8,
            participants: []
          };
          activities["Photography"] = {
            description: "Learn the basics of digital photography.",
            schedule: "Saturdays 10:00-12:00",
            max_participants: 10,
            participants: []
          };
          // Intellectual
          activities["Chess Club"] = {
            description: "Challenge your mind with weekly chess matches.",
            schedule: "Tuesdays 16:00-18:00",
            max_participants: 16,
            participants: []
          };
          activities["Book Discussion"] = {
            description: "Join us to discuss a new book every month.",
            schedule: "Last Thursday of the month 19:00-20:30",
            max_participants: 20,
            participants: []
          };
        }

          // Build participants section HTML
          let participantsHTML = `<div class="participants-section">
            <h5>Participants</h5>
            <ul class="participants-list">
              ${details.participants.map(email => `
                <li class="participant-item">
                  <span class="participant-email">${email}</span>
                  <span class="delete-participant" title="Remove participant" data-activity="${name}" data-email="${email}">&#10060;</span>
                </li>
              `).join("")}
            </ul>
          </div>`;

          activityCard.innerHTML = `
            <h4>${name}</h4>
            <p>${details.description}</p>
            <p><strong>Schedule:</strong> ${details.schedule}</p>
            <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
            ${participantsHTML}
          `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });

        // Add event listeners for delete icons
        activitiesList.querySelectorAll('.delete-participant').forEach(icon => {
          icon.addEventListener('click', async (e) => {
            const activity = icon.getAttribute('data-activity');
            const email = icon.getAttribute('data-email');
            try {
              const response = await fetch(`/activities/${encodeURIComponent(activity)}/unregister?email=${encodeURIComponent(email)}`, {
                method: 'POST',
              });
              const result = await response.json();
              if (response.ok) {
                messageDiv.textContent = result.message || 'Participant removed.';
                messageDiv.className = 'success';
                fetchActivities();
              } else {
                messageDiv.textContent = result.detail || 'Failed to remove participant.';
                messageDiv.className = 'error';
              }
              messageDiv.classList.remove('hidden');
              setTimeout(() => {
                messageDiv.classList.add('hidden');
              }, 4000);
            } catch (error) {
              messageDiv.textContent = 'Error removing participant.';
              messageDiv.className = 'error';
              messageDiv.classList.remove('hidden');
            }
          });
        });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
        fetchActivities(); // Refresh activities list after successful signup
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
