//Upon page load
document.addEventListener("DOMContentLoaded", (event) => {
  //Clear notes functionality
  const clearNotesButton = document.getElementById("clear-notes-button");

  clearNotesArea(clearNotesButton);

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
});

const starTaskArray = new Array(3);
const starTaskCounter = 0;

function clearNotesArea(button) {
  const notesElement = document.getElementById("notes-area");

  if (button) {
    button.addEventListener("click", function (event) {
      const currentText = notesElement.value.trim();

      if (currentText !== "") {
        const isConfirmed = confirm("Are you sure you want to clear?");

        if (isConfirmed) {
          currentText = "";
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

function setupProgressTracker(className, progressElementId) {
  const allCheckboxes = document.querySelectorAll(`.${className}`);
  allCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      updateProgress(className, progressElementId);
    });
  });
  updateProgress(className, progressElementId);
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

  attachRemoveStepListener(newRow.querySelector(".remove-step"));
  setupProgressTracker("steps", "tasks-progress-bar");
}
function attachRemoveStepListener(button) {
  button.addEventListener("click", function () {
    this.closest("tr").remove();

    updateProgress("steps", "tasks-progress-bar");
  });
}
