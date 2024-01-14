function validateForm() {
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;

    if (!height || height <= 0) {
        alert('Please enter a valid height');
        return false;
    }

    if (!weight || weight <= 0) {
        alert('Please enter a valid weight');
        return false;
    }


    return true;
}
