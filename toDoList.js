$(document).ready(function () {

    if (localStorage.getItem('myToDo')) {
        $('.mainMenu').html(localStorage.getItem('myToDo'));

        $('li').each(function () {
            addEvent($(this));
        });
    }
});

function MainMenu(event) {
    var thisForMain = this;
    this.inputText = $('#myInput').val() || $('#secondInput').val();

    this.CreateElementFactory = function () {
        prepareCheckBox.call(this);
        prepareAddItem.call(this);
        prepareDelItem.call(this);
        prepareEditItem.call(this);
        prepareRecycle.call(this);
        prepareSpan.call(this);
        prepareUpDown.call(this);
        prepareShowHide.call(this);

        function prepareShowHide() {
            $firstShowHide = $('<div>', {
                class: 'showHide'
            });
            this.$firstShowHide = $firstShowHide;
        }

        function prepareCheckBox() {
            $firstChekBox = $('<input>', {
                class: 'chekBox',
                type: 'checkbox'
            });
            this.$firstChekBox = $firstChekBox;
        }

        function prepareAddItem() {
            $firstDiv = $('<div>', {
                class: 'addItem'
            });
            this.$firstDiv = $firstDiv;
        }

        function prepareDelItem() {
            $secondDiv = $('<div>', {
                class: 'removeItem'
            });
            this.$secondDiv = $secondDiv;
        }

        function prepareEditItem() {
            $thirdDiv = $('<div>', {
                class: 'editItem'
            });
            this.$thirdDiv = $thirdDiv;
        }

        function prepareRecycle() {
            $closediv = $('<div>', {
                class: 'close'
            });
            this.$closediv = $closediv;
        }

        function prepareSpan() {
            $firstSpan = $('<span>', {
                html: thisForMain.inputText,
                contentEditable: false
            });
            this.$firstSpan = $firstSpan;
        }

        function prepareUpDown() {
            //вверх
            $fourthDivTop = $('<a>', {
                class: 'scrollTop'
            });

            //вниз
            $fourthDivBottom = $('<a>', {
                class: 'scrollBottom'
            });

            //контейнер вверх/вниз
            $fourthDiv = $('<div>', {
                class: 'topBottom'
            });

            this.$fourthDivTop = $fourthDivTop;
            this.$fourthDivBottom = $fourthDivBottom;
            this.$fourthDiv = $fourthDiv;
        }

        //вложенный UL
        this.$firstUL = $('<ul>');
    };

    this.insertToDom = function (main, event) {
        var target = event.target.parentNode.parentNode;
        $firstLi = $('<li>', {
            class: main
        });
        $firstLi.hide();
        this.$fourthDivTop.appendTo(this.$fourthDiv);
        this.$fourthDivBottom.appendTo(this.$fourthDiv);
        delete this.$fourthDivTop;
        delete this.$fourthDivBottom;

        if (main === 'third') {
            this.$firstDiv.hide();
            this.$secondDiv.hide();
            this.$firstShowHide.hide();
        }

        for (elementPart in this) {
            this[elementPart].appendTo($firstLi);
            delete this[elementPart];
        }
        return $firstLi.appendTo($(target).find('ul').eq(0));
    };

    if (!this.inputText) {
        alert('Не введено содержимое')
    } else {
        var newElement = new this.CreateElementFactory();

        if (event.target.parentNode.parentNode.classList.contains('first')) {
            newElement = this.insertToDom.call(newElement, 'second', event);
        } else if (event.target.parentNode.parentNode.classList.contains('second')) {
            newElement = this.insertToDom.call(newElement, 'third', event);
        } else {
            newElement = this.insertToDom.call(newElement, 'first', event);
        }

        newElement.fadeTo('slow', 1);

        addEvent(newElement);

        $('#myInput').val('');
    }
}

function mainEnter(event) {
    if (event.keyCode === 13) {
        new MainMenu(event)
    }
}

function addToStorage() {
    localStorage.setItem('myToDo', $('.mainMenu').html());
}

function addEvent(node) {
    var $listEdit = node.find('.editItem');
    var $thisSpan = node.find('span');
    var $chek = node.find('input');
    var $showHide = node.find('.showHide');
    var $removeItem = node.find('.removeItem');
    var $close = node.find('.close');
    var $scrollTop = node.find('.scrollTop');
    var $scrollBottom = node.find('.scrollBottom');
    var $addItem = node.find('.addItem');

    $addItem.click(function (event) {
        event.stopImmediatePropagation();
        var $secondInput = $('#addSecondItem');

        if ($secondInput.length === 0) {
            event = event.target.parentNode;
            var max = 17;

            if (event.classList.contains('second')) max = 9;
            createSecondElement(event);
        } else {
            $secondInput.remove();
        }

        function createSecondElement(event) {
            //создать вложенный элемент ввода
            var $firstDiv = $("<div>", {
                id: 'addSecondItem'
            });
            var secondFocus = TextForSecondElement(max, event).appendTo($firstDiv);
            buttonForSecondElement(event).appendTo($firstDiv);

            $firstDiv.appendTo(event);
            secondFocus.focus();

            secondFocus.keyup(function (event) {

                if (event.target.value.length > max) {
                    event.target.value = event.target.value.substring(0, max);
                }

                if (event.keyCode === 13) {
                    $('#addSecondButton').trigger('click');
                }
            });
        }

        function TextForSecondElement(max, event) {
            //поле ввода вложенного

            var $firstInput = $('<input>', {
                type: 'text',
                id: 'secondInput'
            });
            return $firstInput;

        }

        function buttonForSecondElement(event) {
            //кнопка добавить вложенного
            $secondInput = $("<input>", {
                type: 'button',
                value: 'add',
                id: 'addSecondButton',
                click: function secondInputCreateElem(event) {
                    var inputText = $('#secondInput').val();

                    if (inputText === '') {
                        alert('Не введено содержимое')
                    } else {
                        var newElement = new MainMenu(event);

                        if ($('#secondInput').length > 0) {
                            $('#addSecondItem').remove();
                        }
                    }
                }
            });
            return $secondInput;
        }
    });

    $addItem.mouseenter(function () {
        $('#help').text('Добавить вложенную задачу (предел вложенности 2)');
    });

    $scrollBottom.click(function (event) {
        event.stopImmediatePropagation();
        var $thisElement = $(this).parent().parent();

        $thisElement.next('li').animate({top: '-=30px'});
        $thisElement.animate({top: '+=30px'}, function () {
            $thisElement.css({top: '0px'});
            $thisElement.next('li').css({top: '0px'});
            $thisElement.next('li').after($thisElement);
        });
    });

    $scrollBottom.mouseenter(function () {
        $('#help').text('Опустить задачу вниз по списку');
    });

    $scrollTop.click(function (event) {
        event.stopImmediatePropagation();
        var $thisElement = $(this).parent().parent();

        $thisElement.prev('li').animate({top: '+=30px'});
        $thisElement.animate({top: '-=30px'}, function () {
            $thisElement.css({top: '0px'});
            $thisElement.prev('li').css({top: '0px'});
            $thisElement.prev('li').before($thisElement);
        });
    });

    $scrollTop.mouseenter(function () {
        $('#help').text('Поднять задачу вверх по списку');
    });

    $close.click(function (event) {
        var div = event.target.parentNode;
        $(div).fadeTo('slow', 0, function () {
            div.remove();
        })
    });

    $close.mouseenter(function () {
        $('#help').text('Удалить текущую задачи со всеми вложенными');
    });

    $removeItem.click(function (event) {
        event.stopImmediatePropagation();
        var targElem = event.target.parentNode.lastChild.lastChild;
        var delElem = event.target.parentNode.lastChild;

        if ((targElem) && (targElem.classList.contains('second')
            || targElem.classList.contains('third'))) {
            $(delElem).fadeTo('slow', 0, function () {
                delElem.removeChild(delElem.lastChild)
            });

        }
    });

    $removeItem.mouseenter(function () {
        $('#help').text('Удалить последнюю вложенную задачу');
    });

    $showHide.click(function () {
        $(this).toggleClass('hidden');

        if ($(this).hasClass('hidden')) {
            $(this).parent().children('ul').hide();
        } else {
            $(this).parent().children('ul').show();
        }
    });

    $showHide.mouseenter(function () {
        $('#help').text('Отобразить/скрыть вложенные элементы');
    });

    $chek.eq(0).click(function () {
        var $chek = node.find('input');
        $chek.eq(0).parent().toggleClass('checked');

        for (var i = 0; i < $chek.length; i++) {

            if ($chek.eq(i).prop('checked') !== $chek.eq(0).prop('checked')) {
                $chek.eq(i).parent().toggleClass('checked');
            }

            $chek.eq(i).prop('checked', $chek.eq(0).prop('checked'));
        }
    });

    $chek.eq(0).mouseenter(function () {
        $('#help').text('Отметить задачу, как завершенную');
    });

    node.eq(0).click(function (event) {
        event.stopImmediatePropagation();

        var $chek = node.find('input');

        if (event.target.classList.contains('first')
            || event.target.classList.contains('second')
            || event.target.classList.contains('third')) {
            $chek.eq(0).prop('checked', !$chek.eq(0).prop('checked'));
            $chek.eq(0).parent().toggleClass('checked');

            for (var i = 0; i < $chek.length; i++) {

                if ($chek.eq(i).prop('checked') !== $chek.eq(0).prop('checked')) {
                    $chek.eq(i).parent().toggleClass('checked');
                }
                $chek.eq(i).prop('checked', $chek.eq(0).prop('checked'));
            }
        }
    });

    $thisSpan.eq(0).click(function (event) {
        (event.target.isContentEditable) ? event.target.contentEditable = false : event.target.contentEditable = true;
        event.target.focus();
    });

    $thisSpan.eq(0).keypress(function (event) {
        var max;

        if (event.target.parentNode.classList.contains('first')) {
            max = 27;
        } else if (event.target.parentNode.classList.contains('second')) {
            max = 17;
        } else max = 8;

        if (event.keyCode === 13) {
            event.preventDefault();
            event.target.contentEditable = false;
        }

        if (event.target.innerHTML.length > max) {
            event.preventDefault();
        }
    });

    $thisSpan.eq(0).mouseenter(function () {
        $('#help').text('Редактировать задачу по щелчку (Enter или второй щелчок - завершить редактирование)');
    });

    //кнопка редактирования
    $listEdit.eq(0).click(function (event) {

        if (event.target.parentNode.classList.contains('first')) {
            $chek.checked = false;
            event.target.parentNode.classList.remove('checked');
        }
        ($thisSpan.eq(0).attr('contentEditable') === 'true') ? $thisSpan.eq(0).attr('contentEditable', 'false') : $thisSpan.eq(0).attr('contentEditable', 'true');
        $thisSpan.focus();
    });

    $listEdit.eq(0).mouseenter(function () {
        $('#help').text('Редактировать текст задачи (завершить Enter)');
    });

    $('ul').sortable({
        connectWith: 'ul',
        stop: function (item,event) {
            var $thisItem = event.item.eq(0)||$(item.toElement);
            var $firstChild = $thisItem.children('ul').children('li');
            var $secondChild = $thisItem.children('ul').children('li').children('ul').children('li');
            $thisItem.removeClass('first second third');

            function showHide(item, showHide) {
                if (showHide) {
                    item.find('.addItem').show();
                    item.find('.removeItem').show();
                    item.find('.showHide').show();
                } else {
                    item.find('.addItem').hide();
                    item.find('.removeItem').hide();
                    item.find('.showHide').hide();
                }
            }

            function changeClass(item, className) {
                item.removeClass('first second third');
                item.addClass(className);
            }

            if ($thisItem.parent().hasClass('mainMenu')) {
                changeClass($thisItem, 'first');
                changeClass($firstChild, 'second');
                changeClass($secondChild, 'third');
                showHide($thisItem, 1);
                showHide($firstChild, 1);
                showHide($secondChild, 0);
            } else if ($thisItem.parent().parent().hasClass('first')) {
                changeClass($thisItem, 'second');
                changeClass($firstChild, 'third');
                showHide($thisItem, 1);
                showHide($firstChild, 0);
                $secondChild.remove();
            } else if ($thisItem.parent().parent().hasClass('second')) {
                changeClass($thisItem, 'third');
                $firstChild.remove();
                showHide($thisItem, 0);
            }

            if (!item.toElement) {
                $thisItem = event.item.eq(0);
                $firstChild = $thisItem.children('ul').children('li');
                $secondChild = $thisItem.children('ul').children('li').children('ul').children('li');
                $thisItem.toggleClass('checked');
                $firstChild.toggleClass('checked');
                $secondChild.toggleClass('checked');
                $thisItem.find('input').prop('checked',!$thisItem.find('input').prop('checked'));
            }


        }
    });

    $('input[name="addItem"]').mouseenter(function () {
        $('#help').text('Добавить элемент');
    });

    $('input[name="Save"]').mouseenter(function () {
        $('#help').text('Сохранить список');
    });

    $('input[name="Clear"]').mouseenter(function () {
        $('#help').text('Удалить сохраненный список');
    });

    $('#myFilter').mouseenter(function () {
        $('#help').text('Фильтр списка');
    });

    $('#myInput').mouseenter(function () {
        $('#help').text('Ввести текст задачи(добавить кнопкой add или Enter)');
    });

    $('li').mouseenter(function () {
        $('#help').text('По щелчку - поставить/снять отметку выполнения, при перетаскивании - перемещение элемента. ' +
            'Все элементы со вложенностью более 2 обрезаются!');
    });

    $('*').mouseleave(function () {
        $('#help').text('Помощь');
    });

}

function filterList(event) {
    var $filteValue = $('#myFilter').val();

    if ($filteValue !== '') {

        $('li.first').each(function () {
            var spanText = $(this).find('span').text();

            if (spanText.substr(0, $filteValue.length) !== $filteValue) {
                $(this).hide();
            } else $(this).show();
        })
    } else {
        $('li.first').show();
    }
}