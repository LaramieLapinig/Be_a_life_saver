document.addEventListener("DOMContentLoaded", () => {
  let isAdminLoggedIn = localStorage.getItem("loggedIn") === "true";
  let deletedResources = [];
  let deletedEvents = [];

  const defaultResources = [
    { title: "Bandaging", type: "Video", link: "https://www.youtube.com/watch?v=Ij0aJmhzTHg" },
    { title: "Packaging", type: "Video", link: "https://youtu.be/BRRsfxtCVdU" },
    { title: "Carrying", type: "Video", link: "https://youtu.be/NW9tgYRdNUc" },
  ];

  const defaultEvents = [
    { title: "First Aid Training", location: "JRMSU Dapitan Campus", date: "2025-05-03" },
    { title: "Disaster Drill", location: "JRMSU Katipunan Campus", date: "2026-05-07" },
    { title: "NSED", location: "JRMSU Katipunan Campus", date: "2026-05-11" },
  ];

  let resources = JSON.parse(localStorage.getItem("resources"));
  if (!Array.isArray(resources)) {
    resources = defaultResources;
    localStorage.setItem("resources", JSON.stringify(resources));
  }

  let events = JSON.parse(localStorage.getItem("events"));
  if (!Array.isArray(events) || events.some(e => !e.location)) {
    events = defaultEvents;
    localStorage.setItem("events", JSON.stringify(events));
  }

  const renderResources = () => {
    const resourcesDiv = document.getElementById("resources");
    resourcesDiv.innerHTML = "";
    resources.forEach((res, index) => {
      const div = document.createElement("div");
      div.classList.add("resource-item");
      div.innerHTML = `
        <strong>${res.title}</strong> (${res.type}) - 
        <a href="${res.link}" target="_blank">View</a>
      `;
      div.style.fontSize = "18px";
      div.style.fontFamily = "'Arial', sans-serif";
      div.style.letterSpacing = "1px";
      div.style.marginBottom = "10px";

      if (isAdminLoggedIn) {
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "🗑️ Delete";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.onclick = () => {
          if (confirm("Are you sure you want to delete this resource?")) {
            deletedResources.push(resources.splice(index, 1)[0]);
            localStorage.setItem("resources", JSON.stringify(resources));
            renderResources();
          }
        };
        div.appendChild(deleteBtn);
      }

      resourcesDiv.appendChild(div);
    });

    if (isAdminLoggedIn && deletedResources.length > 0) {
      const undoBtn = document.createElement("button");
      undoBtn.innerHTML = "🔄 Undo Delete";
      undoBtn.style.marginTop = "10px";
      undoBtn.onclick = () => {
        const restored = deletedResources.pop();
        if (restored) {
          resources.push(restored);
          localStorage.setItem("resources", JSON.stringify(resources));
          renderResources();
        }
      };
      resourcesDiv.appendChild(undoBtn);
    }

    if (isAdminLoggedIn) {
      const formDiv = document.createElement("div");
      formDiv.style.marginTop = "20px";
      formDiv.innerHTML = `
        <h3>Add New Resource</h3>
        <input type="text" id="newResourceTitle" placeholder="Resource Title" required>
        <input type="text" id="newResourceType" placeholder="Type (e.g., Video)" required>
        <input type="url" id="newResourceLink" placeholder="Resource Link (URL)" required>
        <button id="addResourceBtn">➕ Add Resource</button>
      `;
      resourcesDiv.appendChild(formDiv);

      setTimeout(() => {
        const addResourceBtn = document.getElementById("addResourceBtn");
        if (addResourceBtn) {
          addResourceBtn.onclick = () => {
            const title = document.getElementById("newResourceTitle").value.trim();
            const type = document.getElementById("newResourceType").value.trim();
            const link = document.getElementById("newResourceLink").value.trim();

            if (!title || !type || !link) {
              alert("Please fill in all fields.");
              return;
            }

            const newResource = { title, type, link };
            resources.push(newResource);
            localStorage.setItem("resources", JSON.stringify(resources));
            renderResources();
          };
        }
      }, 0);
    }
  };

  const renderEvents = () => {
    const eventsList = document.getElementById("events-list");
    eventsList.innerHTML = "";

    const scrollWrapper = document.createElement("div");
    scrollWrapper.style.overflowX = "auto";
    scrollWrapper.style.width = "100%";

    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.marginBottom = "15px";
    table.style.minWidth = "500px";

    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">Title</th>
        <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">Location</th>
        <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">Date</th>
        ${isAdminLoggedIn ? '<th style="border: 1px solid #ccc; padding: 8px; text-align: center;">Action</th>' : ''}
      </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    events.forEach((event, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td style="border: 1px solid #ccc; padding: 8px;">${event.title}</td>
        <td style="border: 1px solid #ccc; padding: 8px;">${event.location || "Unknown"}</td>
        <td style="border: 1px solid #ccc; padding: 8px;">${event.date}</td>
      `;

      if (isAdminLoggedIn) {
        const actionTd = document.createElement("td");
        actionTd.style.border = "1px solid #ccc";
        actionTd.style.padding = "8px";
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑️ Delete";
        deleteBtn.onclick = () => {
          if (confirm("Are you sure you want to delete this event?")) {
            deletedEvents.push(events.splice(index, 1)[0]);
            localStorage.setItem("events", JSON.stringify(events));
            renderEvents();
          }
        };
        actionTd.appendChild(deleteBtn);
        row.appendChild(actionTd);
      }

      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    scrollWrapper.appendChild(table);
    eventsList.appendChild(scrollWrapper);

    if (isAdminLoggedIn && deletedEvents.length > 0) {
      const undoBtn = document.createElement("button");
      undoBtn.innerHTML = "🔄 Undo Delete";
      undoBtn.style.marginTop = "10px";
      undoBtn.onclick = () => {
        const restored = deletedEvents.pop();
        if (restored) {
          events.push(restored);
          localStorage.setItem("events", JSON.stringify(events));
          renderEvents();
        }
      };
      eventsList.appendChild(undoBtn);
    }

    if (isAdminLoggedIn) {
      const formDiv = document.createElement("div");
      formDiv.style.marginTop = "20px";
      formDiv.innerHTML = `
        <h3>Add New Event</h3>
        <input type="text" id="newEventTitle" placeholder="Event Title" required>
        <input type="text" id="newEventLocation" placeholder="Location" required>
        <input type="date" id="newEventDate" required>
        <button id="addEventBtn">➕ Add Event</button>
      `;
      eventsList.appendChild(formDiv);

      setTimeout(() => {
        const addEventBtn = document.getElementById("addEventBtn");
        if (addEventBtn) {
          addEventBtn.onclick = () => {
            const title = document.getElementById("newEventTitle").value.trim();
            const location = document.getElementById("newEventLocation").value.trim();
            const date = document.getElementById("newEventDate").value;

            if (!title || !location || !date) {
              alert("Please fill in all fields.");
              return;
            }

            const newEvent = { title, location, date };
            events.push(newEvent);
            localStorage.setItem("events", JSON.stringify(events));
            renderEvents();
          };
        }
      }, 0);
    }
  };

  renderResources();
  renderEvents();

  document.getElementById("contactForm").addEventListener("submit", e => {
    e.preventDefault();
    alert("Thank you for contacting us! We’ll get back to you soon.");
    e.target.reset();
  });
    

  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const id = link.getAttribute("href").substring(1);
      document.querySelectorAll(".page-section").forEach(section => {
        section.classList.remove("show");
      });
      document.getElementById(id).classList.add("show");
    });
  });

  document.getElementById("loginForm").addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("lapiniglaramie1@gmail.com").value;
    const password = document.getElementById("larahmay27").value;
    if (email === "lapiniglaramie1@gmail.com" && password === "larahmay27") {
      localStorage.setItem("loggedIn", "true");
      isAdminLoggedIn = true;
      document.getElementById("login").style.display = "none";
      document.getElementById("adminPanel").style.display = "block";
      renderResources();
    } else {
      alert("Invalid credentials");
    }
  });

  window.logoutAdmin = () => {
    localStorage.removeItem("loggedIn");
    isAdminLoggedIn = false;
    location.reload();
  };

  if (isAdminLoggedIn) {
    document.getElementById("login").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
  }

  const darkToggle = document.getElementById("darkModeToggle");
  const darkMode = localStorage.getItem("darkMode") === "true";
  if (darkMode) document.body.classList.add("dark-mode");

  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
  });

  const guideContent = document.getElementById("guideContent");
  const disasterSelect = document.getElementById("disasterSelect");

  const guides = {
    earthquake: [
      "Drop, cover, and hold on.",
      "Stay away from windows and heavy furniture.",
      "Prepare an emergency supply kit.",
      "Know your evacuation routes."
    ],
    flood: [
      "Move to higher ground immediately.",
      "Avoid walking or driving through flood waters.",
      "Unplug electrical appliances.",
      "Store important documents in waterproof bags."
    ],
    fire: [
      "Have an escape plan and practice it.",
      "Install smoke detectors and check batteries.",
      "Stay low to avoid smoke inhalation.",
      "Stop, drop, and roll if clothes catch fire."
    ]
  };

  disasterSelect.addEventListener("change", () => {
    const selected = disasterSelect.value;
    const steps = guides[selected];

    if (steps) {
      guideContent.innerHTML = `
        <h2>${selected.charAt(0).toUpperCase() + selected.slice(1)} Guide</h2>
        <ul>${steps.map(step => `<li>${step}</li>`).join("")}</ul>
      `;
    } else {
      guideContent.innerHTML = "<h2>Preparedness Guide</h2><p>Select a disaster to view the steps.</p>";
    }
  });

  const simulation = document.getElementById("simulation");
  const scenarioElements = document.querySelectorAll(".scenario");

  const scenarios = {
    bleeding: {
      title: "Bleeding Scenario",
      question: "Someone is bleeding heavily from their arm. What should you do first?",
      options: [
        { text: "Apply pressure with a clean cloth", correct: true },
        { text: "Give them water", correct: false },
        { text: "Leave them and call for help", correct: false }
      ]
    },
    burn: {
      title: "Burn Scenario",
      question: "A person has a minor burn. What is the correct first step?",
      options: [
        { text: "Apply ice directly", correct: false },
        { text: "Cool with running water for 10 minutes", correct: true },
        { text: "Cover with butter", correct: false }
      ]
    },
    
    choking: {
      title: "Choking Scenario",
      question: "A person is choking and cannot speak. What should you do?",
      options: [
        { text: "Give 5 back blows between the shoulder blades", correct: true },
        { text: "Offer them a glass of water", correct: false },
        { text: "Wait and see if it stops", correct: false }
      ]
    },

    unconscious: {
      title: "Unconscious Scenario",
      question: "You find someone unconscious but breathing. What should you do first?",
      options: [
        { text: "Put them in the recovery position", correct: true },
        { text: "Give them water", correct: false },
        { text: "Leave them to rest", correct: false }
      ]
    },
    
    cpr: {
      title: "CPR Scenario",
      question: "You find someone unresponsive and not breathing. What do you do first?",
      options: [
        { text: "Call for help and start CPR", correct: true },
        { text: "Check their wallet", correct: false },
        { text: "Wait for someone else", correct: false }
      ]
    }
  };

  scenarioElements.forEach(scenario => {
    scenario.addEventListener("click", () => {
      const id = scenario.dataset.id;
      const s = scenarios[id];

      simulation.innerHTML = `
        <h2>${s.title}</h2>
        <p>${s.question}</p>
        <div class="options">
          ${s.options.map(opt =>
            `<button onclick="checkAnswer(${opt.correct})">${opt.text}</button>`).join("")}
        </div>
      `;
    });
  });

  window.checkAnswer = function (isCorrect) {
    alert(isCorrect ? "✅ Correct! Well done!" : "❌ Incorrect. Try again!");
  };

  const eventList = document.getElementById("eventList");
  const searchInput = document.getElementById("searchInput");

  const publicEvents = [
    {
      name: "Basic First Aid Training",
      location: "Manila City Hall",
      date: "2025-05-03"
    },
    {
      name: "CPR and AED Workshop",
      location: "Quezon City Medical Center",
      date: "2025-05-10"
    },
    {
      name: "Disaster Response Seminar",
      location: "UP Diliman, Quezon City",
      date: "2025-05-15"
    },
    {
      name: "Fire Safety Drill",
      location: "Makati Central Fire Station",
      date: "2025-05-20"
    }
  ];
  });