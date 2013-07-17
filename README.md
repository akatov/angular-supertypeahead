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
  $scope.model2 = 'init2'
  $scope.suggest = function(val){
    return filterFilter(['<b>sweet home</b> Alabama', '<i>cold</i> Alaska', 'Arizona'], val)
  }
})
```

```html
<supertypeahead model="model" suggest="suggest">
<div supertypeahead model="model2" suggest="suggest">
```

## Notice

For the caret to always appear to be on the far right, we create an inside
`span` which has `display` set to `inline-block` and has a `min-width`, which
is the actual `contenteditable` element. This makes the the inside `span` as
narrow as possible for the caret to always immediately follow the contents.

The outside element (the `<supertypeahead>` element itself or
`<div supertypeahead>`), or its container *SHOULD NOT* have `display` set to
`inline`, otherwise the caret will disappear at the end immediately after a
`span` with `contenteditable` set to `false`. Its `display` should be `block`
instead, or alternatively `inline-block`, provided that no other elements are
following it directly.
