angular.module('supertypeahead',
               ['ui.bootstrap', 'contenteditable',
                'template/supertypeahead/supertypeahead.html'])
    .filter('typeaheadHighlight', function() {
        // override typeahead's Highlight filter
        return function (matchItem, query) {
            return matchItem
        }
    })
    .directive('supertypeahead', function() {
        return {
            restrict: 'EA',
            scope: {
                model: '=model',
                suggest: '=suggest'
            },
            templateUrl: 'template/supertypeahead/supertypeahead.html',
            replace: false,
            link: function(scope, element, attrs) {
                element.css('cursor', 'text')
                element.click(function(e){
                    $(this).find('[contenteditable]').focus()
                })
            }
        }
    })

angular.module('template/supertypeahead/supertypeahead.html', [])
    .run(['$templateCache', function($templateCache){
        $templateCache
            .put('template/supertypeahead/supertypeahead.html',
                 '<span'
                 + ' style="display: inline-block; min-width: 10px"'
                 + ' onfocus="this.style.outline=\'none\'"'
                 + ' ng-model="model"'
                 // contenteditable has to come AFTER typeahead
                 + ' typeahead="sugg for sugg in suggest($viewValue)"'
                 + ' contenteditable="true"'
                 + ' strip-br="true"'
                 + ' no-line-breaks="true"'
                 + ' select-non-editable="true"'
                 + '></span>' )
    }])
