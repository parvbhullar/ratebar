jQuery.fn.extend({
    ratebar: function (opt) {
        var options = {
            colors : ["bd2c33","bd2c33", "e49420", "e49420", "ecdb00", "ecdb00", "3bad54", "3bad54", "FFFFFF", "FFFFFF"],
            defaultColor : "333333",
            animationTime: 500,
            bars: 10,
            barValues:[1,2,3,4,5,6,7,8,9,10],
            selected:null, // initial rating
            text: "My Bar",
            showText:true,
            showValues:false, // display rating values on the bars?
            showSelectedRating:true, // append a div with a rating to the widget?
            reverse:false, // reverse the rating?
            readonly:false, // make the rating ready-only?
            onSelect:function (index, value) {
            }, // callback fired when a rating is selected
            onHover:function (index, value) {
            }, // callback fired when a rating is selected
            onClear:function (value, text) {
            }, // callback fired when a rating is cleared
            onDestroy:function (value, text) {
            } // callback fired when a widget is destroyed
        }
        $.extend( options, opt );

        //Adjust the selected index
        if(options.selected != null){
            options.selected = options.selected-1;
        }
        var me = this;
        var selectedColor = options.defaultColor;
        var barTemplate = '<li><a href="#" style="background-color: #'+options.defaultColor+';">{{value}}</a></li>';

        var create = function (options){
            $(me).html("");
            for(i=0; i < options.bars; i++){
                $(me).append(barTemplate.replace("{{value}}",options.barValues[i]));
            }
            if(options.selected != null){
                colourize(options.selected, options);
            }
            if(options.showText){
                // Add the text to the rating info box
                $("<p />").html(options.text).appendTo(ratingInfo);
            }
        }

        // Function to colorize the right ratings
        var colourize = function(count, options) {
            $(me).find("li a").each(function() {
                if($(this).parent().index() <= count) {
                    selectedColor = options.colors[count];
                    $(this).stop().animate({ backgroundColor : "#" + selectedColor } , options.animationTime);
                } else {
                    $(this).stop().animate({ backgroundColor : "#" + options.defaultColor } , options.animationTime);
                }
            });
        };

        //set animation on hover
        var onHover = function(){
            $(me).find("li a").each(function() {
                $(this).hover(function() {
                    // Empty the rating info box and fade in
                    //ratingInfo.empty().stop().animate({ opacity : 1 }, options.animationTime);
                    // Call the colourize function with the given index
                    colourize($(this).parent().index(), options);
                    options.onHover.call(null, $(this).parent().index(), options.text);
                }, function() {
                    // Fade out the rating information box
                    //ratingInfo.stop().animate({ opacity : 0 }, options.animationTime);
                    // Restore all the rating to their original colours
                    reDraw($(this).parent().index());
                });
            });
        }

        //Handle on click
        var onClick = function(){
            $(me).find("li a").each(function() {
                $(this).click(function(e) {
                    e.preventDefault();
//                    alert("You voted on item number " + ( + 1));
                    options.selected = $(this).parent().index();
                    options.onSelect.call(null, options.selected, options.text);
                });
            });
        }

        //Handle last selected value
        var reDraw = function(index){
            $(me).find("li a").each(function() {
                var color = options.defaultColor;
                if(($(this).parent().index() > options.selected || options.selected == null)) {
                    $(this).stop().animate({ backgroundColor : "#" +color } , options.animationTime);
                } else if(options.selected != null){
                    //selectedColor = options.colors[count];
                    $(this).stop().animate({ backgroundColor : "#" +options.colors[options.selected] } , options.animationTime);
                }
            });
        }

        if(options.showText){
            // Add rating information box after rating
            var ratingInfo = $("<div />").attr("class", "ratinginfo").attr("id", $(this).attr('id')+"info").insertAfter($(this));
        }
        //create rating bar
        create(options);
        // Handle the hover events
        onHover(options);
        //Call onclick
        onClick(options);

        var select = function(index){
            options.selected = index;
            reDraw(index);
            options.onSelect.call(null, options.selected, options.text);
        }

        return {
            select : select
        }
    }
});
