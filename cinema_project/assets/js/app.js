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

    function render(){
      lista.innerHTML='';
      storage.get('filmes').forEach(f=>{
        const li = document.createElement('li');
        li.innerHTML = `<div><strong>${f.titulo}</strong> <div class="small">${f.genero || ''} - ${f.classificacao || ''} - ${f.duracao || ''}min</div></div>
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
        estreia: $('#estreia').value
      };
      const arr = storage.get('filmes');
      arr.push(f);
      storage.set('filmes', arr);
      form.reset();
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
        li.innerHTML = `<div><strong>${s.nome}</strong> <div class="small">${s.tipo} - ${s.capacidade} lugares</div></div>
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
        tipo: $('#tipoSala').value
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
      selFilme.innerHTML = '<option value="">-- selecione --</option>';
      storage.get('filmes').forEach(f=>{
        const o = document.createElement('option');
        o.value = f.id; o.textContent = f.titulo;
        selFilme.appendChild(o);
      });
      selSala.innerHTML = '<option value="">-- selecione --</option>';
      storage.get('salas').forEach(s=>{
        const o = document.createElement('option');
        o.value = s.id; o.textContent = s.nome + ' ('+s.tipo+')';
        selSala.appendChild(o);
      });
    }

    function render(){
      lista.innerHTML='';
      storage.get('sessoes').forEach(sess=>{
        const filme = storage.get('filmes').find(f=>f.id===sess.filmeId) || {titulo:'(filme removido)'};
        const sala = storage.get('salas').find(s=>s.id===sess.salaId) || {nome:'(sala removida)'};
        const li = document.createElement('li');
        li.innerHTML = `<div><strong>${filme.titulo}</strong><div class="small">${sala.nome} — ${new Date(sess.dataHora).toLocaleString()} — R$ ${Number(sess.preco).toFixed(2)}</div></div>
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
      if(!$('#sessaoFilme').value || !$('#sessaoSala').value) return alert('Selecione filme e sala');
      const sess = {
        id: uuid(),
        filmeId: $('#sessaoFilme').value,
        salaId: $('#sessaoSala').value,
        dataHora: $('#dataHora').value,
        preco: $('#preco').value,
        idioma: $('#idioma').value,
        formato: $('#formato').value
      };
      const arr = storage.get('sessoes');
      arr.push(sess);
      storage.set('sessoes', arr);
      form.reset();
      fillOptions();
      render();
    });

    fillOptions();
    render();
  }

  function listaSessoesPage(){
    const ul = $('#lista-sessoes-disponiveis');
    const arr = storage.get('sessoes');
    ul.innerHTML='';
    arr.forEach(sess=>{
      const filme = storage.get('filmes').find(f=>f.id===sess.filmeId) || {titulo:'(filme removido)'};
      const sala = storage.get('salas').find(s=>s.id===sess.salaId) || {nome:'(sala removida)'};
      const li = document.createElement('li');
      const btn = `<button class="buy" data-id="${sess.id}">Comprar</button>`;
      li.innerHTML = `<div><strong>${filme.titulo}</strong><div class="small">${sala.nome} — ${new Date(sess.dataHora).toLocaleString()} — R$ ${Number(sess.preco).toFixed(2)}</div></div><div>${btn}</div>`;
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

  // router by body id
  document.addEventListener('DOMContentLoaded', ()=>{
    const id = document.body.id;
    if(id==='page-filmes') filmesPage();
    if(id==='page-salas') salasPage();
    if(id==='page-sessoes') sessoesPage();
    if(id==='page-lista-sessoes') listaSessoesPage();
    if(id==='page-venda') vendaPage();
    // index has no script
  });
})();