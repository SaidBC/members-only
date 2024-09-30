const formInputs = document.querySelectorAll('form .form-container input');

formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        if (document.querySelector('.inputs-error')) {
            document.querySelector('.inputs-error').remove()
        }
    })
});