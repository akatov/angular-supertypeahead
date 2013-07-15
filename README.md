# angular-supertypeahead

An AngularJS directive that combines the `angular-contenteditable`'s
`contenteditable` and `angular-bootstrap`'s `typeahead` directives to create a
fancy typeahead module.

## Install

```bash
bower install angular-supertypeahead
```

## Usage

```javascript
angular.module('ngapp', ['supertypeahead'])
.controller('Ctrl', function($scope, filterFilter){
  $scope.model = 'init'
  $scope.suggest = function(val){
    return filterFilter(['<b>sweet home</b> Alabama', '<i>cold</i> Alaska', 'Arizona'], val)
  }
})
```

```html
<supertypeahead model="model" suggest="suggest">
```
