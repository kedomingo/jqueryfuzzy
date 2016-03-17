(function ( $ ) {

    $.fn.fuzzy = function( options ) {

        var thiz = this;
        var settings = $.extend({
            // These are the defaults.
            minLength: 3,
            dataset: {},
            searchkey: 'title'
        }, options );

        this.each(function() {

            $el = $(this);
            $el.keyup(function() {

                var searchKeyword = $el.val().trim().toLowerCase();

                // If erasing, show regions
                if (searchKeyword.length < settings.minLength) {
                    if (searchKeyword.length == 0) {
                        $el.blur(); // remove focus from input text to prevent infinite loop
                    }
                    $el.trigger('fuzzy.clear');
                    return;
                }

                var i;
                var matches = [];
                for (i in settings.dataset) {
        
                    var title = settings.dataset[i][settings.searchkey].trim();
                    var regex = new RegExp('(.*)('+searchKeyword.split('').join(')(.*)(')+')(.*)', 'i');
                    var _matches = title.match(regex);
                    if (!_matches) {
                        continue;
                    }
                    match = settings.dataset[i];
                    match['hlString'] = '<div class="hltitle">'+$el.fuzzyHighlight(searchKeyword, _matches)+'</div>';
                    matches.push(match);
                }
                $el.trigger('fuzzy.search', [matches]);
            });
        });

        return this;
    };

    $.fn.fuzzyHighlight = function (searchKeyword, matches)
    {
        var result = '';
        // Remove first element
        matches.shift();
        var i, j, term;
        for (i = 0, j = searchKeyword.length; i < j; i++) {
            term = matches.shift();
            while (matches.length > 0 &&  term.toLowerCase() != searchKeyword[i].toLowerCase()) {
                result += term;
                term = matches.shift();
            }
            result += '<span class="hl">'+term+'</span>';
        }
        // Append remaining
        result += matches.join('');
        return result;
    };

}( jQuery ));

