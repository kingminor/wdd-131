//  arrays.js
const steps = ["one", "two", "three"];
function listTemplate(step) {
  return `<li>${step}</li>`;
}
const stepsHtml = steps.map(listTemplate); // use map to convert the list from strings to HTML
//document.querySelector("#myList").innerHTML = stepsHtml.join(""); // set the innerHTML

const grades = ["A", "B", "A"];
function returnGradePoints(letterGrade) {
    let point = 0;
    if (letterGrade === "A") {
        point = 4;
    } 
    else if (letterGrade === "B") {
        point = 3;
    }
    else if (letterGrade === "C") {
        point = 2;
    }
    
    return point;
}

const GPAPoints = grades.map(returnGradePoints);
console.log(GPAPoints);

const pointsTotal = GPAPoints.reduce(function (total, item) {
    return total + item;
});
const gpa = pointsTotal / GPAPoints.length;

console.log(gpa.toFixed(2));