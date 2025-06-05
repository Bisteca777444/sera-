
// Configurar com suas credenciais Supabase
const SUPABASE_URL = 'https://pbtnqebuvwpoeonuwbhb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidG5xZWJ1dndwb2VvbnV3YmhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNDUyMjEsImV4cCI6MjA2NDcyMTIyMX0.gM9dC11OHRLKIK9X8YHBOD1vlqhCN8zetBAzlczHPPI';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

netlifyIdentity.init();
const btnLogin = document.getElementById('btn-login');
const btnLogout = document.getElementById('btn-logout');
const btnJogar = document.getElementById('btn-jogar');
const areaApostas = document.getElementById('area-apostas');
const btnApostar = document.getElementById('btn-apostar');
const listaApostas = document.getElementById('lista-apostas');

function showLoading(show) {
  document.getElementById('loading').style.display = show ? 'flex' : 'none';
}

function updateUI() {
  const user = netlifyIdentity.currentUser();
  if (user) {
    btnLogin.style.display = 'none';
    btnLogout.style.display = 'inline-block';
    btnJogar.style.display = 'inline-block';
    areaApostas.style.display = 'block';
    loadApostas();
  } else {
    btnLogin.style.display = 'inline-block';
    btnLogout.style.display = 'none';
    btnJogar.style.display = 'none';
    areaApostas.style.display = 'none';
    listaApostas.innerHTML = '';
  }
}

btnLogin.addEventListener('click', () => netlifyIdentity.open());
btnLogout.addEventListener('click', () => netlifyIdentity.logout());
netlifyIdentity.on('login', () => { updateUI(); netlifyIdentity.close(); });
netlifyIdentity.on('logout', updateUI);

btnApostar.addEventListener('click', async () => {
  const user = netlifyIdentity.currentUser();
  if (!user) return alert('Faça login!');
  const nome = document.getElementById('input-nome').value.trim();
  const valor = parseFloat(document.getElementById('input-valor').value);
  if (!nome || isNaN(valor)) return alert('Preencha corretamente!');
  const { error } = await supabase.from('apostas').insert([{ email: user.email, nome, valor }]);
  if (error) alert('Erro: ' + error.message); else { loadApostas(); alert('Aposta registrada!'); }
});

async function loadApostas() {
  showLoading(true);
  const { data, error } = await supabase.from('apostas').select('*').order('id', { ascending: false });
  showLoading(false);
  if (error) return alert('Erro: ' + error.message);
  listaApostas.innerHTML = data.map(a => `<li>${a.nome} apostou R$${a.valor.toFixed(2)}</li>`).join('');
}

window.onload = () => { updateUI(); showLoading(false); };
