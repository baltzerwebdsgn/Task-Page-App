//Upon page load
document.addEventListener("DOMContentLoaded", (event) => {
  //tasks progress bar functionality
  setupProgressTracker("steps", "tasks-progress-bar");

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
        const isConfirmed = confirm;
        while (answer !== "Y" && answer !== "N") {
          answer = prompt("Are you sure you want to clear? Y or N");

          if (answer == null) return;
          answer = answer.toUpperCase();
          if (answer === "Y") {
            notesText = "";
            alert("Your notes have been cleared!");
            break;
          } else if (answer == "N") {
            break;
          }
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
  const inputStep = form.querySelector(".add-task-input");
  const stepText = inputStep.value.trim();

  if (stepText === "") {
    return;
  }

  const ulElement = form.closest("ul");
  const formRow = form.parentElement;
  const newLi = document.createElement("li");
  newLi.innerHTML = `<input type="checkbox" class="neu-checkbox steps"/>
                <input class="tasks" type="text" value="${stepText}"/>
                <button class="remove-step">&#128473;</button>
                <input type="checkbox" class="neu-checkbox star-task"/>`;

  ulElement.insertBefore(newLi, formRow);

  inputStep.value = "";
  inputStep.placeholder = "Enter new step...";

  attachRemoveStepListener(newLi.querySelector(".remove-step"));
  setupProgressTracker("steps", "tasks-progress-bar");
}
function attachRemoveStepListener(button) {
  button.addEventListener("click", function () {
    this.parentElement.remove();

    updateProgress("steps", "tasks-progress-bar");
  });
}
