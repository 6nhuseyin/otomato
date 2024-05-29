
function generateRandomNumber() {
    var minValue = document.getElementById('minValue').value;
    var maxValue = document.getElementById('maxValue').value;
    console.log('Min Value:', minValue, 'Max Value:', maxValue); // Debug log


    if (minValue === '' || maxValue === '' || parseInt(minValue) >= parseInt(maxValue)) {
        alert('Please enter a valid range.');
        return;
    }

    var randomNumber = Math.floor(Math.random() * (parseInt(maxValue) - parseInt(minValue) + 1)) + parseInt(minValue);

    // play a sound effect
    var audio = new Audio('./ses/button-click.ogg');
    audio.play();

    console.log('Random Number:', randomNumber);
    document.getElementById('result').textContent = randomNumber;

}

function convertInchToCm() {
    let inchValue = document.getElementById('inchValue').value;
    if (inchValue === '') {
        alert('Please enter a value in inches.');
        return;
    }
    // Convert inches to centimetres
    let cmValue = parseFloat(inchValue) * 2.54;
    // Display the result in the cmResult div
    document.getElementById('cmResult').textContent = cmValue.toFixed(2) + ' cm';
}