(function () {
  'use strict';
  const cfg = window.AF_CONFIG;
    // Did we just come back from Google/Microsoft? (check before supabase-js clears the URL)
  const justReturnedFromOAuth = /access_token=|[?&]code=/.test(location.hash + location.search);
  if (!window.supabase || !cfg) { console.error('Supabase or config not loaded'); return; }

  const sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  const AF = window.AF = { sb };

  const SAFE_NEXT = /^[a-z0-9_-]+(\.html)?$/i;

  AF.getUser = async () => {
    const { data } = await sb.auth.getSession();
    return data.session ? data.session.user : null;
  };

  AF.getProfile = async (userId) => {
    const { data, error } = await sb.from('profiles')
      .select('*, schools(name, city)').eq('id', userId).maybeSingle();
    if (error) console.error(error);
    return data;
  };

  // provider: 'google' or 'azure' (Supabase's name for Microsoft)
  AF.signIn = (provider) => {
    const options = { redirectTo: new URL('login.html', location.href).href };
    if (provider === 'azure') options.scopes = 'email';
    return sb.auth.signInWithOAuth({ provider, options });
  };

  AF.signOut = async () => {
    await sb.auth.signOut();
    location.href = 'index.html';
  };

  // Use on pages that need a logged-in member
  AF.requireUser = async () => {
    const user = await AF.getUser();
    if (!user) {
      const page = location.pathname.split('/').pop() || '';
      location.replace('login.html' + (SAFE_NEXT.test(page) ? '?next=' + encodeURIComponent(page) : ''));
      return null;
    }
    return user;
  };

  AF.safeNext = (v) => (v && SAFE_NEXT.test(v)) ? v : null;

  /* ---------- nav buttons ---------- */
  function buildNav(user) {
    const ul = document.querySelector('.nav ul');
    if (!ul) return;
    ul.querySelectorAll('[data-af]').forEach(n => n.remove());
      const here = (location.pathname.split('/').pop() || 'index') .replace(/\.html$/, '') + '.html';

    function add(text, href, onClick) {
      const li = document.createElement('li');
      li.dataset.af = '1';
      const a = document.createElement('a');
      a.textContent = text;
      a.href = href;
      if (href === here) a.setAttribute('aria-current', 'page');
      if (onClick) a.addEventListener('click', e => { e.preventDefault(); onClick(); });
      li.appendChild(a);
      ul.appendChild(li);
    }

    if (user) { add('Dashboard', 'dashboard.html'); add('Sign out', '#', AF.signOut); }
    else      { add('Sign in', 'login.html'); }
  }

  AF.ready = AF.getUser().then(user => {
    buildNav(user);
    const here = location.pathname.split('/').pop();
    if (user && justReturnedFromOAuth && here !== 'login.html') {
      location.replace('login.html');
    }
  });
  sb.auth.onAuthStateChange((_event, session) => buildNav(session ? session.user : null));
})();