const invitation = document.getElementById('invitation');
const gate = document.getElementById('gate');
const openButton = document.getElementById('openInvitation');
const editPanel = document.getElementById('editPanel');
const editButton = document.getElementById('editButton');
const closeEdit = document.getElementById('closeEdit');
const editBackdrop = document.getElementById('editBackdrop');
const editForm = document.getElementById('editForm');
const toast = document.getElementById('toast');
const countdown = document.getElementById('countdown');
const soundButton = document.getElementById('soundButton');
const invitationAudio = document.getElementById('invitationAudio');

const defaultDetails = {
  date: 'الخميس، 15 أكتوبر 2026',
  time: 'الثامنة مساءً',
  venue: 'قاعة ليالي النيل',
  address: 'القاهرة الجديدة · التجمع الخامس',
  eventDate: '2026-10-15T20:00'
};
let details = { ...defaultDetails, ...(JSON.parse(localStorage.getItem('ahmadFatimaInvitation') || 'null') || {}) };
let toastTimer;
let countdownTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function applyDetails() {
  document.getElementById('dateValue').textContent = details.date;
  document.getElementById('timeValue').textContent = details.time;
  document.getElementById('venueValue').textContent = details.venue;
  document.getElementById('addressValue').textContent = details.address;
  Object.entries(details).forEach(([key, value]) => {
    const input = editForm.elements.namedItem(key);
    if (input) input.value = value;
  });
  updateCountdown();
}

function openInvitation() {
  gate.classList.add('is-closing');
  gate.style.animation = 'page-in .55s reverse both';
  setTimeout(() => {
    gate.hidden = true;
    invitation.hidden = false;
    invitation.classList.add('revealed');
    document.body.classList.add('invitation-open');
    applyDetails();
  }, 480);
}

function openEditor() {
  editPanel.classList.add('is-open');
  editPanel.setAttribute('aria-hidden', 'false');
  editButton.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  setTimeout(() => editForm.elements.namedItem('date').focus(), 300);
}

function closeEditor() {
  editPanel.classList.remove('is-open');
  editPanel.setAttribute('aria-hidden', 'true');
  editButton.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

function updateCountdown() {
  const target = new Date(details.eventDate);
  const now = new Date();
  const difference = target.getTime() - now.getTime();
  const parts = countdown.querySelectorAll('strong');
  if (Number.isNaN(target.getTime()) || difference <= 0) {
    countdown.innerHTML = '<div><strong>♥</strong><span>يوم الفرح</span></div>';
    return;
  }
  const days = Math.floor(difference / 86400000);
  const hours = Math.floor((difference % 86400000) / 3600000);
  const minutes = Math.floor((difference % 3600000) / 60000);
  [days, hours, minutes].forEach((value, index) => { if (parts[index]) parts[index].textContent = String(value).padStart(2, '0'); });
}

openButton.addEventListener('click', openInvitation);
editButton.addEventListener('click', openEditor);
closeEdit.addEventListener('click', closeEditor);
editBackdrop.addEventListener('click', closeEditor);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && editPanel.classList.contains('is-open')) closeEditor();
});

editForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(editForm);
  details = Object.fromEntries(formData.entries());
  localStorage.setItem('ahmadFatimaInvitation', JSON.stringify(details));
  applyDetails();
  closeEditor();
  showToast('تم حفظ تفاصيل مناسبتكم');
});

soundButton.addEventListener('click', async () => {
  if (invitationAudio.paused) {
    try {
      await invitationAudio.play();
      soundButton.classList.add('is-on');
      soundButton.setAttribute('aria-pressed', 'true');
      showToast('تم تشغيل التلاوة');
    } catch {
      showToast('اضغطوا مرة أخرى لتشغيل التلاوة');
    }
  } else {
    invitationAudio.pause();
    soundButton.classList.remove('is-on');
    soundButton.setAttribute('aria-pressed', 'false');
    showToast('تم إيقاف التلاوة');
  }
});

applyDetails();
countdownTimer = window.setInterval(updateCountdown, 60000);
