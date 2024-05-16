import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

//Отримуємо доступ до елементів
const timerEl = document.querySelector('#datetime-picker');
const btnEl = document.querySelector('[data-start]');
const daysElement = document.querySelector('[data-days]');
const hoursElement = document.querySelector('[data-hours]');
const minutesElement = document.querySelector('[data-minutes]');
const secondsElement = document.querySelector('[data-seconds]');

let timerInterval = null; // Додамо змінну для збереження ідентифікатора інтервалу
let userSelectedDate = null; // Оголошуємо змінну для зберігання обраної дати

//Встановлюємо прослуховувачі подій на елементи
timerEl.addEventListener('change', selectedDate);
btnEl.addEventListener('click', startTimer);

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
  },
};

flatpickr(timerEl, options); // Ініціалізуємо flatpickr на елементі з параметрами options

//Функція обрання дати користувачем
function selectedDate(event) {
  const selectedDate = new Date(event.target.value);
  const now = new Date();

  if (!event.target.value) {
    showToast('Hey', 'red', 'Please choose a date', 'topCenter');
    btnEl.disabled = true;
    return; // Перевірка на пустий ввід
  }

  if (!isValidDate(selectedDate)) {
    showToast('Hey', 'red', 'Please choose a valid date', 'topCenter');
    return; // Перевірка валідності дати
  }

  if (selectedDate <= now) {
    btnEl.disabled = true;
    showToast('Hey', 'red', 'Please choose a date in the future', 'topCenter'); // Перевірка якщо дата обрана в минулому
  } else {
    btnEl.disabled = false;
    userSelectedDate = selectedDate;
  }
}

// Функція для перевірки валідності дати
function isValidDate(date) {
  return !isNaN(date.getTime());
}

// Функція для виведення повідомлення
function showToast(title, color, message, position) {
  iziToast.show({
    title: title,
    color: color,
    message: message,
    position: position,
  });
}

// Функція для обчислення часу до події
function calculateTimeDifference(targetDate) {
  const now = new Date();
  return targetDate.getTime() - now.getTime();
}

// Функція запуску старту таймера
function startTimer() {
  if (!userSelectedDate) {
    showToast('Hey', 'red', 'Please choose a date first', 'topCenter');
    return;
  }

  btnEl.disabled = true; // Деактивуємо кнопку після натискання
  let timeDiff = calculateTimeDifference(userSelectedDate); // Викликаємо функцію для обчислення різниці у часі

  if (timeDiff <= 0) {
    clearInterval(timerInterval); // Зупиняємо таймер, якщо обрана дата вже минула
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(timeDiff); // Отримуємо значення days, hours, minutes, seconds
  updateTimerDisplay(days, hours, minutes, seconds); // Оновлюємо відображення таймера

  //Виконуємо зворотній відлік часу, встановлюємо інтервал що запускається кожну секунду
  timerInterval = setInterval(() => {
    timeDiff -= 1000; // Віднімаємо одну секунду

    if (timeDiff <= 0) {
      clearInterval(timerInterval); // Якщо час вийшов, зупиняємо таймер
      btnEl.disabled = true; // Деактивуємо кнопку
    }

    const { days, hours, minutes, seconds } = convertMs(timeDiff); // Отримуємо значення days, hours, minutes, seconds
    updateTimerDisplay(days, hours, minutes, seconds); // Оновлюємо відображення таймера
  }, 1000);
}

//Функція для відображення таймера
function updateTimerDisplay(days, hours, minutes, seconds) {
  daysElement.textContent = addLeadingZero(days);
  hoursElement.textContent = addLeadingZero(hours);
  minutesElement.textContent = addLeadingZero(minutes);
  secondsElement.textContent = addLeadingZero(seconds);
}

function convertMs(ms) {
  // Кількість мілісекунд на одиницю часу
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Решта днів
  const days = Math.floor(ms / day);
  // Решта годин
  const hours = Math.floor((ms % day) / hour);
  // Решта хвилин
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Решта секунд
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Функція для додавання ведучого нуля
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
