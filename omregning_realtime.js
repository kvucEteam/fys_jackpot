$(document).ready(function() {

    setInterval(function() {
        $(".inputfield").focus();
        //$(".inputfield").hide();

        translate_input();

        aligncursorpos();

    }, 33)
});


function translate_input() {

    var translate_text = $(".inputfield").val();
    translate_text = translate_text.replace(/!/g, "<sup>1</sup>");
    translate_text = translate_text.replace(/"/g, "<sup>2</sup>");
    translate_text = translate_text.replace(/#/g, "<sup>3</sup>");
    translate_text = translate_text.replace(/€/g, "<sup>4</sup>");
    translate_text = translate_text.replace(/%/g, "<sup>5</sup>");
    translate_text = translate_text.replace(/&/g, "<sup>6</sup>");
    //translate_text = translate_text.replace(/\//g, "<sup>7</sup>");
    translate_text = translate_text.replace(/\(/g, "<sup>8</sup>");
    translate_text = translate_text.replace(/\)/g, "<sup>9</sup>");
    //translate_text = translate_text.replace(/-/g, "<sup>-</sup>");
    translate_text = translate_text.replace(/-1/g, "<sup>-1</sup>");
    translate_text = translate_text.replace(/01/g, "0<sup>1</sup>");
    translate_text = translate_text.replace(/O/g, "<sup>o</sup>");
    translate_text = translate_text.replace(/M/g, "µ");
    translate_text = translate_text.replace(/m2/g, "m<sup>2</sup>");
    translate_text = translate_text.replace(/m3/g, "m<sup>3</sup>");
    translate_text = translate_text.replace(/oC/g, "<sup>o</sup>C");
    translate_text = translate_text.replace(/oc/g, "<sup>o</sup>C");



    //translate_text = translate_text.replace("#" "<sup>2</sup>");






    $(".input_show").html(translate_text);



}

function aligncursorpos() {

}
