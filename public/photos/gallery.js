const status = document.querySelector('#status');
const allLinks = document.querySelector('#all-links');

document.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-copy], #copy-all');
  if (!button) return;

  const input = button.id === 'copy-all'
    ? allLinks
    : document.getElementById(button.dataset.copy);
  const value = input.value;
  button.disabled = true;

  try {
    await navigator.clipboard.writeText(value);
    status.textContent = button.id === 'copy-all'
      ? 'Все 24 ссылки скопированы.'
      : `Ссылка на ${button.dataset.label} скопирована.`;
  } catch {
    input.hidden = false;
    input.focus();
    input.select();
    status.textContent = 'Автоматическое копирование недоступно. Скопируйте выделенный текст вручную.';
  } finally {
    button.disabled = false;
  }
});

document.querySelectorAll('input[readonly]').forEach((input) => {
  input.addEventListener('click', () => input.select());
});

document.querySelectorAll('img').forEach((image) => {
  image.addEventListener('error', () => {
    status.textContent = `${image.alt} не загрузилось. Попробуйте обновить страницу.`;
  });
});
