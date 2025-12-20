//Upon page load
document.addEventListener("DOMContentLoaded", (event) => {
  const source = document.getElementById("editor");
  const target = document.getElementById("main-title");

  source.addEventListener("input", function () {
    // If the user deletes everything, provide a fallback for the H1
    target.innerText =
      source.innerText.trim() === "" ? "Untitled" : source.innerText;
  });
  source.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      source.blur();
    }
  });
  const playPauseButton = document.getElementById("play-pause-button");
  const timerResetButton = document.getElementById("reset-timer-button");

  setupTimer(playPauseButton, timerResetButton);

  //Clear notes functionality
  const clearNotesButton = document.getElementById("clear-notes-button");
  clearNotesArea(clearNotesButton);

  //Task title corrections
  const summaryElements = document.querySelectorAll(".summary-class");

  summaryElements.forEach((s) => {
    s.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        e.target.blur();
      }
    });
    s.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    //Hacky solution to solve the bug when opening the
    s.addEventListener("keyup", (e) => {
      if (e.key === " " || e.code === "Space") {
        s.parentNode.open = false;
      }
    });
  });

  //Add task steps functionality
  const addForms = document.querySelectorAll(".add-step-form");

  addForms.forEach((form) => {
    form.addEventListener("submit", handleAddStep);
  });

  //Remove task step functionality
  const removeButtons = document.querySelectorAll(".remove-step");

  removeButtons.forEach((button) => {
    attachRemoveStepListener(button);
  });

  const taskSection = document.querySelector(".row-bottom");

  taskSection.addEventListener("change", (e) => {
    if (e.target.classList.contains("steps")) {
      updateProgress("steps", "tasks-progress-bar");

      const parentDetails = e.target.closest("details");
      updateTaskStatus(parentDetails);
    }

    if (e.target.classList.contains("star-step")) {
      updateStarCounter();
    }
  });

  taskSection.addEventListener("input", (e) => {
    if (e.target.classList.contains("editable-cell")) {
      const row = e.target.closest("tr");
      const starBtn = row.querySelector(".star-step");

      if (starBtn && starBtn.checked) {
        updateStarCounter();
      }
    }
  });
});

function clearNotesArea(button) {
  const notesElement = document.getElementById("notes-area");

  if (button) {
    button.addEventListener("click", function (event) {
      const currentText = notesElement.value.trim();

      if (currentText !== "") {
        const isConfirmed = confirm("Are you sure you want to clear?");

        if (isConfirmed) {
          notesElement.value = "";
          alert("Your notes have been cleared!");
        }
      }
    });
  } else {
    console.error("Clear button not found.");
  }
}

function countCheckedCheckboxes(className) {
  const selector = `.${className}:checked`;
  return document.querySelectorAll(selector).length;
}

function countAllCheckboxes(className) {
  return document.querySelectorAll(`.${className}`).length;
}

function updateProgress(className, progressElementId) {
  const totalCheckedboxes = countAllCheckboxes(className);
  const checkedCounted = countCheckedCheckboxes(className);

  const progressBar = document.getElementById(progressElementId);
  if (progressBar) {
    progressBar.value = checkedCounted;
    progressBar.max = totalCheckedboxes;
  }
}

function handleAddStep(event) {
  event.preventDefault();

  const form = event.target;

  const tableId = form.getAttribute("data-list-id");
  const tableElement = document.getElementById(tableId);

  const inputStep = form.querySelector(".add-task-input");
  const stepText = inputStep.value.trim();

  if (stepText === "" || !tableElement) {
    return;
  }

  const newRow = document.createElement("tr");
  newRow.innerHTML = `<td><input type="checkbox" class="neu-checkbox steps" /></td>
                <td contenteditable="true" class="editable-cell">${stepText}</td>
                <td><button class="remove-step">X</button></td>
                <td><input type="checkbox" class="neu-checkbox star-step" /></td>`;

  tableElement.appendChild(newRow);

  inputStep.value = "";
  inputStep.placeholder = "Enter new step...";
  //Keeps the focus on the input so the user can keep typing more steps
  inputStep.focus();

  attachRemoveStepListener(newRow.querySelector(".remove-step"));

  const detailsElement = form.closest("details");
  updateTaskStatus(detailsElement);

  updateProgress("steps", "tasks-progress-bar");

  updateStarCounter();
}

function attachRemoveStepListener(button) {
  button.addEventListener("click", function () {
    const row = this.closest("tr");
    const table = this.closest("table");
    const detailsElement = this.closest("details");

    if (row) row.remove();

    const remainingRows = table.querySelectorAll("tr").length;

    updateTaskStatus(detailsElement);
    updateProgress("steps", "tasks-progress-bar");
    updateStarCounter();
  });
}

function updateStarCounter() {
  //Update the overall counter
  const starredCheckboxes = document.querySelectorAll(".star-step:checked");
  const allStarCheckboxes = document.querySelectorAll(".star-step");

  const starDisplay = document.getElementById("stars");
  if (starDisplay) {
    starDisplay.textContent = starredCheckboxes.length;
  }

  if (starredCheckboxes.length >= 3) {
    allStarCheckboxes.forEach((cb) => {
      if (!cb.checked) {
        cb.classList.add("limited");
        cb.onclick = (e) => e.preventDefault();
      }
    });
  } else {
    allStarCheckboxes.forEach((cb) => {
      cb.classList.remove("limited");
      cb.onclick = null;
    });
  }

  const critSpans = [
    document.getElementById("critOne"),
    document.getElementById("critTwo"),
    document.getElementById("critThree"),
  ];

  critSpans.forEach((span) => {
    if (span) span.textContent = "";
  });

  starredCheckboxes.forEach((checkboxes, index) => {
    if (index < 3) {
      const row = checkboxes.closest("tr");
      const taskText = row.querySelector(".editable-cell").textContent;
      if (critSpans[index]) {
        critSpans[index].textContent = taskText || "(Empty Task)";
      }
    }
  });
}
function updateTaskStatus(detailsElement) {
  if (!detailsElement) return;

  const checkboxes = detailsElement.querySelectorAll(".steps");
  const checkedCount = detailsElement.querySelectorAll(".steps:checked").length;
  const totalCount = checkboxes.length;

  detailsElement.classList.remove("in-progress", "completed", "urgent");

  if (totalCount === 0) {
    return;
  }
  if (checkedCount === totalCount) {
    detailsElement.classList.add("completed");
  } else if (checkedCount > 0) {
    detailsElement.classList.add("in-progress");
  } else {
    detailsElement.classList.add("urgent");
  }
}

let timerInterval = null;
let isRunning = false;

function setupTimer(playBtn, resetBtn) {
  playBtn.addEventListener("click", () => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  });

  resetBtn.addEventListener("click", () => {
    pauseTimer();
    document.getElementById("minutes").innerText = "30";
    document.getElementById("seconds").innerText = "00";
  });
}

function startTimer() {
  isRunning = true;

  document.getElementById("play-pause-button").style.opacity = "0.5";

  timerInterval = setInterval(() => {
    let minutesElement = document.getElementById("minutes");
    let secondsElement = document.getElementById("seconds");

    let minutes = parseInt(minutesElement.innerText);
    let seconds = parseInt(secondsElement.innerText);

    if (seconds === 0) {
      if (minutes === 0) {
        // Timer Finished
        clearInterval(timerInterval);
        isRunning = false;
        alert("Time is up!");
        return;
      } else {
        minutes--;
        seconds = 59;
      }
    } else {
      seconds--;
    }

    // Update Display with padding (e.g., 09 instead of 9)
    minutesElement.innerText = minutes.toString().padStart(2, "0");
    secondsElement.innerText = seconds.toString().padStart(2, "0");
  }, 1000);
}

function pauseTimer() {
  isRunning = false;
  clearInterval(timerInterval);
  document.getElementById("play-pause-button").style.opacity = "1";
}
