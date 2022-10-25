$(document).ready(function() {
    
    //при выборе высоты шкафа более 200см в блоке "количество полок" должны быть доступны для выбора варианты от 0 до 10. Если меньше 200см, то от 0 до 5
    $('#height').on('click', function(){
        //если высота больше 200см, удаляем атрибут hidden у полей с количеством полок от 6 до 10 (атрибут установлен по умолчанию в чанке калькулятора)
        if ($('#height :selected').text() > 200) {
            $('option[data-hide]').removeAttr('hidden');
        }
        else {
            //если до изменения высоты количество полок было выбрано от 5 и меньше, то только добавляем hidden для количества полок от 6 до 10
            if ($('#anglenum').prop('selectedIndex') <= 5) {
                $('option[data-hide]').attr('hidden', '');
            }
            //если до изменения высоты количество полок было выбрано больше 5, то скрываем полки 6-10 и ставим селектор количества полок на максимальное доступное значение, равное 5. Иначе в сумму подтянется значение для большего количества полок
            else {
                $('option[data-hide]').attr('hidden', '');
                $('#anglenum').prop('selectedIndex', 5);
            }
        }
    });
    
    //если шиоина шкафа до 120см, то должен быть доступен выбор типа и наполнения только для двух дверей. Поэтому сразу скрываем блок "3 двери", поскольку по умолчанию ширина шкафа установлена на минимальное значение в 90см
    $('#door3').hide();
    
    //получаем из чанка стоимость двух и трёх дверей. Дальше наш список выбора количества дверей перезапишется скриптом и чтобы не потерять эти данные, записываем их в переменные
    let price2d = $('#numdoors').children('option:nth-child(1)').attr('value');
    let price3d = $('#numdoors').children('option:nth-child(2)').attr('value');

    //здесь отслеживаем ширину шкафа, чтобы динамически отображать количество дверей
    $('#width').change(function(){
        let w = $('#width :selected').text();
        let d2 = `<option value="${price2d}">2 двери</option>`;
        let d3 = `<option value="${price3d}">3 двери</option>`;
        //если ширина до 120см, то должен быть доступен вариант только с двумя дверями
        if (w <= 120) {
            $('#numdoors').html(d2);
            $('#door3').slideUp(500);
            $('#doortype3').prop('selectedIndex', 0);   //сбрасываем значение скрытого поля типа двери №3, чтобы оно не подтянулось в итоговую сумму
            $('#indoor3').prop('selectedIndex', 0);     //сбрасываем значение скрытого поля наполнения двери №3, чтобы оно не подтянулось в итоговую сумму
        }
        //если ширина больше 200см, то должен быть доступен вариант только с тремя дверями
        else if (w > 200) {
            $('#numdoors').html(d3);
            $('#door3').slideDown(500);
        }
        //если ширина от 130 до 200см, то должны быть доступны оба варианта на выбор
        else {
            $('#numdoors').html(d2 + d3);
            $('#door3').slideUp(500);
            $('#doortype3').prop('selectedIndex', 0);
            $('#indoor3').prop('selectedIndex', 0);
        }
    });

    //при ширине шкафа от 120 до 200см можно выбирать количество дверей. В зависимости от выбора, динамически прячем или показываем блок для двери №3
    $('#numdoors').change(function(){
        if ($('#numdoors :selected').text() == '3 двери') {
            $('#door3').slideDown(500);
        }
         else {
             $('#door3').slideUp(500);
             $('#doortype3').prop('selectedIndex', 0);  //сбрасываем значение скрытого поля типа двери №3, чтобы оно не подтянулось в итоговую сумму
             $('#indoor3').prop('selectedIndex', 0);    //сбрасываем значение скрытого поля наполнения двери №3, чтобы оно не подтянулось в итоговую сумму
         }
    });
    
    //стоимость типа комбинации дверей не статичная, а зависит от высоты либо ширины шкафа и рассчитывается за метр материала
    //в чанке три одинаковых блока с id "doortype1", "doortype2" и "doortype3". В функцию передаётся только номер блока, который подставляется в айдишник нужного поля
    function combinations(x){
        let n = 0;
        //для "вертикального деления" учитываем высоту
        if ($(`#doortype${x} :selected`).text() == 'деление вертикальное') {
            n += $(`#doortype${x}`).children('option:selected').val() * Math.ceil($('#height').children('option:selected').text() / 100);
        }
        //для "горизонтального деления" учитываем ширину
        else if ($(`#doortype${x} :selected`).text() == 'деление горизонтальное') {
            n += $(`#doortype${x}`).children('option:selected').val() * Math.ceil($('#width').children('option:selected').text() / 100);
        }
        return n;
    }
    
    //здесь считается итоговая сумма
    $('.calcbtn').on('click', function(){
        
        let res = combinations(1) + combinations(2) + combinations(3)
            + $('#depth').children('option:selected').attr('value')*1
            + $('#height').children('option:selected').attr('value')*1
            + $('#width').children('option:selected').attr('value')*1
            + $('#numdoors').children('option:selected').attr('value')*1
            + $('#indoor1').children('option:selected').attr('value')*1
            + $('#indoor2').children('option:selected').attr('value')*1
            + $('#indoor3').children('option:selected').attr('value')*1
            + $('#boxes').children('option:selected').attr('value')*1
            + $('#angle').children('option:selected').attr('value')*1
            + $('#anglenum').children('option:selected').attr('value')*1
            + $('#backwall').children('option:selected').attr('value')*1;

        if ($('#floor').is(':checked')) res += $('#floor').val()*1;
        if ($('#ceil').is(':checked')) res += $('#ceil').val()*1;
        if ($('#back').is(':checked')) res += $('#back').val()*1;
        if ($('#light').is(':checked')) res += $('#light').val()*1;
        
        //если наполнение всех трёх дверей одинаковое, то идёт скидка и сумма считается как за две двери
        if ($('#indoor1').children('option:selected').text() == $('#indoor2').children('option:selected').text() && $('#indoor2').children('option:selected').text() == $('#indoor3').children('option:selected').text()) {
            res -= $('#indoor3').children('option:selected').attr('value')*1;
        }
        
        //умножаем общую сумму на курс доллара, который добавляется через админку и подтягивается с помощью атрибута value скрытого поля с id="kurs"
        res = Math.ceil(res * $('#kurs').attr('value'));

        //выводим результат в <div> с классом "result"
        $('.result').html('<b>' + res + '</b> <small>руб.</small>');
        
        //сбрасываем результат подсчётов, иначе при каждом нажатии на кнопку "рассчитать стоимость" нынешняя сумма будет складываться с предыдущей
        res = 0;
    });
});
