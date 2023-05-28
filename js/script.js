let slideIndex = 0;

function prevSlide() {
  const slides = document.querySelectorAll('.carrosselSlides img');
  slideIndex = (slideIndex +  slides.length - 1) % slides.length;
  updateSlides();
}
function nextSlide() {
  const slides = document.querySelectorAll('.carrosselSlides img');
  slideIndex = (slideIndex + 1) % slides.length;
  updateSlides();
}

function updateSlides(){
  const slides = document.querySelectorAll('.carrosselSlides img');
  const slideWidth = slides[0].offsetWidth + 20;
  const corrosselSlides = document.querySelectorAll('.carrosselSlides');
  corrosselSlides[0].style.transform = `translateX(${-slideIndex * slideWidth}px)`;
}

const btnBusca = document.getElementById('search')
const busca = document.getElementById('search')
const txtprocura = document.getElementById('keyWord')
const livros = document.getElementById('livros')

const hadleEvent = async (event) => {
  if(event.type === 'click' || (event.type === 'keydown' && event.key === 'Enter')){
    
    event.preventDefault();
    const PrincipalBuscar = txtprocura.value.replace(' ', '+');
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${PrincipalBuscar}`);
    const dados = await res.json();

    if(!dados.items || dados.items.length === 0){

      //cria algo para iniforma que o resultado não foi encontrado

    }else{
      if(location.href != 'https://deborah-andrade.github.io/BookBee.github.io/pagesearch.html'){
        localStorage.setItem('searchResults', JSON.stringify(dados.items));
        location.href = 'https://deborah-andrade.github.io/BookBee.github.io/pagesearch.html';
      }else{
        livros.innerHTML = '';
      
          dados.items.forEach(item => {
            let capaImagem;
            if(item && item.volumeInfo && item.volumeInfo.imageLinks){
              capaImagem = item.volumeInfo.imageLinks.thumbnail;
            }else{
              capaImagem = item.volumeInfo.imageLinks;
            }
            livros.innerHTML = livros.innerHTML + `<div class="conteudoLivros"><img src="${capaImagem}" alt="Capa do livro">
            <li>  ${item.volumeInfo.title}; Pag: ${item.volumeInfo.pageCount} - ${item.volumeInfo.authors} </li></div>`  
          });
        } 
      }
  }
}

txtprocura.addEventListener('keydown', hadleEvent);
busca.addEventListener('click', hadleEvent);

window.addEventListener('load', () => {
  if(window.location.href == 'https://deborah-andrade.github.io/BookBee.github.io/pagesearch.html'){
    const livros = document.getElementById('livros');
    const searchResults = JSON.parse(localStorage.getItem('searchResults'));
  
    livros.innerHTML = '';
    
    searchResults.forEach(item => {
      let capaImagem;
      if(item.volumeInfo.imageLinks.thumbnail != null){
        capaImagem = item.volumeInfo.imageLinks.thumbnail; 
      }else{
        capaImagem = item.imageLinks;
      }
      livros.innerHTML = livros.innerHTML + `<div class="conteudoLivros"><img src="${capaImagem}" alt="Capa do livro">
      <li>  ${item.volumeInfo.title}; Pag: ${item.volumeInfo.pageCount} - ${item.volumeInfo.authors} </li></div>`  
    });
  }
})

function formatarDescricao(descricao){
  const descricaoFormatada = descricao.replace(/<\/?p>/g, '')
  .replace(/<br\s*\/?/gi, '\n').replace(/\<i\s*\>/gi, '')
  .replace(/\<\/b\s*\>/gi, '\n').replace(/\<b\s*\>/gi, '')
  .replace(/\<\/i\s*\>/gi, '');
  return limitarDescricao(descricaoFormatada);
}

function limitarDescricao(descricao){
  if(descricao.length <= 400){
    return descricao;
  } else{
    const descricaoLimitada = descricao.slice(0, 400).trim() + '...';
    return descricaoLimitada;
  }
}

async function exibirDetalheDoLivro(bookId){
  const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
  const data = await response.json();

  if(data.error){
      console.error('Ocorreu um erro ao obter as informações do livro');
      return;
  }

  const livro = {
      id: bookId,
      titulo: data.volumeInfo.title ,
      autor: data.volumeInfo.authors ? data.volumeInfo.authors[0] : 'Autor Desconhecido',
      descricao: data.volumeInfo.description ? data.volumeInfo.description : 'Sem Descrição',
      paginas: data.volumeInfo.pageCount,
      imagem: data.volumeInfo.imageLinks ? data.volumeInfo.imageLinks.thumbnail : 'imagens/1682512674678.png'
  };

  const parametrosURL = new URLSearchParams(livro).toString();
  // const urlDetalheLivros = `https://deborah-andrade.github.io/BookBee.github.io/detalhedolivro.html?${parametrosURL}`;
  const urlDetalheLivros = `http://127.0.0.1:5500/detalhedolivro.html?${parametrosURL}`;
  window.location.href = urlDetalheLivros;
}

const parametrosURL = new URLSearchParams(window.location.search);

const livro ={
  id: parametrosURL.get('id'),
  titulo: parametrosURL.get('titulo'),
  autor: parametrosURL.get('autor'),
  descricao: parametrosURL.get('descricao'),
  paginas: parametrosURL.get('paginas'),
  imagem: parametrosURL.get('imagem')
};

document.querySelector("#tituloLivro").textContent = livro.titulo;
document.querySelector("#autorLivro").textContent = livro.autor;
document.querySelector("#descricaoLivro").textContent = formatarDescricao(livro.descricao)
document.querySelector("#numPagina").textContent = livro.paginas;
document.querySelector("#imgCapaLivro").setAttribute('src', livro.imagem);

function adicionarClassificacaoEstrela() {
  const estrelas = document.querySelectorAll(".exibirClassificacao li i");

  estrelas.forEach((estrela, index) => {
    estrela.addEventListener("mouseenter", () => {
      resetarClassificacaoEstrela();

      for (let i = 0; i <= index; i++) {
        estrelas[i].classList.remove("bi-star");
        estrelas[i].classList.add("bi-star-fill");
      }
    });
  });
}

function resetarClassificacaoEstrela() {
  const estrelas = document.querySelectorAll(".exibirClassificacao li i");

  estrelas.forEach((estrela) => {
    estrela.classList.remove("bi-star-fill");
    estrela.classList.add("bi-star");
  });
}