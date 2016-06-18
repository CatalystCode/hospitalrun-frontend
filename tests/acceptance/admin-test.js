import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'hospitalrun/tests/helpers/start-app';

module('Acceptance | admin', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('visiting /admin', function(assert) {
  runWithPouchDump('admin', function() {
    authenticateUser();
    visit('/admin');
    andThen(function() {
      assert.equal(currentURL(), '/admin');
      select('.lookup-type', 'Visit Types');
      andThen(() => {
        assert.equal(find('h3.panel-title').text(), 'Visit Types', 'Visit Types header is displayed');
        assert.equal(find('td.lookup-type-value:first').text(), 'Admission', 'Admission visit type displays');
        click('button:contains(Update)');
        waitToAppear('.modal-dialog');
        andThen(() => {
          assert.equal(find('.modal-title').text(), 'List Saved', 'Lookup list is saved');
        });
      });
    });
  });
});

test('add new lookup value', function(assert) {
  runWithPouchDump('admin', function() {
    authenticateUser();
    visit('/admin');
    andThen(function() {
      assert.equal(currentURL(), '/admin');
      select('.lookup-type', 'Anesthesiologists');
      click('button:contains(Add Value)');
      waitToAppear('.modal-dialog');
      andThen(() => {
        assert.equal(find('.modal-title').text(), 'Add Value', 'Add value modal is displayed');
        fillIn('.lookup-type-value input', 'Dr Smith');
        click('button:contains(Add):last');
        andThen(() => {
          waitToAppear('td.lookup-type-value:contains(Dr Smith)');
          andThen(() => {
            assert.equal(find('td.lookup-type-value:contains(Dr Smith)').length, 1, 'Added lookup type is added to list');
          });
        });
      });
    });
  });
});

test('delete lookup value', function(assert) {
  runWithPouchDump('admin', function() {
    authenticateUser();
    visit('/admin');
    andThen(function() {
      assert.equal(currentURL(), '/admin');
      select('.lookup-type', 'Anesthesia Types');
      andThen(() => {
        assert.equal(find('td.lookup-type-value:contains(Epidural)').length, 1, 'Have lookup type to delete from list');
        click('button:contains(Delete)');
        andThen(() => {
          assert.equal(find('td.lookup-type-value:contains(Epidural)').length, 0, 'Deleted lookup type is removed from the list');
        });
      });
    });
  });
});

test('Update address options', function(assert) {
  runWithPouchDump('admin', function() {
    authenticateUser();
    visit('/admin/address');
    andThen(function() {
      assert.equal(currentURL(), '/admin/address');
      fillIn('input', 'Address Label');
      click('button:contains(Update)');
      andThen(() => {
        waitToAppear('.modal-dialog');
        andThen(() => {
          assert.equal(find('.modal-title').text(), 'Options Saved', 'Address Options Saved');
        });
      });
    });
  });
});

test('Update workflow options', function(assert) {
  runWithPouchDump('admin', function() {
    authenticateUser();
    visit('/admin/workflow');
    andThen(function() {
      assert.equal(currentURL(), '/admin/workflow');
      click('input:checkbox:eq(0)');
      click('button:contains(Update)');
      andThen(() => {
        waitToAppear('.modal-dialog');
        andThen(() => {
          assert.equal(find('.modal-title').text(), 'Options Saved', 'Workflow Options Saved');
          visit('/admin/workflow');
          andThen(function() {
            assert.equal(currentURL(), '/admin/workflow');
            assert.ok(find('input:checkbox:eq(0)').is(':checked'), 'Admission deposit required - checked');
            assert.notOk(find('input:checkbox:eq(1)').is(':checked'), 'Followup prepayment required - unchecked');
          });
        });
      });
    });
  });
});