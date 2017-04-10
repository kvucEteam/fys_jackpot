var scrollTimer;

var scrolling = false;

var betegnelser = ["Størrelse", "Dekadisk præfiks", "SI-enhed", "Videnskabelig notation"];
var prefixes_Array = ["n", "µ", "m", "k", "M", "G"];
var omregnings_Array = [.000000001, .00000001, .0000001, .000001, .00001, .0001, .001, .01, .1, 1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 10000000, 100000000, 1000000000];

var korrekt_Array = [];

var bruger_svar_Array = [];

var level_Array = ["Let", "Mellem", "Svær"]

var overall_score = 0;

var active_scroll_object;

var si;

var fork;

var prefix;
var prefix_lang;

var omregningsfaktor;

var potens;



var level = 2;

var fb_counter = 0;

$(document).ready(function() {

    $("#instruction").html(instruction("Få tallene til at passe sammen med det låste felt ved at scrolle i de tre andre felter. Du kan få brug for en lommeregner."));
    $('#explanation').html(explanation("En størrelse kan udtrykkes på flere forskellige måder. Her skal du træne hvilke andre notationer, der udtrykker den samme værdi."));


    build_select_container();

    $('input[name="level"]:radio').change(function() {
        $(".microhint").remove();
        level = $(this).val();
        $(".microhint").click(function(){
            init();
        });
        if (level == 0) {
            microhint($(this), "Du får nu opgaver kun med milli og kilo som præfikser");
        } else if (level == 1) {
            microhint($(this), "Du får nu opgaver med mikro, milli og kilo og Mega som præfikser");
        } else if (level == 2) {
            microhint($(this), "Du får nu alle opgaver med nano, mikro, milli og kilo, Mega og Giga som præfikser");
        }
    });

    //setInterval(function() { log_scroll(); }, 33);

    $(".btn-tjek").click(tjek_svar);


    init();
});


function init() {


    /*========================================
    =            Init beskrivelse            =
 Init generer random prefix ud fra jsonData, et random nummer ud fra scope. 
 De korrekte værdier ud fra scope og de ruller man skal rulle i 

 Og så er der en del kneppen rundt med at undgå floating point errors og tvungen scientific notation
 

    ========================================*/


    /*=====  End of Init beskrivelse  ======*/


    $(".btn-next").hide(); //(init);
    $(".btn-tjek").show(); //(init);

    var bruger_svar_Array = [];

    korrekt_Array = [];

    $(".jp_container").html("");

    var randomenhed = Math.floor(Math.random() * jsonData.length);

    //console.log("randomenhed: " + randomenhed);

    var enhed = jsonData[randomenhed].storrelse;

    korrekt_Array.push(enhed);

    //console.log("Enhed: " + enhed);

    var randomprefix = Math.floor(Math.random() * jsonData[randomenhed].prefix.length);
    prefix = jsonData[randomenhed].prefix[randomprefix];
    prefix_lang = jsonData[randomenhed].prefix_lang[randomprefix];
    var counter = 0;
    if (level == 0) {


        while (prefix === "M" || prefix === "G" || prefix === "µ" || prefix === "n") {
            counter++;
            console.log("counter: " + counter);
            randomprefix = Math.floor(Math.random() * jsonData[randomenhed].prefix.length);
            prefix = jsonData[randomenhed].prefix[randomprefix];
            prefix_lang = jsonData[randomenhed].prefix_lang[randomprefix];
            console.log("RPF: " + prefix);
        }
    } else if (level == 1) {


        while (prefix === "G" || prefix === "n") {
            counter++;
            console.log("counter: " + counter);
            randomprefix = Math.floor(Math.random() * jsonData[randomenhed].prefix.length);
            prefix = jsonData[randomenhed].prefix[randomprefix];
            prefix_lang = jsonData[randomenhed].prefix_lang[randomprefix];
            console.log("RPF: " + prefix);
        }

    }




    //console.log("prefix is: " + prefix)

    si = jsonData[randomenhed].si;

    /*=================================================
    =            Generer et random nummer:            =
    =================================================*/

    var rand_ciffer = Math.random() * 2 + 1;
    if (rand_ciffer < 1) {
        var randomNo = Math.ceil(Math.random() * 10);
    } else if (rand_ciffer > 1 && rand_ciffer < 2) {
        var randomNo = Math.ceil(Math.random() * 100);
    } else if (rand_ciffer > 1 && rand_ciffer < 3) {
        var randomNo = Math.floor(Math.random() * 1000);
    }

    var randNo_str = randomNo.toString();
    if (randomNo < 10 || randNo_str[randNo_str.length - 1] == 0) {
        init();
        return;
    }




    /*=====  End of Generer et random nummer:  ======*/





    korrekt_Array.push(randomNo + " " + prefix + jsonData[randomenhed].fork);

    //console.log("randomNo: " + randomNo);

    omregningsfaktor;

    if (prefix == "n") {
        omregningsfaktor = .000000001;
    } else if (prefix == "µ") {
        omregningsfaktor = .000001;
    } else if (prefix == "m") {
        omregningsfaktor = .001;
    } else if (prefix == "k") {
        omregningsfaktor = 1000;
    } else if (prefix == "M") {
        omregningsfaktor = 1000000;
    } else if (prefix == "G") {
        omregningsfaktor = 1000000000;
    }

    var omregnetNo = Math.m(omregningsfaktor, randomNo);

    //console.log("OM: " + omregnetNo);

    omregnetNo = omregnetNo.noExponents();

    var omregnet_decimals = countDecimals(randomNo);

    if (omregnet_decimals > 13) {
        //console.log("KØRER IGEN");
        init();
        return;
    }



    //console.log("OM: " + omregnetNo);

    var omregnetNo_str = omregnetNo.toString().replace(".", ",");

    omregnetNo_str = numberWithCommas(omregnetNo_str);

    korrekt_Array.push(omregnetNo_str + " " + si);

    var randomNoString = omregnetNo.toString();



    if (omregnetNo < 1) {
        var scientific = Math.m(omregnetNo, Math.pow(10, randomNoString.length - 4));
        scientific = scientific.noExponents();
        var scientific_string = scientific + " &#9679 10<sup>-" + String(randomNoString.length - 1) + "</sup>"
        potens = "-" + String(randomNoString.length - 1);
    } else {
        var scientific = Math.d(omregnetNo, Math.pow(10, randomNoString.length - 1));
        var scientific_string = scientific + " &#9679 10<sup>" + String(randomNoString.length - 1) + "</sup>"
        potens = String(randomNoString.length - 1);
    }







    //console.log("RANDOM NO: " + randomNo + " SC: " + scientific_string);

    scientific_string = scientific_string.replace(".", ",");


    korrekt_Array.push(scientific_string + " " + jsonData[randomenhed].fork);

    $(".scoreinfo").html("Korrekt_svar: ");
    for (var i = 0; i < korrekt_Array.length; i++) {
        $(".scoreinfo").append(korrekt_Array[i] + ", ");
    }





    //console.log("korrekt_Array: " + korrekt_Array)


    for (var i = 0; i < 4; i++) {
        $(".jp_container").append("<h4 class='betegnelse'>" + betegnelser[i] + ":</h4><div class='overlay_container'><div class='lock_container'><span class='glyphicon glyphicon-resize-vertical'></span></div><div class='number_container'></div></div><div class='equals'>=</div>");



        if (i == 0) {
            for (var u = 0; u < jsonData.length; u++) {
                $(".number_container").eq(i).append("<div class='number'>" + jsonData[u].storrelse + "</div>");
            }
        } else if (i == 1) {
            for (var u = 0; u < prefixes_Array.length; u++) {
                $(".number_container").eq(i).append("<div class='number'>" + randomNo + " " + prefixes_Array[u] + "" + jsonData[randomenhed].fork + "</div>");
            }
        } else if (i == 2) {
            for (var u = 0; u < omregnings_Array.length; u++) {

                //var Math.m(0.1, 0.2);
                var si_decimals = Math.m(randomNo, omregnings_Array[u]);

                var antal_decimaler = countDecimals(si_decimals);

                if (antal_decimaler > 13) {
                    //console.log("KØRER IGEN");
                    init();
                    return;
                }
                //console.log("no exp: " + si_decimals);
                si_decimals = si_decimals.noExponents();
                si_decimals = si_decimals.toString().replace(".", ",");
                si_decimals = numberWithCommas(si_decimals);
                //console.log("no exp: " + si_decimals);


                $(".number_container").eq(i).append("<div class='number'>" + si_decimals + " " + jsonData[randomenhed].si + "</div>");
            }
        } else if (i == 3) {
            for (var u = -12; u < 12; u++) {
                scientific = scientific.toString().replace(".", ",");
                $(".number_container").eq(i).append("<div class='number'>" + scientific + "<span class='dot'> &#9679 </span> 10<sup>" + u + "</sup> " + jsonData[randomenhed].fork + "</div>");
            }
        }


        //$('.number_container').eq(i).scrollTop($('.number_container')[0].scrollHeight / 2);
    }

    $(".equals").eq($(".equals").length - 1).remove();


    var random_lock = Math.floor(Math.random() * 3) + 1;



    $(".number").each(function() {
        //var hue = 'rgba(' + (Math.floor((256 - 199) * Math.random()) + 200) + ',' + (Math.floor((256 - 199) * Math.random()) + 200) + ',' + (Math.floor((256 - 199) * Math.random()) + 200) + ',' + .5 + ')';
        //$(this).css("background-color", "rgba(180, 200, 200, 0.498039)");
    });

    $(".number_container").eq(random_lock).html("<div class='number number_locked'>" + korrekt_Array[random_lock] + "</div>");
    $(".overlay_container").eq(random_lock).find(".glyphicon").removeClass("glyphicon-resize-vertical").addClass("glyphicons glyphicons-lock");


    init_scroll();

    $(".number_container").scroll(function() {

        var indeks = $(".number_container").index($(this));
        console.log("focusin on " + indeks);
        active_scroll_object = $(".number_container").eq(indeks);
        $(".microhint").remove();
    });

    $(".number_container").scrollStopped(function() {

        //var indeks = ev.index();
        //console.log("indeks: " + JSON.stringify(ev));
        alignscrolled(active_scroll_object);
        //scrollstop();
    });

    fork = jsonData[randomenhed].fork;

};


function tjek_svar() {

    var scroll_objekt_indeks = $(".number_container").index(active_scroll_object);
    //active_scroll_object.hide();



    console.log("scroll_objekt_indeks: " + scroll_objekt_indeks);

    var svar_Array = [];

    $(".number_container").each(function(index) {
        //text += "Number_container_" + index + ": Scroll height: " + $(this)[0].scrollHeight + " @ Scroll top: " + $(this).scrollTop() + "<br/>";
        //selected += "Number_container_" + index + ": " + $(this).scrollTop() / $(".number").height();

        var indeks_number = $(this).scrollTop() / $(".number").height();

        if (indeks_number % 1 == 0) {

            //console.log("indeks_number: " + indeks_number);
            var html_svar = $(this).find(".number").eq(indeks_number).html();
            svar_Array.push(html_svar);
        } else {
            svar_Array.push(korrekt_Array[index]);
        }
        //console.log("HTML SVAR: " + html_svar);

    });

    //console.log("SA: " + svar_Array);
    //console.log("KA: " + korrekt_Array);
    $(".scoreinfo").append(".....: " + svar_Array);

    var score = 0;
    if (svar_Array[0] == korrekt_Array[0]) {

        update_locks(0);
        score++;
    } else {
        if (scroll_objekt_indeks == 0) {
            feedback(0);
        }
    }

    if (svar_Array[1] == korrekt_Array[1]) {
        score++;
        update_locks(1);
    } else {
        if (scroll_objekt_indeks == 1) {
            feedback(1);
        }
    }

    if (svar_Array[2] == korrekt_Array[2]) {
        update_locks(2);
        score++;
    } else {
        if (scroll_objekt_indeks == 2) {
            feedback(2);
        }
    }


    var startindeks = korrekt_Array[3].indexOf("<sup>");
    var slutindeks = korrekt_Array[3].indexOf("</sup>");
    var korrekt_potens = korrekt_Array[3].substring(startindeks + 5, slutindeks);
    //console.log("KP: " + korrekt_potens);

    //console.log("SV AR 3: " + svar_Array[3])

    var startindeks = svar_Array[3].indexOf("<sup>");
    var slutindeks = svar_Array[3].indexOf("</sup>");
    var svar_potens = svar_Array[3].substring(startindeks + 5, slutindeks);
    //console.log("SP: " + svar_potens);

    if (korrekt_potens == svar_potens) {
        score++;
        update_locks(3);
    } else {
        if (scroll_objekt_indeks == 3) {
            feedback(3);
        }
    }


    if (score > 3) {
        overall_score++;
        if (overall_score % 2 === 0) {
            microhint($(".btn-tjek"), "Super! Du har lavet <b>" + overall_score + "</b> rigtige omregninger.");
        } else if (overall_score < 3) {
            //microhint($(".btn-tjek"), "<p>Du har svaret korrekt på alle enheder. Klik på næste for at går videre.", "#2ABB2A");
            microhint($(".btn-tjek"), "Du har succesfuldt omregnet mellem alle enhederne. Klik på 'Næste'");
        }

        $(".btn-tjek").hide();
        $(".btn-next").show();



        $(".scoreText").html("Korrekte svar: <b>" + overall_score + "</b>");
        $(".btn-next").click(init);


    } else {

    }


    //console.log("Scrore: " + score);
}

function feedback(num) {

    $(".microhint").remove();
    console.log("feedback til: " + num + " fb_counter: " + fb_counter);
    if (num == 3) {
        microhint($(".number_container").eq(num), "<div class='microhint_label_danger'>Du har ikke " + betegnelser[num] + " korrekt</div>Potensen udtrykker hvor mange pladser kommaet er flyttet til højre eller venstre.");
    } else if (num == 2) {
        microhint($(".number_container").eq(num), "<div class='microhint_label_danger'>Du har ikke " + betegnelser[num] + " korrekt</div>Du skal gange si-enheden med " + omregningsfaktor);

    } else if (num == 1) {
        microhint($(".number_container").eq(num), "<div class='microhint_label_danger'>Du har ikke " + betegnelser[num] + " korrekt</div>Det dekadiske præfiks angiver en potens af grundtallet ti, stillet foran enheden. Tip: " + prefix + " står for " + prefix_lang + " og er enheden ganget med " + omregningsfaktor);
    } else if (num == 0) {
        microhint($(".number_container").eq(num), "<div class='microhint_label_danger'>Du har ikke størrelsen korrekt</div>Hvad er det der måles i " + si + "?");

    }


}

function update_locks(index) {

    //$(this).find(".lock_container").hide();
    if ($(".overlay_container").eq(index).find(".lock_container").find(".glyphicon").hasClass("glyphicon-resize-vertical")) {
        microhint($(".number_container").eq(index), "Korrekt", "green");
        $(".lock_container").eq(index).fadeOut(1500, function() {

            $(".number_container").eq(index).html("<div class='number number_locked'>" + korrekt_Array[index] + "</div>");
            $(".overlay_container").eq(index).find(".glyphicon").removeClass("glyphicon-resize-vertical").addClass("glyphicons glyphicons-lock");
            $(".lock_container").eq(index).fadeIn(100);
        });



    }

}



function init_scroll() {

    $(".number_container").each(function() {
        var children = $(this).find(".number").length - 1;
        var rand_scroll = Math.floor(Math.random() * children) + 1;
        var scrollinit = rand_scroll * $(".number").height();

        console.log("init_scroll: " + rand_scroll);
        $(this).animate({ scrollTop: scrollinit }, 200, function() {





            //$(".number_container").on("scrollstop", scrollstop);

        });
    });

}


function alignscrolled(obj) {
    //var indeks = obj.index();

    //console.log("fyrer alignscrolled på : " + indeks);
    scrolling = true;


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
            //$(".number_container").on("scrollstop", scrollstop);

        });

        //        console.log("new scrolltop: "); //+ obj[0].scrollTop - remaining_scroll);

    } else {

        remaining_scroll = $(".number").height() - remaining_scroll;

        console.log("RS: " + remaining_scroll);

        var scrollingnum = obj[0].scrollTop + remaining_scroll;

        //obj.scrollTop(obj[0].scrollTop + remaining_scroll);

        obj.animate({ scrollTop: obj[0].scrollTop + remaining_scroll }, 100, function() {
            //$(".number_container").on("scrollstop", scrollstop);

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

    //$(".scrollinfo").html(text + ", " + selected);


}

function build_select_container() {
    var HTML = "";
    //var HTML = "<div class='toggle_btn'><span class='toggleglyph glyphicon glyphicon-chevron-down'></span><span class='valg_txt'>Klik for at vælge hvilke fysiske størrelser du vil træne</span></div>";
    HTML += "<div class='cb_container'>";
    for (var i = 0; i < level_Array.length; i++) {

        HTML += " <label class='input_p'><input class='checkboxes_str' checked type='radio' name='level' value=" + i + "><span class='checkbox_txt'>" + level_Array[i] + "</span></label>";

    }

    HTML += "</div>";

    $(".select_container").html(HTML);



}

/*========================================
=            Remove exponents            =
========================================*/


Number.prototype.noExponents = function() {
    //console.log("ATTEMPT NO EXP")
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


    //console.log("CD:  " + value);
    if (Math.floor(value) !== value)
        return value.toString().split(".")[1].length || 0; //** NB denne linje ved jeg ikke rigtig hvad gør? 
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

function numberWithCommas(x) {
    //console.log("KØRER NWC: " + x);
    var parts = x.toString().split(",");

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    if (parts.length > 1) {

        var part_reversed = parts[1].split('').reverse().join('');
        //console.log("REVERSE: " + parts[1] + ", " + part_reversed);
        part_reversed = part_reversed.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        //console.log("REVERSE: " + parts[1] + ", " + part_reversed);
        parts[1] = part_reversed.split('').reverse().join('');

        //console.log("REVERSE: " + parts[1] + ", " + part_reversed);
    }

    return parts.join(",");
}

//console.log("JFSAJFKDSLA: " + numberWithCommas(0.0000000001));


$.fn.scrollStopped = function(callback) {
    var that = this,
        $this = $(that);
    $this.scroll(function(ev) {
        clearTimeout($this.data('scrollTimeout'));
        $this.data('scrollTimeout', setTimeout(callback.bind(that), 250, ev));
    });
};
