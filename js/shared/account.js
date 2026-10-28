// ============================================
// ACCOUNTS + BOOK — shared by index, reading and book pages.
// Backend: Supabase (client key lives in supabase-config.js; the key is public by design,
// access is restricted by row-level security on the book_profiles table).
// Username + password only: the username is mapped to a synthetic email address, which
// is never shown to the user and never receives mail.
// ============================================
(function () {
    const EMAIL_DOMAIN = 'users.numerology-book.app';
    const USERNAME_RE = /^[a-z0-9_.-]{3,30}$/;
    const MIN_PASSWORD = 6;
    const MAX_NAME = 80;
    const TABLE = 'book_profiles';

    const configured = !!(window.SUPABASE_URL && window.SUPABASE_ANON_KEY && window.supabase);
    const client = configured ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY) : null;

    let username = null;
    const changeListeners = [];

    // ---------- tiny DOM helper ----------
    function el(tag, attrs, ...children) {
        const node = document.createElement(tag);
        for (const [k, v] of Object.entries(attrs || {})) {
            if (k === 'class') node.className = v;
            else if (k === 'text') node.textContent = v;
            else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
            else node.setAttribute(k, v);
        }
        children.flat().forEach(c => c && node.append(c));
        return node;
    }

    // ---------- styles (theme variables only, so Classic and Warm both work) ----------
    const style = el('style', { text: `
        .acct-wrap { position: relative; margin-left: auto; margin-right: 10px; display: inline-flex; flex-shrink: 0; }
        .acct-btn {
            display: inline-flex; align-items: center; justify-content: center;
            width: 34px; height: 34px; padding: 0; border-radius: 50%;
            background: var(--th-surface, #fff); color: var(--th-text-secondary);
            border: 1px solid var(--th-border-light, rgba(0,0,0,0.05));
            box-shadow: 0 1px 4px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6);
            font: 700 0.85rem 'Inter', sans-serif; text-transform: uppercase; cursor: pointer;
            transition: transform 0.15s cubic-bezier(0.2, 0, 0, 1), background-color 0.2s, color 0.2s, box-shadow 0.2s;
        }
        .acct-btn:hover { background: var(--th-surface-alt); color: var(--th-accent); transform: translateY(-1px); }
        .acct-btn:active { transform: scale(0.96); }
        .acct-btn.acct-in { background: var(--th-accent); color: #fff; border-color: transparent; }
        .acct-btn.acct-in:hover { background: var(--th-accent-hover); color: #fff; }
        .acct-menu {
            position: absolute; top: calc(100% + 8px); right: 0; z-index: 60; min-width: 190px;
            background: var(--th-surface); border: 1px solid var(--th-border-light); border-radius: 16px;
            padding: 6px; box-shadow: var(--th-card-hover-shadow, 0 8px 30px rgba(0,0,0,0.15));
            animation: acct-pop 0.18s cubic-bezier(0.2, 0, 0, 1); transform-origin: top right;
        }
        .acct-menu[hidden] { display: none; }
        .acct-menu-who { padding: 8px 12px 6px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em;
            text-transform: uppercase; color: var(--th-text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .acct-menu-item {
            display: block; width: 100%; text-align: left; padding: 9px 12px; border: none; border-radius: 10px;
            background: transparent; color: var(--th-text); font: 600 0.85rem 'Inter', sans-serif;
            text-decoration: none; cursor: pointer; box-sizing: border-box;
        }
        .acct-menu-item:hover { background: var(--th-surface-alt); color: var(--th-accent); }
        @keyframes acct-pop { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }

        .acct-overlay {
            position: fixed; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center;
            padding: 16px; background: rgba(40, 28, 20, 0.45); animation: acct-fade 0.2s ease;
        }
        @keyframes acct-fade { from { opacity: 0; } to { opacity: 1; } }
        .acct-card {
            width: 100%; max-width: 400px; max-height: 100%; overflow-y: auto; box-sizing: border-box;
            background: var(--th-surface); border-radius: 24px; padding: 28px 28px 24px;
            box-shadow: 0 12px 48px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.8);
            animation: acct-pop 0.22s cubic-bezier(0.2, 0, 0, 1);
        }
        .acct-title { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 600;
            color: var(--th-text); margin: 0 0 6px; text-wrap: balance; }
        .acct-desc { font-size: 0.82rem; color: var(--th-text-muted); margin: 0 0 20px; text-wrap: pretty; }
        .acct-tabs { display: flex; gap: 4px; margin-bottom: 20px; padding: 3px; border-radius: 30px;
            background: var(--th-toggle-bg); border: 1px solid var(--th-toggle-border); }
        .acct-tab { flex: 1; padding: 7px 10px; border: none; border-radius: 20px; background: transparent;
            color: var(--th-toggle-text); font: 600 0.8rem 'Inter', sans-serif; cursor: pointer; transition: all 0.2s; }
        .acct-tab.active { background: var(--th-toggle-active-bg); color: var(--th-toggle-active-text);
            box-shadow: 0 2px 8px rgba(0,0,0,0.12); }
        .acct-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        .acct-field label { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em;
            text-transform: uppercase; color: var(--th-text-secondary); }
        .acct-input { width: 100%; padding: 11px 14px; border-radius: 12px; border: 1.5px solid var(--th-input-border);
            background: var(--th-input-bg); color: var(--th-text); font: 400 0.92rem 'Inter', sans-serif;
            box-sizing: border-box; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
        .acct-input:focus { border-color: var(--th-accent); box-shadow: 0 0 0 3px var(--th-input-focus-shadow); }
        .acct-error { min-height: 1.2em; margin: 0 0 12px; font-size: 0.8rem; color: #c0392b; }
        .acct-actions { display: flex; gap: 10px; }
        .acct-primary, .acct-secondary { padding: 12px 18px; border-radius: 14px; font: 700 0.86rem 'Inter', sans-serif;
            cursor: pointer; transition: background 0.2s, transform 0.15s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s; }
        .acct-primary { flex: 1; border: none; background: var(--th-accent); color: #fff;
            box-shadow: 0 3px 12px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.2); }
        .acct-primary:hover { background: var(--th-accent-hover); }
        .acct-primary:disabled { opacity: 0.6; cursor: default; }
        .acct-secondary { border: 1.5px solid var(--th-input-border); background: transparent; color: var(--th-text-secondary); }
        .acct-secondary:hover { background: var(--th-surface-alt); color: var(--th-text); }
        .acct-primary:active, .acct-secondary:active { transform: scale(0.96); }
        @media (max-width: 600px) {
            .acct-card { padding: 24px 20px 20px; border-radius: 20px; }
            .acct-input { font-size: 16px; } /* stops iOS zoom-on-focus */
        }
    ` });
    document.head.append(style);

    // ---------- modal ----------
    function openModal(card) {
        const returnFocus = document.activeElement;
        const overlay = el('div', { class: 'acct-overlay' }, card);
        card.setAttribute('role', 'dialog');
        card.setAttribute('aria-modal', 'true');
        let closed = false;
        const onKey = (e) => { if (e.key === 'Escape') close(); };
        function close() {
            if (closed) return;
            closed = true;
            document.removeEventListener('keydown', onKey);
            overlay.remove();
            if (returnFocus && returnFocus.focus) returnFocus.focus();
            if (modal.onclose) modal.onclose();
        }
        overlay.addEventListener('mousedown', (e) => { if (e.target === overlay) close(); });
        document.addEventListener('keydown', onKey);
        document.body.append(overlay);
        const first = card.querySelector('input, button');
        if (first) first.focus();
        const modal = { close, onclose: null };
        return modal;
    }

    // ---------- auth modal ----------
    // Resolves true if the user ends up logged in, false if they close the dialog.
    function openAuth(initialMode) {
        return new Promise((resolve) => {
            let mode = initialMode === 'signup' ? 'signup' : 'login';
            let succeeded = false;

            const title = el('h2', { class: 'acct-title', id: 'acctTitle' });
            const desc = el('p', { class: 'acct-desc' });
            const tabLogin = el('button', { class: 'acct-tab', type: 'button', text: 'Log in' });
            const tabSignup = el('button', { class: 'acct-tab', type: 'button', text: 'Sign up' });
            const userInput = el('input', { class: 'acct-input', id: 'acctUser', type: 'text', autocomplete: 'username',
                autocapitalize: 'none', spellcheck: 'false', maxlength: '30' });
            const passInput = el('input', { class: 'acct-input', id: 'acctPass', type: 'password', maxlength: '72' });
            const error = el('p', { class: 'acct-error', role: 'alert' });
            const submit = el('button', { class: 'acct-primary', type: 'submit' });
            const cancel = el('button', { class: 'acct-secondary', type: 'button', text: 'Cancel' });

            const form = el('form', { novalidate: '' },
                el('div', { class: 'acct-field' }, el('label', { for: 'acctUser', text: 'Username' }), userInput),
                el('div', { class: 'acct-field' }, el('label', { for: 'acctPass', text: 'Password' }), passInput),
                error,
                el('div', { class: 'acct-actions' }, cancel, submit));
            const card = el('div', { class: 'acct-card', 'aria-labelledby': 'acctTitle' },
                title, desc, el('div', { class: 'acct-tabs' }, tabLogin, tabSignup), form);
            const modal = openModal(card);
            modal.onclose = () => resolve(succeeded);

            function render() {
                const signup = mode === 'signup';
                tabLogin.classList.toggle('active', !signup);
                tabSignup.classList.toggle('active', signup);
                title.textContent = signup ? 'Create your account' : 'Welcome back';
                desc.textContent = signup
                    ? 'Just a username and password. There is no email and no password reset, so keep your password safe.'
                    : 'Log in to open your Book.';
                submit.textContent = signup ? 'Sign up' : 'Log in';
                passInput.setAttribute('autocomplete', signup ? 'new-password' : 'current-password');
                error.textContent = configured ? '' : 'Accounts are not set up yet: supabase-config.js has no project URL/key.';
            }
            tabLogin.addEventListener('click', () => { mode = 'login'; render(); userInput.focus(); });
            tabSignup.addEventListener('click', () => { mode = 'signup'; render(); userInput.focus(); });
            cancel.addEventListener('click', () => modal.close());

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (!configured) return;
                const name = userInput.value.trim();
                const key = name.toLowerCase();
                const pass = passInput.value;
                if (!USERNAME_RE.test(key)) { error.textContent = 'Username: 3-30 letters, numbers, dot, dash or underscore.'; return; }
                if (pass.length < MIN_PASSWORD) { error.textContent = `Password must be at least ${MIN_PASSWORD} characters.`; return; }

                submit.disabled = true;
                error.textContent = '';
                const email = `${key}@${EMAIL_DOMAIN}`;
                try {
                    if (mode === 'signup') {
                        const { data, error: err } = await client.auth.signUp({ email, password: pass, options: { data: { username: name } } });
                        if (err) throw err;
                        if (!data.session) throw new Error('CONFIRMATION_ON');
                    } else {
                        const { error: err } = await client.auth.signInWithPassword({ email, password: pass });
                        if (err) throw err;
                    }
                    succeeded = true;
                    modal.close();
                } catch (err) {
                    const msg = String(err && err.message || err);
                    if (/already registered|already been registered/i.test(msg)) error.textContent = 'That username is taken.';
                    else if (/invalid login/i.test(msg)) error.textContent = 'Wrong username or password.';
                    else if (msg === 'CONFIRMATION_ON') error.textContent = 'Account created, but email confirmation is still on in Supabase. Turn it off, then log in.';
                    else if (/failed to fetch|network/i.test(msg)) error.textContent = 'Could not reach the server. Check your connection.';
                    else error.textContent = msg;
                } finally {
                    submit.disabled = false;
                }
            });
            render();
        });
    }

    // ---------- name prompt ----------
    // Resolves with the trimmed name, or null if cancelled.
    function askName(opts) {
        const o = Object.assign({ title: 'Add to Book', desc: '', label: 'Name', value: '', confirm: 'Save' }, opts);
        return new Promise((resolve) => {
            let result = null;
            const input = el('input', { class: 'acct-input', id: 'acctName', type: 'text', maxlength: String(MAX_NAME), autocomplete: 'off' });
            input.value = o.value;
            const error = el('p', { class: 'acct-error', role: 'alert' });
            const cancel = el('button', { class: 'acct-secondary', type: 'button', text: 'Cancel' });
            const form = el('form', { novalidate: '' },
                el('div', { class: 'acct-field' }, el('label', { for: 'acctName', text: o.label }), input),
                error,
                el('div', { class: 'acct-actions' }, cancel, el('button', { class: 'acct-primary', type: 'submit', text: o.confirm })));
            const card = el('div', { class: 'acct-card', 'aria-labelledby': 'acctNameTitle' },
                el('h2', { class: 'acct-title', id: 'acctNameTitle', text: o.title }),
                o.desc ? el('p', { class: 'acct-desc', text: o.desc }) : null,
                form);
            const modal = openModal(card);
            modal.onclose = () => resolve(result);
            input.select();
            cancel.addEventListener('click', () => modal.close());
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const v = input.value.trim();
                if (!v) { error.textContent = 'Please enter a name.'; return; }
                result = v;
                modal.close();
            });
        });
    }

    // ---------- header account button + menu ----------
    const btn = el('button', { class: 'acct-btn', type: 'button', 'aria-haspopup': 'menu', 'aria-expanded': 'false', 'aria-label': 'Account' });
    const menu = el('div', { class: 'acct-menu', role: 'menu', hidden: '' });
    const wrap = el('div', { class: 'acct-wrap' }, btn, menu);

    const USER_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"></path></svg>';

    function setMenuOpen(open) {
        menu.hidden = !open;
        btn.setAttribute('aria-expanded', String(open));
    }

    function renderHeader() {
        if (username) {
            btn.textContent = username[0];
            btn.classList.add('acct-in');
            btn.title = `Signed in as ${username}`;
        } else {
            btn.innerHTML = USER_ICON;
            btn.classList.remove('acct-in');
            btn.title = 'Log in';
        }
        menu.replaceChildren();
        const item = (text, onClick) => el('button', { class: 'acct-menu-item', type: 'button', role: 'menuitem', text, onclick: () => { setMenuOpen(false); onClick(); } });
        if (username) {
            menu.append(
                el('div', { class: 'acct-menu-who', text: username }),
                el('a', { class: 'acct-menu-item', role: 'menuitem', href: 'book.html', text: 'My Book' }),
                item('Log out', () => Account.logout()));
        } else {
            menu.append(item('Log in', () => openAuth('login')), item('Sign up', () => openAuth('signup')));
        }
    }

    btn.addEventListener('click', () => setMenuOpen(menu.hidden));
    document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) setMenuOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenuOpen(false); });

    const anchor = document.querySelector('.theme-cycle-btn');
    if (anchor) anchor.before(wrap);
    renderHeader();

    // ---------- session ----------
    function setUser(user) {
        username = user ? (user.user_metadata && user.user_metadata.username) || String(user.email).split('@')[0] : null;
        renderHeader();
        changeListeners.forEach(fn => fn(username));
    }

    let ready = Promise.resolve();
    if (configured) {
        client.auth.onAuthStateChange((_event, session) => setUser(session && session.user));
        ready = client.auth.getSession().then(({ data }) => setUser(data.session && data.session.user));
    }

    // ---------- data ----------
    function requireClient() {
        if (!configured) throw new Error('Accounts are not set up yet (supabase-config.js is empty).');
        return client;
    }

    const Account = {
        get username() { return username; },
        get configured() { return configured; },
        ready,
        onChange(fn) { changeListeners.push(fn); },
        openAuth,
        askName,

        // Resolves true when logged in (immediately, or after the user completes the dialog).
        async requireLogin() {
            await ready;
            if (username) return true;
            return openAuth('login');
        },

        async logout() {
            const { error } = await requireClient().auth.signOut();
            if (error) throw error;
        },

        async listProfiles() {
            const { data, error } = await requireClient().from(TABLE).select('id, name, birthdate').order('name', { ascending: true });
            if (error) throw error;
            return data;
        },

        async addProfile(name, birthdate) {
            const { error } = await requireClient().from(TABLE).insert({ name, birthdate });
            if (error) throw error;
        },

        async renameProfile(id, name) {
            const { error } = await requireClient().from(TABLE).update({ name }).eq('id', id);
            if (error) throw error;
        },

        async deleteProfile(id) {
            const { error } = await requireClient().from(TABLE).delete().eq('id', id);
            if (error) throw error;
        }
    };
    window.Account = Account;
})();
