// app.js - simples gerenciador usando localStorage
(function(){
  // util
  const $ = (s, el=document) => el.querySelector(s);
  const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));
  const uuid = ()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);

  const storage = {
    get(key){ return JSON.parse(localStorage.getItem(key) || "[]"); },
    set(key, arr){ localStorage.setItem(key, JSON.stringify(arr)); }
  };

  // pages
  function filmesPage(){
    const form = $('#form-filme');
    const lista = $('#lista-filmes');
    const inputImagem = $('#imagem');
    const previewContainer = $('#preview-container');
    const previewImg = $('#preview-img');
    const removeBtn = $('#remove-img');
    let imagemBase64 = null;

    // Preview da imagem
    inputImagem.addEventListener('change', function(e){
      const file = e.target.files[0];
      if(file){
        const reader = new FileReader();
        reader.onload = function(e){
          imagemBase64 = e.target.result;
          previewImg.src = imagemBase64;
          previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    });

    // Remover imagem
    removeBtn.addEventListener('click', function(){
      imagemBase64 = null;
      inputImagem.value = '';
      previewContainer.style.display = 'none';
    });

    function render(){
      lista.innerHTML='';
      storage.get('filmes').forEach(f=>{
        const li = document.createElement('li');
        const imagemHtml = f.imagem ? `<img src="${f.imagem}" style="width:60px;height:90px;object-fit:cover;border-radius:4px;margin-right:12px;">` : '<div style="width:60px;height:90px;background:#f0f0f0;border-radius:4px;margin-right:12px;display:flex;align-items:center;justify-content:center;font-size:12px;color:#999;">Sem imagem</div>';
        
        li.innerHTML = `<div style="display:flex;align-items:center;">
          ${imagemHtml}
          <div>
            <strong>${f.titulo}</strong> 
            <div class="small">${f.genero || ''} - ${f.classificacao || ''} - ${f.duracao || ''}min</div>
            ${f.descricao ? `<div class="small" style="margin-top:4px;">${f.descricao.substring(0, 100)}${f.descricao.length > 100 ? '...' : ''}</div>` : ''}
          </div>
        </div>
        <div class="actions"><button data-id="${f.id}" class="del">Apagar</button></div>`;
        lista.appendChild(li);
      });
      $$('.del', lista).forEach(b=>b.addEventListener('click', e=>{
        const id = e.target.dataset.id;
        storage.set('filmes', storage.get('filmes').filter(x=>x.id!==id));
        render();
      }));
    }

    form.addEventListener('submit', e=>{
      e.preventDefault();
      const f = {
        id: uuid(),
        titulo: $('#titulo').value,
        genero: $('#genero').value,
        descricao: $('#descricao').value,
        classificacao: $('#classificacao').value,
        duracao: $('#duracao').value,
        estreia: $('#estreia').value,
        imagem: imagemBase64
      };
      const arr = storage.get('filmes');
      arr.push(f);
      storage.set('filmes', arr);
      form.reset();
      imagemBase64 = null;
      previewContainer.style.display = 'none';
      render();
    });

    render();
  }

  function salasPage(){
    const form = $('#form-sala');
    const lista = $('#lista-salas');

    function render(){
      lista.innerHTML='';
      storage.get('salas').forEach(s=>{
        const li = document.createElement('li');
        const recursos = [];
        if(s.acessibilidade) recursos.push('♿ Acessível');
        if(s.arcondicionado) recursos.push('❄️ Ar Cond.');
        if(s.somDolby) recursos.push('🔊 Dolby Atmos');
        const recursosText = recursos.length > 0 ? `<div class="small">${recursos.join(' • ')}</div>` : '';
        
        li.innerHTML = `<div>
          <strong>${s.nome}</strong> 
          <div class="small">${s.tipo} - ${s.capacidade} lugares</div>
          ${recursosText}
        </div>
        <div class="actions"><button data-id="${s.id}" class="del">Apagar</button></div>`;
        lista.appendChild(li);
      });
      $$('.del', lista).forEach(b=>b.addEventListener('click', e=>{
        const id = e.target.dataset.id;
        storage.set('salas', storage.get('salas').filter(x=>x.id!==id));
        render();
      }));
    }

    form.addEventListener('submit', e=>{
      e.preventDefault();
      const s = {
        id: uuid(),
        nome: $('#nomeSala').value,
        capacidade: parseInt($('#capacidade').value) || 0,
        tipo: $('#tipoSala').value,
        acessibilidade: $('#acessibilidade').checked,
        arcondicionado: $('#arcondicionado').checked,
        somDolby: $('#somDolby').checked
      };
      const arr = storage.get('salas');
      arr.push(s);
      storage.set('salas', arr);
      form.reset();
      render();
    });

    render();
  }

  function sessoesPage(){
    const form = $('#form-sessao');
    const lista = $('#lista-sessoes');
    const selFilme = $('#sessaoFilme');
    const selSala = $('#sessaoSala');

    function fillOptions(){
      selFilme.innerHTML = '<option value="">-- Selecione um filme --</option>';
      storage.get('filmes').forEach(f=>{
        const o = document.createElement('option');
        o.value = f.id; 
        o.textContent = `${f.titulo} (${f.duracao || '?'}min - ${f.classificacao || 'Livre'})`;
        selFilme.appendChild(o);
      });
      selSala.innerHTML = '<option value="">-- Selecione uma sala --</option>';
      storage.get('salas').forEach(s=>{
        const o = document.createElement('option');
        o.value = s.id; 
        o.textContent = `${s.nome} (${s.tipo} - ${s.capacidade} lugares)`;
        selSala.appendChild(o);
      });
    }

    function render(){
      lista.innerHTML='';
      const sessoes = storage.get('sessoes');
      if(sessoes.length === 0) {
        lista.innerHTML = '<li style="text-align:center;color:#999;padding:20px;">Nenhuma sessão cadastrada</li>';
        return;
      }
      
      sessoes.forEach(sess=>{
        const filme = storage.get('filmes').find(f=>f.id===sess.filmeId) || {titulo:'(filme removido)'};
        const sala = storage.get('salas').find(s=>s.id===sess.salaId) || {nome:'(sala removida)', tipo: '', capacidade: 0};
        const li = document.createElement('li');
        
        const dataFormatada = new Date(sess.dataHora).toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        li.innerHTML = `<div>
          <strong>${filme.titulo}</strong>
          <div class="small">🏛️ ${sala.nome} (${sala.tipo}) • 🕒 ${dataFormatada}</div>
          <div class="small">💰 R$ ${Number(sess.preco).toFixed(2)} • 🗣️ ${sess.idioma} • 📺 ${sess.formato}</div>
        </div>
        <div class="actions"><button data-id="${sess.id}" class="del">Apagar</button></div>`;
        lista.appendChild(li);
      });
      $$('.del', lista).forEach(b=>b.addEventListener('click', e=>{
        const id = e.target.dataset.id;
        storage.set('sessoes', storage.get('sessoes').filter(x=>x.id!==id));
        render();
      }));
    }

    form.addEventListener('submit', e=>{
      e.preventDefault();
      
      // Validações
      if(!$('#sessaoFilme').value) return alert('⚠️ Selecione um filme');
      if(!$('#sessaoSala').value) return alert('⚠️ Selecione uma sala');
      if(!$('#dataHora').value) return alert('⚠️ Informe a data e hora');
      if(!$('#preco').value) return alert('⚠️ Informe o preço');
      if(!$('#idioma').value) return alert('⚠️ Selecione o idioma');
      if(!$('#formato').value) return alert('⚠️ Selecione o formato');
      
      // Verificar se a data não é no passado
      const dataSession = new Date($('#dataHora').value);
      const agora = new Date();
      if(dataSession < agora) {
        return alert('⚠️ A data da sessão não pode ser no passado');
      }
      
      const sess = {
        id: uuid(),
        filmeId: $('#sessaoFilme').value,
        salaId: $('#sessaoSala').value,
        dataHora: $('#dataHora').value,
        preco: parseFloat($('#preco').value),
        idioma: $('#idioma').value,
        formato: $('#formato').value
      };
      const arr = storage.get('sessoes');
      arr.push(sess);
      storage.set('sessoes', arr);
      form.reset();
      fillOptions();
      render();
      alert('✅ Sessão criada com sucesso!');
    });

    fillOptions();
    render();
  }

  function listaSessoesPage(){
    const ul = $('#lista-sessoes-disponiveis');
    const arr = storage.get('sessoes');
    ul.innerHTML='';
    arr.forEach(sess=>{
      const filme = storage.get('filmes').find(f=>f.id===sess.filmeId) || {titulo:'(filme removido)', imagem: null};
      const sala = storage.get('salas').find(s=>s.id===sess.salaId) || {nome:'(sala removida)'};
      const li = document.createElement('li');
      const btn = `<button class="buy" data-id="${sess.id}">Comprar</button>`;
      const imagemHtml = filme.imagem ? `<img src="${filme.imagem}" style="width:60px;height:90px;object-fit:cover;border-radius:4px;margin-right:12px;">` : '<div style="width:60px;height:90px;background:#f0f0f0;border-radius:4px;margin-right:12px;display:flex;align-items:center;justify-content:center;font-size:12px;color:#999;">🎬</div>';
      
      li.innerHTML = `<div style="display:flex;align-items:center;">
        ${imagemHtml}
        <div>
          <strong>${filme.titulo}</strong>
          <div class="small">${sala.nome} — ${new Date(sess.dataHora).toLocaleString()} — R$ ${Number(sess.preco).toFixed(2)}</div>
          ${sess.idioma ? `<div class="small">Idioma: ${sess.idioma} | Formato: ${sess.formato || 'Digital'}</div>` : ''}
        </div>
      </div><div>${btn}</div>`;
      ul.appendChild(li);
    });
    $$('.buy', ul).forEach(b=>b.addEventListener('click', e=>{
      const id = e.target.dataset.id;
      // redirect with query param
      location.href = 'venda-ingressos.html?sessaoId=' + encodeURIComponent(id);
    }));
  }

  function vendaPage(){
    const sel = $('#vendaSessao');
    const form = $('#form-venda');
    const lista = $('#lista-ingressos');

    function fill(){
      sel.innerHTML = '<option value="">-- selecione --</option>';
      storage.get('sessoes').forEach(sess=>{
        const f = storage.get('filmes').find(x=>x.id===sess.filmeId) || {titulo:'(filme removido)'};
        const s = storage.get('salas').find(x=>x.id===sess.salaId) || {nome:'(sala removida)'};
        const o = document.createElement('option');
        o.value = sess.id;
        o.textContent = `${f.titulo} — ${new Date(sess.dataHora).toLocaleString()} — R$ ${Number(sess.preco).toFixed(2)}`;
        sel.appendChild(o);
      });

      // preselect from query param
      const params = new URLSearchParams(location.search);
      const sid = params.get('sessaoId');
      if(sid) sel.value = sid;
    }

    function render(){
      lista.innerHTML='';
      storage.get('ingressos').forEach(i=>{
        const s = storage.get('sessoes').find(x=>x.id===i.sessaoId) || {};
        const f = storage.get('filmes').find(x=>x.id===s.filmeId) || {titulo:'(filme removido)'};
        const li = document.createElement('li');
        li.innerHTML = `<div><strong>${i.cliente}</strong><div class="small">${f.titulo} — Assento ${i.assento} — ${i.pagamento}</div></div>
        <div class="actions"><button data-id="${i.id}" class="del">Apagar</button></div>`;
        lista.appendChild(li);
      });
      $$('.del', lista).forEach(b=>b.addEventListener('click', e=>{
        const id = e.target.dataset.id;
        storage.set('ingressos', storage.get('ingressos').filter(x=>x.id!==id));
        render();
      }));
    }

    form.addEventListener('submit', e=>{
      e.preventDefault();
      const ingresso = {
        id: uuid(),
        sessaoId: $('#vendaSessao').value,
        cliente: $('#cliente').value,
        cpf: $('#cpf').value,
        assento: $('#assento').value,
        pagamento: $('#pagamento').value,
        dataCompra: new Date().toISOString()
      };
      const arr = storage.get('ingressos');
      arr.push(ingresso);
      storage.set('ingressos', arr);
      form.reset();
      fill();
      render();
      alert('Venda confirmada!');
    });

    fill();
    render();
  }

  function indexPage(){
    // Atualiza estatísticas na página inicial
    function updateStats(){
      const filmes = storage.get('filmes').length;
      const salas = storage.get('salas').length;
      const sessoes = storage.get('sessoes').length;
      const ingressos = storage.get('ingressos').length;

      const totalFilmes = $('#total-filmes');
      const totalSalas = $('#total-salas');
      const totalSessoes = $('#total-sessoes');
      const totalIngressos = $('#total-ingressos');

      if(totalFilmes) totalFilmes.textContent = filmes;
      if(totalSalas) totalSalas.textContent = salas;
      if(totalSessoes) totalSessoes.textContent = sessoes;
      if(totalIngressos) totalIngressos.textContent = ingressos;
    }

    updateStats();
  }

  // router by body id
  document.addEventListener('DOMContentLoaded', ()=>{
    const id = document.body.id;
    if(id==='page-index') indexPage();
    if(id==='page-filmes') filmesPage();
    if(id==='page-salas') salasPage();
    if(id==='page-sessoes') sessoesPage();
    if(id==='page-lista-sessoes') listaSessoesPage();
    if(id==='page-venda') vendaPage();
  });
})();