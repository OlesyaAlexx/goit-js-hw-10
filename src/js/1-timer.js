import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

const timerEl = document.querySelector('#datetime-picker');
let btnEl = document.querySelector('[data-start]');
let timerInterval; // Додамо змінну для збереження ідентифікатора інтервалу
let userSelectedDate; // Оголошуємо змінну для зберігання обраної дати

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

function selectedDate(event) {
  if (!event.target.value) {
    return; // Перевірка на пустий ввід
  }
  const selectedDate = new Date(event.target.value);
  const now = new Date();

  if (isNaN(selectedDate.getTime())) {
    iziToast.show({
      title: 'Hey',
      color: 'red',
      message: 'Please choose a valid date',
    });
    return;
  }

  if (selectedDate <= now) {
    btnEl.disabled = true;
    iziToast.show({
      title: 'Hey',
      color: 'red',
      message: 'Please choose a date in the future',
    });
  } else {
    btnEl.disabled = false;
    userSelectedDate = selectedDate;
  }
}

function startTimer() {
  btnEl.disabled = true; // Деактивуємо кнопку після натискання
  const now = new Date();
  let timeDiff = userSelectedDate.getTime() - now.getTime(); // Різниця в мілісекундах між поточним часом і обраною датою
  if (timeDiff <= 0) {
    clearInterval(timerInterval); // Зупиняємо таймер, якщо обрана дата вже минула
    return;
  }

  updateTimerDisplay(timeDiff); // Оновлюємо відображення таймера

  timerInterval = setInterval(() => {
    timeDiff -= 1000; // Віднімаємо одну секунду
    if (timeDiff <= 0) {
      clearInterval(timerInterval); // Якщо час вийшов, зупиняємо таймер
      btnEl.disabled = true; // Деактивуємо кнопку
    }
    updateTimerDisplay(timeDiff); // Оновлюємо відображення таймера
  }, 1000);
}

function updateTimerDisplay(timeDiff) {
  const { days, hours, minutes, seconds } = convertMs(timeDiff);
  const formattedTime = `${addLeadingZero(days)}:${addLeadingZero(
    hours
  )}:${addLeadingZero(minutes)}:${addLeadingZero(seconds)}`;
  timerEl.textContent = formattedTime;
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Функція для додавання ведучого нуля
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
