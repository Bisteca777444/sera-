function showLoading(show) {
  document.getElementById('loading').style.display = show ? 'flex' : 'none';
}

async function loadApostas() {
  showLoading(true);  // Mostrar carregando
  const { data, error } = await supabase.from('apostas').select('*').order('id', { ascending: false });
  showLoading(false); // Esconder carregando após receber dados

  if (error) return alert('Erro: ' + error.message);

  listaApostas.innerHTML = data.map(a => `<li>${a.nome} apostou R$${a.valor.toFixed(2)}</li>`).join('');
}

window.onload = () => { 
  updateUI(); 
  // Não esconder aqui mais, será feito dentro de loadApostas
};
