(() => {
  const $ = (sel) => document.querySelector(sel);
  const baseInput = $('#baseUrl');
  const setBase = $('#setBase');
  const pathInput = $('#path');
  const methodInput = $('#method');
  const bodyInput = $('#body');
  const sendBtn = $('#sendBtn');
  const responsePre = $('#response');
  const logPre = $('#log');
  const authTokenInput = $('#authToken');
  const saveTokenBtn = $('#saveToken');
  const clearTokenBtn = $('#clearToken');
  const previewBtn = $('#previewBtn');
  const copyPayloadBtn = $('#copyPayload');

  function log(...args) {
    const time = new Date().toLocaleTimeString();
    logPre.textContent = `${time} - ${args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')}\n` + logPre.textContent;
  }

  function getBase() {
    return (baseInput.value || '').replace(/\/+$/, '');
  }

  async function sendRequest(method, path, body) {
    const base = getBase();
    if (!base) {
      alert('Rellena la Base API URL antes de enviar.');
      return;
    }

    const url = base + path;
    log('REQUEST', method, url, body || '');

    // sanitize body according to endpoint (extra safety server-side validation disallows unknown keys)
    let bodyToSend = body;
    try {
      if (method === 'POST' && path && path.includes('/auth/login')) {
        bodyToSend = { email: body && body.email, password: body && body.password };
      }
    } catch (_e) { bodyToSend = body; }

    const opts = { method, headers: {} };
    // attach Authorization header if token present
      try {
        const t = authTokenInput && authTokenInput.value && authTokenInput.value.trim();
        if (t) opts.headers['Authorization'] = t;
      } catch (_e) { /* ignore */ }
    if (bodyToSend && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(bodyToSend);
    }

    // display the outgoing payload (final) in the UI for debugging
    try {
      const outgoingPre = document.getElementById('outgoing');
      if (outgoingPre) {
        const display = { method, url, headers: opts.headers, body: bodyToSend || null };
        outgoingPre.textContent = JSON.stringify(display, null, 2);
      }
    } catch (_e) { /* ignore UI errors */ }

    try {
      const res = await fetch(url, opts);
    const text = await res.text();
    let parsed;
    try { parsed = JSON.parse(text); } catch (_e) { parsed = text; }
    responsePre.textContent = JSON.stringify({ status: res.status, ok: res.ok, body: parsed }, null, 2);
    // store last parsed response to allow extracting token
    window.__apiDemo = window.__apiDemo || {};
    window.__apiDemo.lastParsed = parsed;
    log('RESPONSE', res.status);
    } catch (error) {
      responsePre.textContent = error.toString();
      log('ERROR', error.toString());
    }
  }

  // Wire sidebar buttons
  document.querySelectorAll('.sidebar .call').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const path = btn.getAttribute('data-path') || '';
      const method = btn.getAttribute('data-method') || 'GET';
      pathInput.value = path;
      methodInput.value = method;
      // provide a small hint body for common endpoints
      if (method === 'POST' && path.includes('/auth/register')) {
        // backend expects: email, password, displayName, username
        bodyInput.value = JSON.stringify({ displayName: 'Demo User', username: 'demouser', email: 'demo@example.com', password: 'secret' }, null, 2);
      } else if (method === 'POST' && path.includes('/auth/login')) {
        bodyInput.value = JSON.stringify({ email: 'demo@example.com', password: 'secret' }, null, 2);
      } else if (method === 'POST' && path === '/projects') {
        // backend expects: userId, name, language, optional description/template
        bodyInput.value = JSON.stringify({ userId: 'demoUserId', name: 'Demo project', language: 'javascript', description: 'Creado desde demo' }, null, 2);
      } else if (method === 'POST' && path === '/executions') {
        bodyInput.value = JSON.stringify({ language: 'javascript', code: 'console.log("hola")' }, null, 2);
      } else {
        // keep existing body
      }
    });
  });

  setBase.addEventListener('click', () => {
    const base = getBase();
    if (!base) { alert('Introduce una Base API URL válida'); return; }
    log('Base API URL seteada a', base);
  });

  // token helpers: persist token to localStorage and wire buttons
  function loadSavedToken() {
    try {
      const t = localStorage.getItem('apiDemo.authToken');
      if (t) authTokenInput.value = t;
    } catch (_e) { /* ignore */ }
  }

  function saveToken(val) {
    try {
      localStorage.setItem('apiDemo.authToken', val || '');
      authTokenInput.value = val || '';
      log('Token guardado');
    } catch (_e) { log('No se pudo guardar token:', _e.message); }
  }

  function clearToken() {
    try { localStorage.removeItem('apiDemo.authToken'); authTokenInput.value = ''; log('Token limpiado'); } catch (_e) { log('No se pudo limpiar token:', _e.message); }
  }

  if (saveTokenBtn) saveTokenBtn.addEventListener('click', () => saveToken(authTokenInput.value.trim()));
  if (clearTokenBtn) clearTokenBtn.addEventListener('click', clearToken);
  loadSavedToken();

  // Preview payload without sending (useful when Base URL missing)
  function buildFinalPayloadForPreview(path, method, body) {
    let finalBody = body;
    try {
      if (path && path.includes('/auth/register')) {
        if (finalBody && Object.prototype.hasOwnProperty.call(finalBody, 'name') && !Object.prototype.hasOwnProperty.call(finalBody, 'displayName')) {
          finalBody.displayName = finalBody.name;
          delete finalBody.name;
        }
        if (finalBody && !finalBody.username) {
          if (finalBody.email) {
            const u = String(finalBody.email).split('@')[0].replace(/[^a-z0-9]/ig, '').toLowerCase().slice(0,20);
            if (u) finalBody.username = u;
          } else if (finalBody.displayName) {
            const u = String(finalBody.displayName).replace(/\s+/g,'').replace(/[^a-z0-9]/ig,'').toLowerCase().slice(0,20);
            if (u) finalBody.username = u;
          }
        }
      }
      if (path && path.includes('/auth/login') && finalBody) {
        finalBody = { email: finalBody.email, password: finalBody.password };
      }
    } catch (_e) { /* ignore */ }
    const headers = {};
    try {
      const t = authTokenInput && authTokenInput.value && authTokenInput.value.trim();
      if (t) headers['Authorization'] = t;
    } catch (_e) {}
    if (finalBody && (method === 'POST' || method === 'PUT' || method === 'PATCH')) headers['Content-Type'] = 'application/json';
    return { method, headers, body: finalBody || null };
  }

  if (previewBtn) previewBtn.addEventListener('click', () => {
    const path = (pathInput.value || '').trim();
    const method = (methodInput.value || 'GET').toUpperCase();
    let parsedBody = null;
    if (bodyInput.value.trim()) {
      try { parsedBody = JSON.parse(bodyInput.value); } catch (_e) { alert('Body inválido JSON: ' + _e.message); return; }
    }
    const preview = buildFinalPayloadForPreview(path, method, parsedBody);
    const outgoingPre = document.getElementById('outgoing');
    if (outgoingPre) outgoingPre.textContent = JSON.stringify(preview, null, 2);
    log('Preview generado');
  });

  if (copyPayloadBtn) copyPayloadBtn.addEventListener('click', async () => {
    try {
      const outgoingPre = document.getElementById('outgoing');
      if (!outgoingPre) { alert('No hay payload para copiar'); return; }
      await navigator.clipboard.writeText(outgoingPre.textContent);
      log('Payload copiado al portapapeles');
      alert('Payload copiado al portapapeles');
    } catch (err) {
      alert('No se pudo copiar: ' + (err && err.message));
    }
  });

  sendBtn.addEventListener('click', async () => {
    let path = pathInput.value.trim();
    if (!path.startsWith('/')) path = '/' + path;
    const method = (methodInput.value || 'GET').toUpperCase();
    let body = null;
    if (bodyInput.value.trim()) {
      try { body = JSON.parse(bodyInput.value); }
      catch (e) { alert('Body inválido JSON: ' + e.message); return; }
    }

    // Normalize only for endpoints that expect these fields (avoid adding extras to /auth/login)
    try {
      if (path && path.includes('/auth/register')) {
        if (body && Object.prototype.hasOwnProperty.call(body, 'name') && !Object.prototype.hasOwnProperty.call(body, 'displayName')) {
          body.displayName = body.name;
          delete body.name;
        }
        if (body && !body.username) {
          if (body.email) {
            const u = String(body.email).split('@')[0].replace(/[^a-z0-9]/ig, '').toLowerCase().slice(0,20);
            if (u) body.username = u;
          } else if (body.displayName) {
            const u = String(body.displayName).replace(/\s+/g,'').replace(/[^a-z0-9]/ig,'').toLowerCase().slice(0,20);
            if (u) body.username = u;
          }
        }
      }
      // For login, ensure we only send email and password (Joi in backend rejects unknown fields)
      if (path && path.includes('/auth/login') && body) {
        body = { email: body.email, password: body.password };
      }
    } catch (_e) { /* ignore normalization errors */ }

    // Replace placeholders like {id} if left as {xxx} -> prompt for value
    const placeholders = Array.from(path.matchAll(/\{([^}]+)\}/g)).map(m => m[1]);
    for (const ph of placeholders) {
      const val = prompt(`Valor para ${ph}:`);
      if (val === null) { log('Cancelado por usuario'); return; }
      path = path.replace(new RegExp('\\{' + ph + '\\}','g'), encodeURIComponent(val));
    }

    // Client-side validation for known endpoints to avoid 400 from backend
    try {
      if (method === 'POST' && path.includes('/auth/register')) {
        const required = ['displayName', 'username', 'email', 'password'];
        const missing = required.filter(f => !(body && Object.prototype.hasOwnProperty.call(body, f) && body[f]));
        if (missing.length) { alert('Faltan campos obligatorios en el body: ' + missing.join(', ')); return; }
      }
      if (method === 'POST' && path === '/projects') {
        const required = ['userId', 'name', 'language'];
        const missing = required.filter(f => !(body && Object.prototype.hasOwnProperty.call(body, f) && body[f]));
        if (missing.length) { alert('Faltan campos obligatorios en el body: ' + missing.join(', ')); return; }
      }
    } catch (_e) { /* ignore validation errors */ }

    await sendRequest(method, path, body);
  });

  // quick load: set click on demo root to fill base with common firebase pattern (not required)
  // expose helpers for console
  window.__apiDemo = window.__apiDemo || {};
  window.__apiDemo.sendRequest = sendRequest;
  // helper to extract token from last parsed response using common keys
  window.__apiDemo.saveTokenFromLastResponse = () => {
    const parsed = window.__apiDemo.lastParsed;
    if (!parsed) { alert('No hay respuesta parseada disponible'); return; }
    const candidates = [];
    if (typeof parsed === 'object' && parsed !== null) {
      const check = (o, key) => { if (o && Object.prototype.hasOwnProperty.call(o, key) && o[key]) candidates.push(o[key]); };
      check(parsed, 'token');
      check(parsed, 'accessToken');
      check(parsed, 'idToken');
      check(parsed, 'refreshToken');
      if (parsed.data) { check(parsed.data, 'token'); check(parsed.data, 'accessToken'); }
      if (parsed.result) { check(parsed.result, 'token'); check(parsed.result, 'accessToken'); }
      if (parsed.body) { check(parsed.body, 'token'); }
    }
    const found = candidates.length ? String(candidates[0]) : null;
    if (found) {
      saveToken(found);
      alert('Token extraído y guardado.');
    } else {
      alert('No se encontró token automáticamente en la última respuesta. Revisa el JSON y copia manualmente.');
    }
  };

  log('Demo listo');
})();
