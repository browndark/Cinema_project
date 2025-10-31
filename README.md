# CinemaGO - Sistema de Gerenciamento de Cinema

## Descrição do Projeto

O CinemaGO é um sistema web para gerenciamento de cinema desenvolvido como projeto acadêmico. O sistema permite cadastrar filmes, salas, sessões e realizar vendas de ingressos, com todos os dados armazenados localmente no navegador.

## Funcionalidades

### Cadastro de Filmes
- Cadastro completo de filmes com título, gênero, descrição, classificação e duração
- Upload e visualização de imagens dos filmes
- Listagem de filmes cadastrados com miniaturas das imagens
- Armazenamento das imagens em formato Base64 no navegador

### Cadastro de Salas
- Criação de salas com nome, capacidade e tipo (2D, 3D, IMAX, 4DX, VIP)
- Recursos especiais configuráveis: acessibilidade, ar condicionado, som Dolby Atmos
- Validação de capacidade máxima
- Listagem organizada com informações dos recursos

### Cadastro de Sessões
- Criação de sessões relacionando filmes às salas
- Configuração de data, horário e preço
- Opções de idioma (dublado, legendado, original) e formato
- Validações inteligentes para evitar sessões no passado
- Interface com grid responsivo para organização dos campos

### Listagem de Sessões
- Visualização de todas as sessões disponíveis
- Exibição das imagens dos filmes nas listagens
- Informações completas: sala, horário, preço, idioma e formato
- Botão de compra que redireciona para venda de ingressos

### Venda de Ingressos
- Sistema de venda com preenchimento automático da sessão
- Cadastro de dados do cliente (nome, CPF)
- Seleção de assento e forma de pagamento
- Histórico de ingressos vendidos

### Página Inicial
- Dashboard com estatísticas em tempo real
- Contadores de filmes, salas, sessões e ingressos cadastrados
- Guia passo a passo para uso do sistema
- Design moderno com seções organizadas

## Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura das páginas com semântica adequada
- **CSS3**: Estilização moderna com grid layout e design responsivo
- **JavaScript**: Funcionalidades interativas e manipulação de dados

### Armazenamento
- **LocalStorage**: Persistência de dados no navegador
- **Base64**: Codificação de imagens para armazenamento local

### Recursos Técnicos
- Design responsivo que adapta a diferentes tamanhos de tela
- Upload de arquivos com preview de imagens
- Validação de formulários em tempo real
- Sistema de roteamento baseado em IDs das páginas
- Manipulação de DOM com JavaScript vanilla

## Estrutura do Projeto

```
Cinema_project/
├── cinema_project/
│   ├── index.html              # Página inicial
│   ├── cadastro-filmes.html    # Cadastro de filmes
│   ├── cadastro-salas.html     # Cadastro de salas
│   ├── cadastro-sessoes.html   # Cadastro de sessões
│   ├── sessoes.html            # Listagem de sessões
│   ├── venda-ingressos.html    # Venda de ingressos
│   └── assets/
│       ├── css/
│       │   └── style.css       # Estilos do projeto
│       └── js/
│           └── app.js          # Lógica da aplicação
└── README.md                   # Documentação
```

## Como Executar

1. **Baixar o projeto**
   ```bash
   git clone https://github.com/browndark/Cinema_project.git
   cd Cinema_project/cinema_project
   ```

2. **Executar servidor local**
   ```bash
   python -m http.server 8000
   ```

3. **Acessar no navegador**
   - Abra o navegador e acesse: http://localhost:8000

## Como Usar o Sistema

### Primeiros Passos
1. **Cadastre pelo menos um filme** na seção "Cadastro de Filmes"
2. **Cadastre pelo menos uma sala** na seção "Cadastro de Salas"
3. **Crie sessões** relacionando filmes às salas na seção "Cadastro de Sessões"

### Processo de Venda
1. Acesse "Sessões Disponíveis"
2. Clique no botão "Comprar" da sessão desejada
3. Preencha os dados do cliente na tela de venda
4. Confirme a venda

### Recursos Especiais
- **Upload de Imagens**: Use o campo de arquivo no cadastro de filmes
- **Preview**: Visualize a imagem antes de salvar
- **Validações**: O sistema impede criação de sessões no passado
- **Persistência**: Todos os dados ficam salvos no navegador

## Arquitetura da Aplicação

### Padrão de Organização
- **Separação de responsabilidades**: HTML para estrutura, CSS para apresentação, JavaScript para lógica
- **Modularização**: Cada funcionalidade em funções específicas
- **Roteamento**: Sistema baseado em IDs do body para identificar páginas

### Gerenciamento de Dados
- **Storage Utilities**: Funções centralizadas para localStorage
- **Relacionamentos**: Sessões relacionam filmes e salas por ID
- **Validação**: Verificações de integridade dos dados

### Interface do Usuário
- **Design Responsivo**: Grid layout que adapta a diferentes telas
- **Feedback Visual**: Mensagens de sucesso e erro
- **Navegação Intuitiva**: Menu fixo em todas as páginas

## Considerações Técnicas

### Limitações
- Dados armazenados apenas localmente (não há backend)
- Capacidade limitada pelo localStorage do navegador
- Imagens convertidas para Base64 (aumentam o tamanho dos dados)

### Compatibilidade
- Navegadores modernos com suporte a ES6+
- LocalStorage habilitado
- JavaScript ativado

## Autor

**Bruno Custodio de Castro**  
Projeto desenvolvido para a disciplina do Professor Daniel

## Estrutura de Commits

O projeto foi desenvolvido com controle de versão Git:
- Branch principal: `main`
- Branch de desenvolvimento: `revisado`
- Commits organizados com mensagens descritivas

## Melhorias Implementadas

### Versão Inicial
- Sistema básico de cadastros
- Interface simples
- Funcionalidades essenciais

### Revisão e Melhorias
- Upload de imagens para filmes
- Interface visual aprimorada
- Validações inteligentes
- Design responsivo completo
- Dashboard com estatísticas
- Recursos especiais para salas
- Formatação melhorada de dados