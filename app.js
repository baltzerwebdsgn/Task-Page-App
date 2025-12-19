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

  const taskSection = document.querySelector(".row-bottom");

  taskSection.addEventListener("change", (e) => {
    if (e.target.classList.contains("steps")) {
      updateProgress("steps", "tasks-progress-bar");
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

  if (detailsElement && tableElement.querySelectorAll("tr").length == 2) {
    detailsElement.classList.add("urgent");
  }
}
function attachRemoveStepListener(button) {
  button.addEventListener("click", function () {
    const row = this.closest("tr");
    const table = this.closest("table");
    const detailsElement = this.closest("details");

    if (row) row.remove();

    const remainingRows = table.querySelectorAll("tr").length;

    if (remainingRows <= 1 && detailsElement) {
      detailsElement.classList.remove("urgent");
      detailsElement.classList.remove("in-progress");
    }

    updateProgress("steps", "tasks-progress-bar");
    updateStarCounter();
  });
}

function updateStarCounter() {
  //Update the overall counter
  const starredCheckboxes = document.querySelectorAll(".star-step:checked");
  const starDisplay = document.getElementById("stars");

  if (starDisplay) {
    starDisplay.textContent = starredCheckboxes.length;
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
