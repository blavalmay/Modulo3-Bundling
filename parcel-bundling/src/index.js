import "./css/main.scss";

// funciones comportamiento input

const inputFocus = (input, wrapper) => {
    input.addEventListener("focus", function() {
        wrapper.classList.add('selected');
        if(input.getAttribute('name') === 'card-number') {
            input.placeholder = "0000  0000  0000  0000";
        }
    });
}

const inputBlur = (input, wrapper, inputList) => {
    input.addEventListener("blur", function() {
        for (let e = 0; e < inputList.length; e++) {
            wrapper.classList.remove(`focus-${inputList[e].getAttribute('id')}`);
        }
        wrapper.classList.remove('selected');
        wrapper.classList.remove('focus');
    });
}

const inputFill = (input, wrapper, inputList) => {
    input.addEventListener("input", function() {
        let allfilled = true;
        for (let e = 0; e < inputList.length; e++) {
            wrapper.classList.remove(`focus-${inputList[e].getAttribute('id')}`);
            if(inputList[e].value === ''){
                allfilled = false;
            }else if(inputList[e].id === 'card-cvc' && !validateCardCvc(inputList[e].value)) {
                allfilled = false;
            }
        }
        wrapper.classList.add('focus');
        wrapper.classList.add(`focus-${input.getAttribute('name')}`);
        wrapper.classList.remove('filled');
        if(allfilled) {
            wrapper.classList.add('filled');
            wrapper.classList.remove('focus');
        }
    });
}

// funciones validación tarjeta de crédito

const validateCardNumber = number => {
    let valid = false;
    // Comprobamos si solo tiene valores numéricos y 16 digitos
    const regex = new RegExp("^[0-9]{16}$");
    if (regex.test(number)){
        valid = true;
    }
    return valid;
}
const validateCardDate = (MM, YY) => {
    let valid = false;
    const fullDate = MM + YY;
    const currentYY = new Date().getFullYear() % 100;
    const currentMM = new Date().getMonth() + 1;

    // Comprobamos si solo tiene valores numéricos y 16 digitos
    const regex = new RegExp("^(0[1-9]|1[0-2])?([0-9]{2})$");
    if (regex.test(fullDate) && currentYY <= YY){
        if(YY > currentYY) {
            valid = true;
        }else if(MM > currentMM) {
            valid = true;
        }
    }
    return valid;
}
const validateCardCvc = number => {
    let valid = false;
    // Comprobamos si solo tiene valores numéricos y 16 digitos
    const regex = new RegExp("^[0-9]{3}$");
    if (regex.test(number)){
        valid = true;
    }
    return valid;
}

// funcion lanzar error

const throwError = (type, wrapper) => {
    var error = document.createElement('p');
    error.classList.add('input-error');
    wrapper.appendChild(error);

    switch(type) {
        case 'error-number':
            error.innerHTML = 'El número de tu tarjeta no es válido.';
            wrapper.classList.add('card-error');
            break;
        case 'error-date':
            error.innerHTML = 'El año de caducidad de la tarjeta ya ha pasado.';
            wrapper.classList.add('card-error-date');
            break;
        case 'error-cvc':
            error.innerHTML = 'El CVC no es correcto.';
            wrapper.classList.add('card-error-cvc');
            break;
        default:
            error.innerHTML = 'La tarjeta introducida no es válida.';
            wrapper.classList.add('card-error');
    }

    setTimeout(() => {
        error.remove();
        wrapper.classList.remove('card-error');
        wrapper.classList.remove('card-error-date');
        wrapper.classList.remove('card-error-cvc');
    }, 2000);
}

// funcion click boton

const submitBtn = (btn, wrapper) => {
    btn.addEventListener("click", function(event) {
        event.preventDefault();
        const cardNumber = document.getElementById("card-number").value;
        const cardDateMM = document.getElementById("card-month").value;
        const cardDateYY = document.getElementById("card-year").value;
        const cardCvc = document.getElementById("card-cvc").value;

        if(validateCardNumber(cardNumber)) {
            if(validateCardDate(cardDateMM, cardDateYY)) {
                if(validateCardCvc(cardCvc)) {
                    btn.classList.add('success');
                    if(btn.classList.contains('button--img')) {
                        btn.insertAdjacentHTML("beforeend", `
                            <div class="loading-circle">
                            <div class="circle">
                            <span class="dot"></span>
                            <span class="dot"></span>
                            <span class="dot"></span>
                            <span class="dot"></span>
                            <span class="dot"></span>
                            <span class="dot"></span>
                            <span class="dot"></span>
                            <span class="dot"></span>
                            <span class="dot"></span>
                            <span class="dot"></span>
                            <span class="dot"></span>
                            <span class="dot"></span>
                            </div>
                            </div>
                        `);
                    }else{
                        btn.innerHTML = '';
                        btn.insertAdjacentHTML("beforeend", `
                            <div class="loading-dots">
                            <span class="dot-4"></span>
                            <span class="dot-3"></span>
                            <span class="dot-2"></span>
                            <span class="dot-1"></span>
                            <span></span>
                            <span class="dot-1"></span>
                            <span class="dot-2"></span>
                            <span class="dot-3"></span>
                            <span class="dot-4"></span></div>
                        `);
                    }
                    
                }else{
                    throwError('error-cvc', wrapper);
                    setTimeout(() => {
                        btn.classList.remove('selected');
                    }, 1000);
                }
            }else{
                throwError('error-date', wrapper);
                setTimeout(() => {
                    btn.classList.remove('selected');
                }, 1000);
            }
        }else{
            throwError('error-number', wrapper);
            setTimeout(() => {
                btn.classList.remove('selected');
            }, 1000);
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {

    const inputWrapper = document.getElementsByClassName('input-wrapper')[0];
    const formWrapper = document.getElementsByClassName('tpv-form__input')[0];
    const inputs = document.querySelectorAll('.input-wrapper input');
    const payButtons = document.getElementsByClassName('button');
    const imgButtons = document.querySelectorAll('.button--img');

    // comportamiento input

    for (let i = 0; i < inputs.length; i++) {
        inputFocus(inputs[i], inputWrapper);
        inputBlur(inputs[i], inputWrapper, inputs);
        inputFill(inputs[i], inputWrapper, inputs);
    }

    // comportamiento botones

    for (let i = 0; i < imgButtons.length; i++) {
        imgButtons[i].onclick = function() {
            imgButtons[i].classList.add('selected');
        }
    }

    // validación input

    for (let i = 0; i < payButtons.length; i++) {
        submitBtn(payButtons[i], formWrapper);
    }
});