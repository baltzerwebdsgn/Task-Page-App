document.addEventListener("DOMContentLoaded", (event) => {
  //tasks progress bar functionality
  setupProgressTracker("steps", "tasks-progress-bar");
  //Clear notes functionality
  const clearNotesButton = document.getElementById("clear-notes-button");

  if (clearNotesButton) {
    clearNotesButton.addEventListener("click", function (event) {
      alert("Your notes have been cleared!");
      document.getElementById("notes-area").value = "";
    });
  } else {
    console.error("The element with the ID '' was not found in the DOM.");
  }
});
const starTaskArray = new Array(3);
const starTaskCounter = 0;

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
