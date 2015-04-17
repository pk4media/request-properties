# request-properties

npm install request-properties [![Circle CI](https://circleci.com/gh/pk4media/request-properties.svg?style=svg&circle-token=5cf45691164d58cf70b5c7ccc4becbe294253acb)](https://circleci.com/gh/pk4media/request-properties)

## Usage

```javascript
var properties = require('request-properties');

app.use(properties({
  someFunctionValue: function() {
    return 'some value';
  },
  someDirectProperty: 1234,
  somePromiseResponse: function(req) {
    return Promise.resolve('some database response');
  }
}));

app.get('/', function(req, res) {
  console.log(req.someFunctionValue); // 'some value'
  console.log(req.someDirectProperty); // 1234
  console.log(req.somePromiseResponse); // 'some database response'
  res.end();
});
```

## Development

* `git clone` this repository
* `npm install`

## Running Tests

* `npm run test`
