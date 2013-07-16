angular.module('supertypeahead',
               ['ui.bootstrap', 'contenteditable',
                'template/supertypeahead/supertypeahead.html'])
    .filter('typeaheadHighlight', function() {
        // override typeahead's Highlight filter
        return function (matchItem, query) {
            return matchItem }})
    .directive('supertypeahead', function() {
        return {
            restrict: 'E',
            scope: {
                model: '=model',
                suggest: '=suggest' },
            templateUrl: 'template/supertypeahead/supertypeahead.html',
            replace: true }})

angular.module('template/supertypeahead/supertypeahead.html', [])
    .run(['$templateCache', function($templateCache){
        $templateCache
            .put('template/supertypeahead/supertypeahead.html',
                 '<span'
                 + ' onclick="angular.element(this).find(\'[contenteditable]\').focus()"'
                 + ' style="border: 2px inset; display: inline-block;'
                 + ' cursor: text; padding: 1px 1px"'
                 + '><span'
                 // make sure this box doesn't disappear
                 // + '<span>&nbsp;</span>'
                 // the main "input" box
                 + ' style="outline-style: none; display: inline-block; min-width: 10px"'
                 + ' ng-model="model"'
                 // contenteditable has to come AFTER typeahead
                 + ' typeahead="sugg for sugg in suggest($viewValue)"'
                 + ' contenteditable="true"'
                 + ' strip-br="true"'
                 + ' select-non-editable="true"'
                 + '></span>'
                 + '</span>')}])
