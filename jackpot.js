var scrollTimer;

var scrolling = false;

var betegnelser = ["Størrelse", "Dekadisk prefix", "SI Enhed", "Scientific notation"];
var prefixes_Array = ["Nano", "Mikro", "Milli", "Kilo", "Mega", "Giga"];
var omregnings_Array = [.000000001, .00000001, .0000001, .000001, .00001, .0001, .001, .01, .1, 1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 10000000, 100000000];

var korrekt_Array = [];

var bruger_svar_Array = [];

$(document).ready(function() {

    $("#instruction").html(instruction("Få tallene til at passe sammen ved at scrolle i de tre felter."));
    $('#explanation').html(explanation("En størrelse kan udtrykkes på flere forskellige måder. Her skal du træne hvilke andre notationer, der udtrykker den samme værdi."));

    init();
    //populatejp();

    setInterval(function() { log_scroll(); }, 33);

    $(".number_container").on("scrollstop", scrollstop);

    $(".btn-tjek").click(tjek_svar);

});


function tjek_svar() {

    var svar_Array = [];

    $(".number_container").each(function(index) {
        //text += "Number_container_" + index + ": Scroll height: " + $(this)[0].scrollHeight + " @ Scroll top: " + $(this).scrollTop() + "<br/>";
        //selected += "Number_container_" + index + ": " + $(this).scrollTop() / $(".number").height();

        var indeks_number = $(this).scrollTop() / $(".number").height();

        var html_svar = $(this).find(".number").eq(indeks_number).html();
        svar_Array.push(html_svar);


    });


    console.log("SA: " + svar_Array);
    console.log("KA: " + korrekt_Array);
    $(".scoreinfo").append(svar_Array);

    var score = 0;
    if (svar_Array[0] == korrekt_Array[0]) {
        score++;
    }

    if (svar_Array[1] == korrekt_Array[1]) {
        score++;
    }

    if (svar_Array[2] == korrekt_Array[2]) {
        score++;
    }


    var startindeks = korrekt_Array[3].indexOf("<sup>");
    var slutindeks = korrekt_Array[3].indexOf("</sup>");
    var korrekt_potens = korrekt_Array[3].substring(startindeks + 5, slutindeks);
    console.log("KP: " + korrekt_potens);

    var startindeks = svar_Array[3].indexOf("<sup>");
    var slutindeks = svar_Array[3].indexOf("</sup>");
    var svar_potens = svar_Array[3].substring(startindeks + 5, slutindeks);
    console.log("SP: " + svar_potens);

    if (korrekt_potens == svar_potens) {
        score++;
    }


    if (svar > 3) {
        alert("yes sir - korrekt svar");
        init();
    } else {
        alert("Det er ikke helt rigtigt");
    }

}


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


    korrekt_Array = [];

    $(".jp_container").html("HEJ");

    var randomenhed = Math.floor(Math.random() * jsonData.length);

    console.log("randomenhed: " + randomenhed);

    var enhed = jsonData[randomenhed].storrelse;

    korrekt_Array.push(enhed);

    console.log("Enhed: " + enhed);

    var randomprefix = Math.floor(Math.random() * jsonData[randomenhed].prefix.length);

    var prefix = jsonData[randomenhed].prefix[randomprefix];

    console.log("prefix is: " + prefix)

    var si = jsonData[randomenhed].si;

    var randomNo = Math.floor(Math.random() * 1000);

    korrekt_Array.push(randomNo + " " + prefix + si);

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

    var omregnetNo = Math.m(omregningsfaktor, randomNo);

    console.log("OM: " + omregnetNo);

    omregnetNo = omregnetNo.noExponents();

    console.log("OM: " + omregnetNo);

    korrekt_Array.push(omregnetNo + " " + si);

    var randomNoString = omregnetNo.toString();

    if (omregnetNo < 1) {
        var scientific = Math.m(omregnetNo, Math.pow(10, randomNoString.length - 4));
        scientific = scientific.noExponents();
        var scientific_string = scientific + " &#9679 10<sup>-" + String(randomNoString.length - 1) + "</sup>"
    } else {
        var scientific = Math.d(omregnetNo, Math.pow(10, randomNoString.length - 1));
        var scientific_string = scientific + " &#9679 10<sup>" + String(randomNoString.length - 1) + "</sup>"
    }





    console.log("RANDOM NO: " + randomNo + " SC: " + scientific_string);

    korrekt_Array.push(scientific_string);


    for (var i = 0; i < korrekt_Array.length; i++) {
        $(".scoreinfo").append("<h4>" + korrekt_Array[i] + "</h4>");
    }




    console.log("korrekt_Array: " + korrekt_Array)


    for (var i = 0; i < 4; i++) {
        $(".jp_container").append("<h4 class='betegnelse'>" + betegnelser[i] + ":</h4><div class='overlay_container'><div class='number_container'></div></div><div class='equals'>=</div>");
        if (i == 0) {
            for (var u = 0; u < jsonData.length; u++) {
                $(".number_container").eq(i).append("<div class='number'>" + jsonData[u].storrelse + "</div>");
            }
        } else if (i == 1) {
            for (var u = 0; u < prefixes_Array.length; u++) {
                $(".number_container").eq(i).append("<div class='number'>" + randomNo + " " + prefixes_Array[u] + "" + si + "</div>");
            }
        } else if (i == 2) {
            for (var u = 0; u < omregnings_Array.length; u++) {

                //var Math.m(0.1, 0.2);
                var si_decimals = Math.m(randomNo, omregnings_Array[u]);

                var antal_decimaler = countDecimals(si_decimals);

                if (antal_decimaler > 13) {
                    console.log("KØRER IGEN");
                    init();
                    return;
                }
                //console.log("no exp: " + si_decimals);
                si_decimals = si_decimals.noExponents();
                //console.log("no exp: " + si_decimals);
                $(".number_container").eq(i).append("<div class='number'>" + si_decimals + " " + jsonData[randomenhed].si + "</div>");
            }
        } else if (i == 3) {
            for (var u = -12; u < 12; u++) {
                $(".number_container").eq(i).append("<div class='number'>" + scientific + "<span class='dot'> &#9679 </span> 10 <sup>" + u + "</sup></div>");
            }
        }


        //$('.number_container').eq(i).scrollTop($('.number_container')[0].scrollHeight / 2);
    }
    $(".number").each(function() {
        var hue = 'rgba(' + (Math.floor((256 - 199) * Math.random()) + 200) + ',' + (Math.floor((256 - 199) * Math.random()) + 200) + ',' + (Math.floor((256 - 199) * Math.random()) + 200) + ',' + .6 + ')';
        $(this).css("background-color", hue);
    });


    var random_lock = Math.floor(Math.random() * 3)+1;

    $(".number_container").eq(random_lock).html("<div class='number number_locked'>" + korrekt_Array[random_lock]+ "</div>");

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

/*========================================
=            Remove exponents            =
========================================*/


Number.prototype.noExponents = function() {
    console.log("ATTEMPT NO EXP")
    var data = String(this).split(/[eE]/);
    if (data.length == 1) return data[0];

    var z = '',
        sign = this < 0 ? '-' : '',
        str = data[0].replace('.', ''),
        mag = Number(data[1]) + 1;

    if (mag < 0) {
        z = sign + '0.';
        while (mag++) z += '0';
        return z + str.replace(/^\-/, '');
    }
    mag -= str.length;
    while (mag--) z += '0';
    return str + z;
}

/*=====  End of Remove exponents  ======*/



var countDecimals = function(value) {
    console.log("CD:  " + value);
    if (Math.floor(value) !== value)
        return value.toString().split(".")[1].length || 0;
    return 0;
}

/*==================================================
=            Deal with floating points:            =
==================================================*/





var _cf = (function() {
    function _shift(x) {
        var parts = x.toString().split('.');
        return (parts.length < 2) ? 1 : Math.pow(10, parts[1].length);
    }
    return function() {
        return Array.prototype.reduce.call(arguments, function(prev, next) {
            return prev === undefined || next === undefined ? undefined : Math.max(prev, _shift(next));
        }, -Infinity);
    };
})();

Math.a = function() {
    var f = _cf.apply(null, arguments);
    if (f === undefined) return undefined;

    function cb(x, y, i, o) {
        return x + f * y;
    }
    return Array.prototype.reduce.call(arguments, cb, 0) / f;
};


Math.s = function(l, r) {
    var f = _cf(l, r);
    return (l * f - r * f) / f;
};

Math.m = function() {
    var f = _cf.apply(null, arguments);

    function cb(x, y, i, o) {
        return (x * f) * (y * f) / (f * f);
    }
    return Array.prototype.reduce.call(arguments, cb, 1);
};

Math.d = function(l, r) {
    var f = _cf(l, r);
    return (l * f) / (r * f);
};


/*=====  End of Deal with floating points:  ======*/
