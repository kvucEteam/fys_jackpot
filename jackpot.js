var scrollTimer;

var scrolling = false;

var betegnelser = ["Dekadisk prefix", "SI Enhed", "Scientific notation"];

$(document).ready(function() {

    $("#instruction").html(instruction("Få tallene til at passe sammen ved at scrolle i de tre felter."));
    $('#explanation').html(explanation("En størrelse kan udtrykkes på flere forskellige måder. Her skal du træne hvilke andre notationer, der udtrykker den samme værdi."));

    init();
    //populatejp();

    setInterval(function() { log_scroll(); }, 33);

    $(".number_container").on("scrollstop", scrollstop);

});


function scrollstop() {

    clearTimeout(scrollTimer);

    var indeks = $(this).index();

    var obj = $(this);

    scrollTimer = setTimeout(function() {
        $(".number_container").off("scrollstop", scrollstop);

        alignscrolled(obj);

    }, 150);

};

function init() {

    var randomenhed = Math.floor(Math.random() * jsonData.length);

    console.log("randomenhed: " + randomenhed);

    var enhed = jsonData[randomenhed].storrelse;

    console.log("Enhed: " + enhed);

    var randomprefix = Math.floor(Math.random() * jsonData[randomenhed].prefix.length);

    var prefix = jsonData[randomenhed].prefix[randomprefix];

    console.log("prefix: " + prefix)

    var si = jsonData[randomenhed].si;

    var randomNo = Math.floor(Math.random() * 1000);

    console.log("randomNo: " + randomNo);

    var omregningsfaktor;

    if (prefix == "Nano") {
        omregningsfaktor = .000000001;
    } else if (prefix == "Mikro") {
        omregningsfaktor = .000001;
    } else if (prefix == "Milli") {
        omregningsfaktor = .001;
    } else if (prefix == "Kilo") {
        omregningsfaktor = 1000;
    } else if (prefix == "Mega") {
        omregningsfaktor = 1000000;
    } else if (prefix == "Giga") {
        omregningsfaktor = 1000000000;
    }

    var omregnetNo = omregningsfaktor * randomNo;

    var randomNoString = omregnetNo.toString();


    var scientific = omregnetNo / Math.pow(10, randomNoString.length - 1);

    var scientific_string = scientific + " &#9679 10<sup>" + String(randomNoString.length - 1) + "</sup>"

    console.log("RANDOM NO: " + randomNo + " SC: " + scientific_string);

    for (var i = 0; i < 3; i++) {
        $(".jp_container").append("<h4 class='betegnelse'>" + betegnelser[i] + ":</h4><div class='overlay_container'><div class='number_container'></div></div><div class='equals'>=</div>");

        if (i == 0) {
            for (var u = 0; u < 10; u++) {
                $(".number_container").eq(i).append("<div class='number'>" + randomNo + " " + prefix + "" + si + "</div>");
            }
        } else if (i == 1) {
            for (var u = 0; u < 10; u++) {
                $(".number_container").eq(i).append("<div class='number'>" + randomNo * omregningsfaktor + " " + jsonData[randomenhed].si + "</div>");
            }
        } else if (i == 2) {
            for (var u = 0; u < 10; u++) {
                $(".number_container").eq(i).append("<div class='number'>" + scientific_string + " " + si + "</div>");
            }
        }


        //$('.number_container').eq(i).scrollTop($('.number_container')[0].scrollHeight / 2);
    }
    $(".number").each(function() {
        var hue = 'rgba(' + (Math.floor((256 - 199) * Math.random()) + 200) + ',' + (Math.floor((256 - 199) * Math.random()) + 200) + ',' + (Math.floor((256 - 199) * Math.random()) + 200) + ',' + .6 + ')';
        $(this).css("background-color", hue);
    });

};


function populatejp(num) {


};


function alignscrolled(obj) {

    scrolling = true;
    console.log("fyrer alignscrolled")

    var remaining_scroll = obj.scrollTop() % $(".number").height();

    console.log("Dividerer " + obj.scrollTop() + " med " + $(".number").height() + " og får remaining_scroll: " + remaining_scroll)

    if (remaining_scroll < $(".number").height() / 2) {

        console.log("Scrolling down");

        /*$(this).animate({
            scrollTop: "+=" + remaining_scroll
        }, 100);*/

        //obj.scrollTop(obj[0].scrollTop - remaining_scroll);

        //obj.animate({ scrollTop: obj[0].scrollTop - remaining_scroll });

        obj.animate({ scrollTop: obj[0].scrollTop - remaining_scroll }, 100, function() {
            $(".number_container").on("scrollstop", scrollstop);

        });

        //        console.log("new scrolltop: "); //+ obj[0].scrollTop - remaining_scroll);

    } else {

        remaining_scroll = $(".number").height() - remaining_scroll;

        console.log("RS: " + remaining_scroll);

        var scrollingnum = obj[0].scrollTop + remaining_scroll;

        //obj.scrollTop(obj[0].scrollTop + remaining_scroll);

        obj.animate({ scrollTop: obj[0].scrollTop + remaining_scroll }, 100, function() {
            $(".number_container").on("scrollstop", scrollstop);

        });

        console.log("Scrolling up to:  " + scrollingnum + "Scroll top: " + obj[0].scrollTop);
    }

}

function log_scroll() {

    //console.log("update_scroll");

    var text = "";

    var selected = "";

    $(".number_container").each(function(index) {
        text += "Number_container_" + index + ": Scroll height: " + $(this)[0].scrollHeight + " @ Scroll top: " + $(this).scrollTop() + "<br/>";

        selected += "Number_container_" + index + ": " + $(this).scrollTop() / $(".number").height();
    });





    $(".scrollinfo").html(text + ", " + selected);
}
