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
              // TODO: watch suggest too
              var updateTrimmedSuggestions = function(txt, oldTxt) {
                txt = $scope.model;
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

                var shiftDropdownByAddingElem = function() {
                  // TODO make these relative to the current directive so
                  // there can be multiple graph search boxes
                  $(".supertypeaheadTextbox").append("<span id='supertypeaheadEnd'></span>");
                  var sqep = $('#supertypeaheadEnd').offset();
                  var tdmp = $('.typeahead.dropdown-menu').offset();
                  if(sqep && tdmp) {
                    $('.typeahead.dropdown-menu').offset({top: tdmp.top, left: sqep.left});
                  } else {
                    console.error("Supertypeahead: not all elements initialized");
                  }
                  $('#supertypeaheadEnd').remove();
                };
                setTimeout(shiftDropdownByAddingElem, 0);
                //shiftDropdownByAddingElem();

                //if(_.contains($scope.trimmedSuggestions, txt))
                var choice = _.find($scope.suggestions, function(sug) {
                  //return isSuffix(sug.trim(), txt.trim());
                  return sug.lastIndexOf(txt.trim()) > 0;
                });
                if(choice !== undefined && txt.length > 0) {
                  if(oldTxt && !isPrefix(txt, oldTxt)) {
                    choice = choice.substring(0, choice.lastIndexOf(txt.trim()) + txt.trim().length);
                    $scope.model = choice;
                  }
                }
                var sugs = $scope.suggestions = $scope.suggest;//(txt);
                var prefWords = commonPref(_.map(sugs.concat([txt.replace('&nbsp;', ' ')]), function(str) {
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
              };
              $scope.$watch('suggest', updateTrimmedSuggestions);
              $scope.$watch('model', updateTrimmedSuggestions);
            }]
        };
    });

angular.module('template/supertypeahead/supertypeahead.html', [])
    .run(['$templateCache', function($templateCache){
        $templateCache
            .put('template/supertypeahead/supertypeahead.html',
                 '<style>'
                 + '.typeahead.dropdown-menu {'
                 + '  transition: none !important;'
                 + '  -webkit-transition: none !important;'
                 + '}'
                 + '</style>'

                 + '<span class="supertypeaheadTextbox"'
                 + ' style="display: inline-block; min-width: 10px"'
                 + ' onfocus="this.style.outline=\'none\'"'
                 + ' ng-model="model"'
                 // contenteditable has to come AFTER typeahead
                 //+ ' typeahead="sugg for sugg in suggest($viewValue)"'
                 + ' typeahead="sugg for sugg in trimmedSuggestions"'
                 + ' typeahead-loading="true"'
                 + ' contenteditable="true"'
                 + ' strip-br="true"'
                 + ' no-line-breaks="true"'
                 + ' select-non-editable="true"'
                 + '></span>' );
    }]);
