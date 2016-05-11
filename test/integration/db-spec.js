describe('Basic angular app', function() {
  it('should have a 2 way data binding', function() {
    browser.get('http://localhost:5000');
    element(by.model('hello')).sendKeys('Hey Kat');
    element(by.id('hello')).getText().then(function(text) {
      expect(text).toEqual('Hey Kat');
    });
  });
});
