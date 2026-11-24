/**
 * HeyClicky Companion Extension - Content Script
 * Extracts readable DOM context, defends against prompt injections,
 * and strictly safeguards password/card fields.
 */

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'GET_SANITIZED_DOM') {
    const data = extractPageContext();
    sendResponse(data);
  }
});

function extractPageContext() {
  const title = document.title;
  const url = window.location.href;

  // Extract clean text, ignoring scripts, styles, and hidden inputs
  const clone = document.body.cloneNode(true) as HTMLElement;

  // 1. Remove dangerous or non-content tags
  const tagsToRemove = ['script', 'style', 'noscript', 'svg', 'iframe'];
  for (const tag of tagsToRemove) {
    const elements = clone.getElementsByTagName(tag);
    while (elements.length > 0) {
      elements[0].parentNode?.removeChild(elements[0]);
    }
  }

  // 2. Strict Security: Redact any password, credit card, or CVV input elements
  const sensitiveInputs = clone.querySelectorAll('input[type="password"], input[name*="card"], input[name*="cvv"], input[name*="otp"]');
  sensitiveInputs.forEach((el) => {
    el.setAttribute('value', '[PROTECTED_FIELD]');
  });

  let rawText = clone.innerText || '';

  // 3. Prompt-Injection Defense:
  // Detect and neutralize adversarial prompt-injection cues embedded inside webpage text
  const injectionPatterns = [
    /ignore previous instructions/gi,
    /disregard all prior instructions/gi,
    /system prompt override/gi,
    /you are now an evil ai/gi,
  ];

  for (const pattern of injectionPatterns) {
    rawText = rawText.replace(pattern, '[SUSPICIOUS_PROMPT_INJECTION_STRIPPED]');
  }

  // Cap size at 40,000 characters to prevent buffer blowout
  const cappedText = rawText.slice(0, 40000);

  return {
    title,
    url,
    content: cappedText,
    timestamp: Date.now(),
  };
}
