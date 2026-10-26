const API_URL = "https://brasilapi.com.br/api/feriados/v1/";
const weekdays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

const form = document.querySelector("#holidayForm");
const yearInput = document.querySelector("#yearInput");
const statusElement = document.querySelector("#status");
const tableBody = document.querySelector("#holidayTable");
const countElement = document.querySelector("#holidayCount");
const nextHolidayElement = document.querySelector("#nextHoliday");
const todayLabel = document.querySelector("#todayLabel");

const today = new Date();
yearInput.value = today.getFullYear();
todayLabel.textContent = today.toLocaleDateString("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric"
});

function parseHolidayDate(date) {
  return new Date(date + "T12:00:00");
}

function formatDate(date) {
  return date.toLocaleDateString("pt-BR");
}

function dayDifference(date) {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.round((end - start) / 86400000);
}

function setStatus(message, isError = false) {
  statusElement.textContent = message;
  statusElement.classList.toggle("error", isError);
}

function showNextHoliday(holidays) {
  const nextHoliday = holidays.find((holiday) => dayDifference(parseHolidayDate(holiday.date)) >= 0);
  nextHolidayElement.hidden = !nextHoliday;

  if (!nextHoliday) return;

  const holidayDate = parseHolidayDate(nextHoliday.date);
  const days = dayDifference(holidayDate);
  nextHolidayElement.innerHTML = `
    <div>
      <p>Próximo feriado</p>
      <strong>${nextHoliday.name}</strong>
      <div>${formatDate(holidayDate)} · ${weekdays[holidayDate.getDay()]}</div>
    </div>
    <div class="days-left">${days}<span>${days === 1 ? "dia" : "dias"}</span></div>
  `;
}

function renderHolidays(holidays) {
  tableBody.replaceChildren();
  countElement.textContent = `${holidays.length} feriados encontrados`;

  holidays.forEach((holiday, index) => {
    const date = parseHolidayDate(holiday.date);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const row = document.createElement("tr");

    if (isWeekend) row.classList.add("weekend");
    row.style.animationDelay = `${Math.min(index * 24, 240)}ms`;
    row.innerHTML = `
      <td>${formatDate(date)}</td>
      <td>${weekdays[date.getDay()]}</td>
      <td>${holiday.name}</td>
      <td>${holiday.type}</td>
    `;
    tableBody.append(row);
  });

  showNextHoliday(holidays);
}

async function fetchHolidays(year) {
  setStatus("Consultando calendário...");
  tableBody.replaceChildren();
  countElement.textContent = "";
  nextHolidayElement.hidden = true;

  try {
    const response = await fetch(`${API_URL}${year}`);

    if (!response.ok) {
      throw new Error("Ano inválido ou serviço indisponível.");
    }

    const holidays = await response.json();

    if (!Array.isArray(holidays)) {
      throw new Error("Resposta inválida da API.");
    }

    renderHolidays(holidays);
    setStatus(`Calendário de ${year} carregado.`);
  } catch (error) {
    setStatus(error.message || "Não foi possível consultar os feriados.", true);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const year = yearInput.value.trim();

  if (!/^\d{4}$/.test(year)) {
    setStatus("Digite um ano válido com quatro dígitos.", true);
    yearInput.focus();
    return;
  }

  fetchHolidays(year);
});

fetchHolidays(today.getFullYear());
