/**
 * Author Kyle Domingo
 */

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
                if (searchKeyword.length < settings.minLength && (typeof $el.data('cleared') == 'undefined' || !$el.data('cleared') )) {
                    if (searchKeyword.length == 0) {
                        $el.data('cleared', true);
                    }
                    $el.trigger('fuzzy.clear');
                    return;
                }

                $el.data('cleared', false);

                var i;
                const priorityMatches = [];
                const secondaryMatches = [];
                const matches = [];
                for (i in settings.dataset) {

                    const title = settings.dataset[i][settings.searchkey];
                    if (title == null) {
                        continue;
                    }

                    var regex = new RegExp('(.*)('+searchKeyword.split('').join(')(.*)(').replace(/n/i, 'n|Ã±|Ã‘')+')(.*)', 'i');
                    var _matches = title.trim().match(regex);
                    if (!_matches) {
                        continue;
                    }
                    match = settings.dataset[i];
                    match['hlString'] = '<div class="hltitle">'+$el.fuzzyHighlight(searchKeyword, _matches)+'</div>';

                    // Starts with search term
                    if (title.trim().toLowerCase().indexOf(searchKeyword.toLowerCase()) === 0) {
                        priorityMatches.push(match);
                    }
                    // contains exact series of search term
                    else if (title.trim().toLowerCase().indexOf(searchKeyword.toLowerCase()) > 0) {
                        secondaryMatches.push(match);
                    }
                    else {
                        matches.push(match);
                    }
                }

                const sorter = (a, b) => {
                    if (a['name'] === b['name']) return 0;

                    return a['name'].localeCompare(b['name']);
                };

                $el.trigger('fuzzy.search', [priorityMatches.sort(sorter).concat(secondaryMatches.sort(sorter), matches.sort(sorter))]);
            });
        });

        return this;
    };

    $.fn.fuzzyHighlight = function (searchKeyword, matches)
    {
        var result = '';
        // Remove first element
        matches.shift();
        var i, j, term, currChar;
        for (i = 0, j = searchKeyword.length; i < j; i++) {
            term = matches.shift();

            currChar = [searchKeyword[i].toLowerCase()];
            if (searchKeyword[i].toLowerCase() == 'n') {
                currChar.push('Ã±');
                currChar.push('Ã‘');
            }

            while (matches.length > 0 && currChar.indexOf(term.toLowerCase()) === -1) {
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
