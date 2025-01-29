const PI = 3.14;
let area = 0;

function circleArea(inputradius) {
    const area = inputradius * PI;
    return area;
}

area = circleArea(3);
console.log(area);