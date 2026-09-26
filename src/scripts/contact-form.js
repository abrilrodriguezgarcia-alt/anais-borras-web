// Pàgina /contacte: validació, estats i feedback del formulari. Sense JS el formulari es mostra igual, però no envia.
// L'enviament real és a contact-submit.js. Els errors es mostren per camp (aria-invalid + aria-describedby) i el primer
// camp amb error rep el focus; el resum i els errors d'enviament surten a la regió [role="alert"].
import { sendProposal } from './contact-submit.js';

const form = document.querySelector('[data-contact-form]');
if (form) initContactForm(form);

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Missatges d'error, en la veu de la web: directes i humans.
const MESSAGES = {
  name: { missing: 'Digues-me com et dius.' },
  email: { missing: 'Necessito un correu per poder respondre’t.', invalid: 'Aquest correu no sembla correcte.' },
  message: { missing: 'Explica’m una mica de què va.' },
};

function initContactForm(form) {
  const done = document.querySelector('[data-contact-done]');
  const status = form.querySelector('.contact-form__status');
  const submit = form.querySelector('[data-submit]');
  const label = form.querySelector('[data-submit-label]');
  const idleLabel = label.textContent;
  const fields = [...form.querySelectorAll('[data-validate]')];
  const textarea = form.querySelector('textarea');
  let sending = false;

  const errorOf = (field) => document.getElementById(field.getAttribute('aria-describedby'));

  // Retorna el missatge d'error d'un camp, o '' si és correcte.
  function problem(field) {
    const value = field.value.trim();
    const messages = MESSAGES[field.name];
    if (!value) return messages.missing;
    if (field.type === 'email' && !EMAIL.test(value)) return messages.invalid;
    return '';
  }

  function validate(field) {
    const message = problem(field);
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    field.closest('.contact-form__row').classList.toggle('is-invalid', Boolean(message));
    errorOf(field).textContent = message;
    return !message;
  }

  // Valida en sortir del camp (un cop tocat) i, si ja té error, mentre s'escriu: l'error desapareix en arreglar-lo.
  form.addEventListener('focusout', (event) => {
    if (fields.includes(event.target) && event.target.value !== '') validate(event.target);
  });
  form.addEventListener('input', (event) => {
    const field = event.target;
    if (field === textarea) autoGrow();
    const row = field.closest('.contact-form__row');
    if (row) syncFilled(row);
    if (fields.includes(field) && field.getAttribute('aria-invalid') === 'true') validate(field);
    if (status.textContent) status.textContent = '';
  });

  // Marca la fila com a resposta (estrella al costat del número): camp amb text o opció triada.
  const rows = [...form.querySelectorAll('.contact-form__row')];
  function syncFilled(row) {
    const filled =
      [...row.querySelectorAll('input:not([type="radio"]), textarea')].some((el) => el.value.trim()) ||
      Boolean(row.querySelector('input[type="radio"]:checked'));
    row.classList.toggle('is-filled', filled);
  }
  form.addEventListener('change', (event) => {
    if (event.target.type === 'radio') syncFilled(event.target.closest('.contact-form__row'));
  });

  function autoGrow() {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  function setSending(value) {
    sending = value;
    submit.setAttribute('aria-disabled', String(value));
    submit.dataset.state = value ? 'sending' : 'idle';
    label.textContent = value ? 'Enviant…' : idleLabel;
    form.setAttribute('aria-busy', String(value));
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;

    const invalid = fields.filter((field) => !validate(field));
    if (invalid.length) {
      status.textContent = invalid.length === 1 ? 'Falta revisar un camp.' : `Falten ${invalid.length} camps per revisar.`;
      invalid[0].focus();
      return;
    }
    status.textContent = '';

    const data = new FormData(form);
    // Trampa anti-spam: si un robot l'omple, es mostra l'èxit però no s'envia res.
    if (data.get('website')) return showDone();

    setSending(true);
    try {
      await sendProposal(
        {
          name: data.get('name').trim(),
          email: data.get('email').trim(),
          topic: data.get('topic') ?? '',
          message: data.get('message').trim(),
        },
        { endpoint: form.dataset.endpoint },
      );
      showDone();
    } catch (error) {
      console.error('[contacte] No s’ha pogut enviar:', error);
      status.textContent = 'No s’ha pogut enviar. Torna-ho a provar d’aquí a un moment o escriu-me per xarxes.';
    } finally {
      setSending(false);
    }
  });

  function showDone() {
    form.hidden = true;
    done.hidden = false;
    done.focus({ preventScroll: true });
    done.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  done.querySelector('[data-contact-reset]').addEventListener('click', () => {
    form.reset();
    rows.forEach(syncFilled);
    for (const field of fields) {
      field.setAttribute('aria-invalid', 'false');
      field.closest('.contact-form__row').classList.remove('is-invalid');
      errorOf(field).textContent = '';
    }
    autoGrow();
    done.hidden = true;
    form.hidden = false;
    fields[0].focus();
  });
}
