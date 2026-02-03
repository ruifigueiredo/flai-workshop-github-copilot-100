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
        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
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
