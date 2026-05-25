document.querySelector('.menu-toggle')?.addEventListener('click',()=>document.querySelector('.nav-links')?.classList.toggle('open'));
if (window.netlifyIdentity) {
  window.netlifyIdentity.on('init', user => {
    if (!user && window.location.hash.includes('_token=')) window.netlifyIdentity.open();
  });
}
