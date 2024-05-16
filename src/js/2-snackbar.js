import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';
//Отримуємо доступ до елементів
const formEl = document.querySelector('.form');

//Встановлено прослуховувач подій на форму
formEl.addEventListener('submit', onFormSubmit);

//Функція обробника події форми
function onFormSubmit(event) {
  event.preventDefault();
  const delay = parseInt(formEl.elements.delay.value);
  const state = formEl.elements.state.value;

  // Перевірка на коректність введеного значення delay
  if (isNaN(delay) || delay <= 0) {
    return showToast('yellow', 'The delay must be a positive number');
  }

  // Перевірка на обрання стану
  if (!state) {
    return showToast('yellow', 'Please select a state');
  }

  //Виклик функції createPromise
  createPromise(delay, state)
    .then(() => {
      showToast('green', `✅ Fulfilled promise in ${delay}ms`);
    })
    .catch(() => {
      showToast('red', `❌ Rejected promise in ${delay}ms`);
    });
}

//Функція створення new Promise
function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve();
      } else {
        reject();
      }
    }, delay);
  });
}

// Функція для виведення повідомлення
function showToast(color, message) {
  iziToast.show({
    color: color,
    message: message,
    position: 'topCenter',
  });
}
