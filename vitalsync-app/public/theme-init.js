(function() {
  try {
    const theme = localStorage.getItem('vitalsync-theme');
    const supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
    let themeToApply = theme;
    if (!themeToApply && supportDarkMode) themeToApply = '{"state":{"theme":"dark"}}';
    if (themeToApply) {
      const parsed = JSON.parse(themeToApply);
      if (parsed.state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    }
  } catch (_e) {}
})();
