//--------------------------------- Смарт Грид

.help{
  @include col();
  @include size(6);
  @include size-md(10);
  @include size-sm(10);
  @include size-xs(18);

  .debug{ //---------------Показать сетку смартгрида
    @include debug(rgba(0, 0, 0, 0.5), 1px solid #ff0);
  }

//================================================


//--------- Шрифты - текст -------------------------


  color: #fff;
  font-size: 1.875rem !important;
  @include helvetica('Bariol-regular');
  letter-spacing: 2px !important; // - изменить растояние между буквами - ширина текста
  text-transform: uppercase;
  word-wrap: break-word;  // что бы текст или слова не выходили за пределы контейнеров  - нужно прописывать в контейнер-врапер
  // но этот пораметр не дружит с Флекс Боксом - так что надо за этим проследить.
  overflow-wrap: break-word; //- лучше вот это решение
  white-space: nowrap; // запретить переносить строку
  line-height: 1.5; // интервал между текстом


    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;

  

//================================================


//------------- Разное ---------------------

background-color: transparent; // прозрачный фон

//================================================



//------------- Flex Box ---------------------

flex-shrink: 0; // запрещает ужиматься
{ // все блоки будут одинаковой высоты (но это не точно - проверить)
  align-items: center;
  align-content: center;
  flex-shrink: 1;
}

//================================================
//------------- Меняем цвет SVG ---------------------

svg * {
  fill: rgb(205, 211, 0);
  transition: fill 0.5s;
}

//================================================


// Центрирование по абсолюту

div {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
}
    top: 50%;
    transform: translate(-50%);



//------------ Тень ----------------------

  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

  text-shadow: 1px 1px 2px black, 0 0 1em #00dcff;


//================================================




//------------ Анимации ----------------------


  transition: .2s ease-in-out;  // делает анимацию как туда так и обратно


  animation: shadow 6s infinite; // вызываем функцию анимации  ( shadow )

  @keyframes shadow {
    0% {
      background: rgba(255, 126, 42, 0.4);
      box-shadow: 2px 10px 94px 25px #ff7e2a; }
    20% {
      background: rgba(0, 255, 1, 0.4);
      box-shadow: 2px 10px 94px 25px lime; }
    40% {
      background: rgba(0, 154, 255, 0.4);
      box-shadow: 2px 10px 94px 25px #009aff; }
    60% {
      background: rgba(255, 0, 0, 0.4);
      box-shadow: 2px 10px 94px 25px red; }
    80% {
      background: rgba(255, 0, 162, 0.4);
      box-shadow: 2px 10px 94px 25px #ff00a2; }
    100% {
      background: rgba(255, 73, 0, 0.4);
      box-shadow: 2px 10px 94px 25px #ff4900; } }


//================================================



//------------ Формы - Инпуты - Кнопки ----------------------

  outline: 0 !important; // уберает рамку у Инпут и Батом


 // бордюр во внутрь блока
  outline: 30px dashed rgba(21, 21, 21, 0.93); /* Пунктирная рамка */
  outline-offset: -10px; /* Выводим рамку внутри элемента */



//================================================





//--------------- как использовать Фонт-Авесоме -------------------
 //  https://fontawesome.ru/all-icons/ -- старые иконки 4.7
//   https://sridharkatakam.com/load-font-awesome-5-wordpress/    - описание как подключать
  // https://fontawesome.com/icons?d=gallery   -- Pro иконки как раз те что мне подходят
//<i class="fa fa-history"></i>
// и самое главное что бы были подключены все шрифты !! Если на экране кубик значит
// какие то шрифты не подключил

  .generic-icon::before {
     margin-right: 10px;
     font-family: "Font Awesome 5 Pro";
   }

  .twitter::before {
    content: "\f099";
  }


//================================================




//------------ стиль скроулинга браузера


  ::-webkit-scrollbar-button {
    background-repeat:no-repeat;
    width:5px;
    height: 0;
  }

  ::-webkit-scrollbar-track {
    background-color:#000;
  }

  ::-webkit-scrollbar-thumb { // цвет полосы
    -webkit-border-radius: 0;
    border-radius: 0;
    background-color:#721c24;
  }

  ::-webkit-scrollbar-thumb:hover{
    background-color:red;
  }

  ::-webkit-resizer{

    background-repeat:no-repeat;
    width:4px;
    height: 0;
  }

  ::-webkit-scrollbar{
    width: 8px;
  }


//================================================









}



//================================================
//================================================
//================================================
//=====================  WordPress  ===========================


//----------------------- Главное меню
/*
<nav>
<ul class="header-menu">

<li id="menu-item-57" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-home menu-item-57"><a href="" class="active">{ main }</a></li>
<li id="menu-item-40" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-40"><a href="">Блог</a></li>
<li id="menu-item-58" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-58"><a href="" class="">Портфолио</a></li>
<li id="menu-item-59" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-59"><a href="" class="">Услуги</a></li>
<li id="menu-item-60" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-60"><a href="">О сайте</a></li>

<li class="lamp" style="left: 0px; width: 88px;"><span></span></li>
</ul>
</nav>

*/








//------------------------- Категории, Архивы, Метки - Виджеты на Панели


/*

<div class="sl-categories widget_categories"><span>Категории</span>
		<ul>
	<li class="cat-item cat-item-17"><a href="">Анимация элементов</a> (4)
<ul class="children">
	<li class="cat-item cat-item-29"><a href="">Кнопки</a> (2)
	<ul class="children">
	<li class="cat-item cat-item-31"><a href="">Тестовая</a> (1)
</li>
	</ul>
</li>
</ul>
</li>
	<li class="cat-item cat-item-1"><a href="">Без рубрики</a> (3)
</li>
	<li class="cat-item cat-item-4"><a href="">Ещё одна рубрика</a> (22)
</li>
	<li class="cat-item cat-item-5"><a href="">Тестовая рубрика</a> (1)
</li>
		</ul>
</div>

 */







//-------------------------------------------- Поиск по сайту

/*

<div class="sl-categories widget_search"><form role="search" method="get" id="searchform" class="searchform" action="https://coderr.ru/">
				<div>
					<label class="screen-reader-text" for="s">Найти:</label>
					<input type="text" value="" name="s" id="s" placeholder="Искать здесь">
					<input type="submit" id="searchsubmit" value="">
				</div>
			</form></div>

 */




//-------------------------------------------- Пагинация постов

/*

<nav class="navigation pagination" role="navigation">
		<div class="nav-links"><span aria-current="page" class="page-numbers current">1</span>
<a class="page-numbers" href="">2</a>
<a class="page-numbers" href="">3</a>
<a class="page-numbers" href="">4</a>
<a class="next page-numbers" href=""><i class="fa fa-angle-double-right" aria-hidden="true"></i></a></div>
	</nav>

 */
















//================================================

