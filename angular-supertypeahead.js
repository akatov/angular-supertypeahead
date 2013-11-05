angular.module('supertypeahead',
               ['ui.bootstrap', 'contenteditable',
                'template/supertypeahead/supertypeahead.html'])
    .filter('typeaheadHighlight', function() {
        // override typeahead's Highlight filter
        return function (matchItem, query) {
            return matchItem;
        };
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
                element.css('cursor', 'text');
                element.click(function(e){
                    $(this).find('[contenteditable]').focus()
                })
            },
            controller: ['$scope', function($scope) {
              // when text changes, get suggestions,
              // remove the common prefix and shift the dropdown over
              $scope.$watch('model', function(txt, oldTxt) {
                var commonPrefBinaryOp = function(arr1, arr2) {
                  return _.take(arr1, function(e, i) {
                    return _.isEqual(e, arr2[i]);
                  });
                };
                var commonPref = function(arrarr) {
                  return _.reduce(arrarr, commonPrefBinaryOp);
                };
                var isSuffix = function(str, suff) {
                  return str.indexOf(suff, str.length - suff.length)  !== -1;
                };
                var unSuffix = function(str, suff) {
                  if(isSuffix(str, suff)) {
                    return str.substring(0, str.length - suff.length);
                  } else {
                    return str;
                  }
                };
                var isPrefix = function(str, pref) {
                  return str.indexOf(pref, 0) === 0;
                };
                var map2 = function(arrarr, f) {
                  return _.map(arrarr, function(arr) {
                    return _.map(arr, f);
                  });
                };
                var shiftDropdown = function() {
                  var sqep = $('#graphSearchQueryEnd').offset();
                  var tdmp = $('.typeahead.dropdown-menu').offset();
                  if(sqep && tdmp) {
                    $('.typeahead.dropdown-menu').offset({top: tdmp.top, left: sqep.left});
                  }
                };
                setTimeout(shiftDropdown, 0);
                //if(_.contains($scope.trimmedSuggestions, txt)) {
                var endElem = "<span id=\"graphSearchQueryEnd\"></span>";
                if(isSuffix(oldTxt, endElem) && isPrefix(oldTxt, txt) && oldTxt.length === txt.length + endElem.length) return;
                var choice = _.find($scope.suggestions, function(sug) {
                  return isSuffix(sug, txt); 
                });
                if(choice !== undefined) {
                  if(_.isEqual($scope.model, choice)) {
                    $scope.model += endElem;
                  } else if(!isPrefix(txt, oldTxt)) {
                    $scope.model = choice + endElem;
                  }
                }
                var unSuffTxt = unSuffix(txt, endElem);
                var sugs = $scope.suggestions = $scope.suggest(unSuffTxt);
                var prefWords = commonPref(_.map(sugs.concat([unSuffTxt.replace('&nbsp;', ' ')]), function(str) {
                  return str.split(' ');
                }));
                if(prefWords) {
                  var pref = prefWords.join(' ');
                  $scope.trimmedSuggestions = _(sugs).map(function(sug) {
                    return sug.substring(pref.length);
                  }).compact().value();
                }
                // measure common prefix
                // shift dropdown
              });
            }]
        };
    });

angular.module('template/supertypeahead/supertypeahead.html', [])
    .run(['$templateCache', function($templateCache){
        $templateCache
            .put('template/supertypeahead/supertypeahead.html',
                 '<span'
                 + ' style="display: inline-block; min-width: 10px"'
                 + ' onfocus="this.style.outline=\'none\'"'
                 + ' ng-model="model"'
                 // contenteditable has to come AFTER typeahead
                 //+ ' typeahead="sugg for sugg in suggest($viewValue)"'
                 + ' typeahead="sugg for sugg in trimmedSuggestions"'
                 + ' contenteditable="true"'
                 + ' strip-br="true"'
                 + ' no-line-breaks="true"'
                 + ' select-non-editable="true"'
                 + '></span>' );
    }]);
