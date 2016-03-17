$(function(){

    var dataset = [];
    var i = 1;
    $('div#dataset .row').each(function(){
        // Make a way to remember this data accessible easily. We assigned an id
        dataset.push({title: $(this).text(), id: $(this).attr('id')});
    });

    $('#searchBar')
        .fuzzy({
            dataset : dataset,
            searchkey: 'title'
        })
        .on('fuzzy.clear', function(e, matches){
            // delete previously highlighted rows
            $('.row.highlight').remove();
            // Show rows
            $('div#dataset .row').show();
        })
        .on('fuzzy.search', function(e, matches){
            // Matches will be the same as dataset, except it now has a new key: hlString (highlight string)

            // delete previously highlighted rows
            $('.row.highlight').remove();
            // Hide rows
            $('div#dataset .row').hide();

            var i;
            for (i in matches) {
                var match = matches[i];
                // Use the id to show the highlighted string
                $row = $('<div class="row highlight">'+match['hlString']+'</div>');
                $('#'+match.id).after($row);
            }
        });
});
