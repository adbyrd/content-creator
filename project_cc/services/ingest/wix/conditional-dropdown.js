/**
 * CONDITIONAL DROPDOWN FORM
 *
 * This code manages a form with conditional dropdowns for category selection.
 * It loads taxonomy data from the backend, populates dropdowns, validates input,
 * saves submissions to a Wix Data collection, and sends data to an n8n webhook.
 * 
 * VERSION 1.0.0
 */

// public page code
import wixData from 'wix-data';
import wixWindow from 'wix-window';
import { getTaxonomy } from 'backend/categoryService';

let TAXONOMY = null;

$w.onReady(async () => {
  bootUI();

  try {
    TAXONOMY = await getTaxonomy();
    hydrateParentDropdown(TAXONOMY.parentOptions);
    wireInteractions();
  } catch (err) {
    failClosed('We couldn’t load categories right now. Please refresh or try again later.', err);
  }
});

function bootUI() {
  $w('#error_text').hide();
  $w('#success_box').hide();

  $w('#sub_category').options = [];
  $w('#sub_category').disable();
}

function hydrateParentDropdown(parentOptions) {
  $w('#parent_category').options = [
    { label: 'Select a category…', value: '' },
    ...parentOptions
  ];
  $w('#parent_category').value = '';
}

function wireInteractions() {
  $w('#parent_category').onChange(() => {
    const parentSlug = $w('#parent_category').value;

    // Reset child on any parent change
    $w('#sub_category').value = '';
    $w('#sub_category').options = [];

    if (!parentSlug) {
      $w('#sub_category').disable();
      return;
    }

    const childOptions = TAXONOMY?.childrenByParent?.[parentSlug] || [];
    $w('#sub_category').options = [
      { label: 'Select a sub-category…', value: '' },
      ...childOptions
    ];
    $w('#sub_category').enable();
  });

  $w('#submit_btn').onClick(async () => {
    await handleSubmit();
  });
}

async function handleSubmit() {
  clearError();

  const payload = collectPayload();
  const validation = validatePayload(payload);

  if (!validation.ok) {
    showError(validation.message);
    return;
  }

  // Persist first (durable), then webhook (best-effort).
  const submissionId = await saveSubmission(payload);

  try {
    await sendToWebhook({ ...payload, submission_id: submissionId });
    await markSubmissionStatus(submissionId, 'sent_to_n8n');
  } catch (err) {
    // We still captured the submission.
    await markSubmissionStatus(submissionId, 'webhook_error');
    console.error('Webhook error', err);
  }

  showSuccess();
}

function collectPayload() {
  return {
    email: ($w('#email').value || '').trim().toLowerCase(),
    parent_category: $w('#parent_category').value,
    sub_category: $w('#sub_category').value,
    business_name: ($w('#business_name').value || '').trim(),
    website: ($w('#website').value || '').trim(),
    phone: ($w('#phone').value || '').trim(),
    notes: ($w('#notes').value || '').trim(),
    // Add attribution metadata if you have it
    attribution_json: null,
    schema_version: 'universal_intake_v1'
  };
}

function validatePayload(p) {
  if (!p.email) return { ok: false, message: 'Please enter your email.' };
  if (!p.parent_category) return { ok: false, message: 'Please select a parent category.' };
  if (!p.sub_category) return { ok: false, message: 'Please select a sub-category.' };
  if (!p.business_name) return { ok: false, message: 'Please enter your business name.' };
  return { ok: true };
}

async function saveSubmission(p) {
  const item = {
    ...p,
    status: 'received'
  };

  const inserted = await wixData.insert('UniversalIntakeSubmissions', item);
  return inserted._id;
}

async function markSubmissionStatus(id, status) {
  await wixData.update('UniversalIntakeSubmissions', { _id: id, status });
}

async function sendToWebhook(p) {
  // Option 1: Use fetch to n8n webhook URL
  // NOTE: Put URL in Secrets Manager or backend; do not hardcode.
  // This is a placeholder call pattern:
  const res = await fetch('YOUR_N8N_WEBHOOK_URL', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(p)
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Webhook failed: ${res.status} ${txt}`);
  }
}

function showError(message) {
  $w('#error_text').text = message;
  $w('#error_text').show();
}

function clearError() {
  $w('#error_text').hide();
  $w('#error_text').text = '';
}

function failClosed(message, err) {
  showError(message);
  console.error(err);

  $w('#parent_category').disable();
  $w('#sub_category').disable();
  $w('#submit_btn').disable();
}

function showSuccess() {
  $w('#success_box').show();
  // optionally collapse form container
}
